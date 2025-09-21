# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Data Extraction Agent - Advanced Entity Extraction and Relationship Inference"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

from google.cloud import storage
import vertexai
from vertexai.generative_models import GenerativeModel

logger = logging.getLogger(__name__)

class DataExtractionAgent:
    """
    Advanced Data Extraction Agent that extracts company data from GCS
    and performs sophisticated entity extraction and relationship inference
    using Gemini AI.
    """

    def __init__(self, bucket_name: str = "lxvquantumleapai", project_id: Optional[str] = None):
        """
        Initialize the Data Extraction Agent.

        Args:
            bucket_name: Google Cloud Storage bucket name
            project_id: Google Cloud project ID for Vertex AI
        """
        # Use environment variable if available, otherwise use provided bucket name
        self.bucket_name = os.getenv("GOOGLE_CLOUD_STORAGE_BUCKET_DATA", bucket_name)
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT")

        # Initialize GCS client
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)

        # Initialize Vertex AI
        if self.project_id:
            vertexai.init(project=self.project_id, location="us-central1")
            self.model = GenerativeModel("gemini-2.0-flash-exp")
        else:
            logger.warning("No Google Cloud project ID provided. AI features will be limited.")
            self.model = None

    def extract_company_data(self, company_name: str) -> Dict[str, Any]:
        """
        Extract and analyze company data from GCS bucket.

        Args:
            company_name: Name of the company to analyze

        Returns:
            Dict containing extracted data, entities, and relationships
        """
        try:
            logger.info(f"Starting data extraction for company: {company_name}")

            # Step 1: Extract raw data from GCS
            raw_data = self._extract_raw_data_from_gcs(company_name)
            if "error" in raw_data:
                return raw_data

            # Step 2: Perform advanced entity extraction and relationship inference
            analysis_result = self._perform_entity_relationship_analysis(raw_data, company_name)

            # Step 3: Structure the final output
            result = {
                "company_name": company_name,
                "extraction_timestamp": datetime.utcnow().isoformat(),
                "raw_data": raw_data,
                "entity_analysis": analysis_result,
                "processing_status": "completed"
            }

            logger.info(f"Data extraction completed for {company_name}")
            return result

        except Exception as e:
            logger.error(f"Error extracting data for {company_name}: {e}")
            return {
                "error": f"Failed to extract company data: {str(e)}",
                "company_name": company_name,
                "extraction_timestamp": datetime.utcnow().isoformat()
            }

    def _extract_raw_data_from_gcs(self, company_name: str) -> Dict[str, Any]:
        """
        Extract raw text data from GCS bucket for the specified company.

        Args:
            company_name: Name of the company directory

        Returns:
            Dict containing raw text data from pitch deck and founder checklist
        """
        try:
            company_prefix = f"Company Data/{company_name}/"
            blobs = list(self.bucket.list_blobs(prefix=company_prefix))

            raw_data = {
                "pitch_deck": None,
                "founder_checklist": None,
                "data_quality": {
                    "completeness_score": 0,
                    "files_found": len(blobs)
                }
            }

            for blob in blobs:
                filename = blob.name.split('/')[-1].lower()

                if 'pitch' in filename and ('deck' in filename or 'presentation' in filename):
                    # Extract pitch deck content
                    content = blob.download_as_text()
                    raw_data["pitch_deck"] = {
                        "filename": blob.name,
                        "content": content,
                        "size": blob.size,
                        "last_updated": blob.updated.isoformat() if blob.updated else None
                    }
                    raw_data["data_quality"]["completeness_score"] += 50

                elif 'founder' in filename and 'checklist' in filename:
                    # Extract founder checklist content
                    content = blob.download_as_text()
                    raw_data["founder_checklist"] = {
                        "filename": blob.name,
                        "content": content,
                        "size": blob.size,
                        "last_updated": blob.updated.isoformat() if blob.updated else None
                    }
                    raw_data["data_quality"]["completeness_score"] += 50

            return raw_data

        except Exception as e:
            logger.error(f"Error extracting raw data from GCS: {e}")
            return {"error": f"Failed to extract raw data: {str(e)}"}

    def _perform_entity_relationship_analysis(self, raw_data: Dict[str, Any], company_name: str) -> Dict[str, Any]:
        """
        Perform advanced entity extraction and relationship inference using Gemini AI.

        Args:
            raw_data: Raw text data from GCS
            company_name: Name of the company being analyzed

        Returns:
            Dict containing entities, relationships, and analysis insights
        """
        try:
            if not self.model:
                # Fallback analysis without AI
                return self._fallback_entity_analysis(raw_data, company_name)

            # Combine all available text content
            combined_text = self._combine_text_content(raw_data)

            if not combined_text:
                return {
                    "entities": [],
                    "relationships": [],
                    "insights": ["No text content available for analysis"],
                    "analysis_method": "fallback"
                }

            # Create comprehensive analysis prompt
            analysis_prompt = self._create_analysis_prompt(combined_text, company_name)

            # Generate analysis using Gemini
            response = self.model.generate_content(analysis_prompt)

            # Parse and structure the response
            return self._parse_gemini_response(response.text, company_name)

        except Exception as e:
            logger.error(f"Error in entity relationship analysis: {e}")
            return self._fallback_entity_analysis(raw_data, company_name)

    def _combine_text_content(self, raw_data: Dict[str, Any]) -> str:
        """Combine text content from pitch deck and founder checklist."""
        texts = []

        if raw_data.get("pitch_deck") and raw_data["pitch_deck"].get("content"):
            texts.append(f"PITCH DECK:\n{raw_data['pitch_deck']['content']}")

        if raw_data.get("founder_checklist") and raw_data["founder_checklist"].get("content"):
            texts.append(f"FOUNDER CHECKLIST:\n{raw_data['founder_checklist']['content']}")

        return "\n\n".join(texts)

    def _create_analysis_prompt(self, text_content: str, company_name: str) -> str:
        """Create a comprehensive analysis prompt for Gemini."""
        return f"""
You are an expert investment analyst and knowledge graph constructor. Analyze the following company data for {company_name} and extract sophisticated entities and relationships.

COMPANY DATA:
{text_content}

TASK: Perform deep entity extraction and relationship inference analysis. Go beyond simple keyword matching - actively infer complex relationships and business insights.

REQUIRED OUTPUT FORMAT (JSON):
{{
  "entities": [
    {{
      "id": "unique_identifier",
      "type": "company|founder|investor|technology|market|metric|product|competitor|customer",
      "name": "entity_name",
      "properties": {{
        "description": "detailed description",
        "confidence": 0.0-1.0,
        "source": "pitch_deck|founder_checklist|inferred"
      }}
    }}
  ],
  "relationships": [
    {{
      "id": "unique_relationship_id",
      "type": "founded_by|invested_in|competes_with|uses_technology|operates_in|shows_metric|partnered_with|acquired|employs|serves",
      "source_entity": "entity_id",
      "target_entity": "entity_id",
      "properties": {{
        "description": "relationship description",
        "strength": 0.0-1.0,
        "evidence": "supporting text or inference",
        "direction": "directed|undirected"
      }}
    }}
  ],
  "insights": [
    "key business insight 1",
    "key business insight 2",
    "strategic observation"
  ],
  "market_analysis": {{
    "market_size": "estimated market size if mentioned",
    "growth_rate": "market growth indicators",
    "competitive_position": "company's competitive position",
    "investment_readiness": "assessment of investment readiness"
  }},
  "risks_and_opportunities": [
    "identified risk or opportunity with explanation"
  ]
}}

INSTRUCTIONS:
1. Extract ALL relevant entities: companies, founders, investors, technologies, markets, metrics, products, competitors, customers
2. Infer COMPLEX relationships: Don't just extract what's explicitly stated - infer business relationships, competitive dynamics, market positions
3. Be SPECIFIC: Use exact names, metrics, and details from the text
4. Be COMPREHENSIVE: Cover all aspects of the business mentioned
5. Be ANALYTICAL: Provide insights that go beyond the raw data
6. Use CONFIDENCE scores: Rate how certain you are about each entity/relationship
7. Focus on INVESTMENT-relevant information: Growth metrics, market position, competitive advantages, risks

Output ONLY valid JSON. No additional text or formatting.
"""

    def _parse_gemini_response(self, response_text: str, company_name: str) -> Dict[str, Any]:
        """Parse Gemini's JSON response and structure it properly."""
        try:
            # Clean the response text (remove markdown formatting if present)
            cleaned_text = response_text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            cleaned_text = cleaned_text.strip()

            # Parse JSON
            analysis_data = json.loads(cleaned_text)

            # Validate and enhance the response
            analysis_data["analysis_timestamp"] = datetime.utcnow().isoformat()
            analysis_data["analysis_method"] = "gemini_ai"
            analysis_data["company_focus"] = company_name

            return analysis_data

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response as JSON: {e}")
            logger.error(f"Response text: {response_text[:500]}...")
            return self._create_fallback_analysis(company_name)

    def _fallback_entity_analysis(self, raw_data: Dict[str, Any], company_name: str) -> Dict[str, Any]:
        """Fallback analysis when AI is not available."""
        logger.warning("Using fallback entity analysis (no AI available)")

        entities = []
        relationships = []
        insights = []

        # Basic entity extraction
        entities.append({
            "id": f"company_{company_name.lower().replace(' ', '_')}",
            "type": "company",
            "name": company_name,
            "properties": {
                "description": f"Company named {company_name}",
                "confidence": 1.0,
                "source": "filename"
            }
        })

        # Basic insights
        if raw_data.get("pitch_deck"):
            insights.append("Pitch deck document available for analysis")
        if raw_data.get("founder_checklist"):
            insights.append("Founder checklist available for analysis")

        return {
            "entities": entities,
            "relationships": relationships,
            "insights": insights,
            "market_analysis": {
                "market_size": "Not analyzed",
                "growth_rate": "Not analyzed",
                "competitive_position": "Not analyzed",
                "investment_readiness": "Basic data available"
            },
            "risks_and_opportunities": ["Analysis limited without AI processing"],
            "analysis_method": "fallback",
            "analysis_timestamp": datetime.utcnow().isoformat()
        }

    def _create_fallback_analysis(self, company_name: str) -> Dict[str, Any]:
        """Create a basic fallback analysis structure."""
        return {
            "entities": [{
                "id": f"company_{company_name.lower().replace(' ', '_')}",
                "type": "company",
                "name": company_name,
                "properties": {
                    "description": f"Company identified: {company_name}",
                    "confidence": 0.8,
                    "source": "filename"
                }
            }],
            "relationships": [],
            "insights": ["Basic company identification completed"],
            "market_analysis": {
                "market_size": "Analysis unavailable",
                "growth_rate": "Analysis unavailable",
                "competitive_position": "Analysis unavailable",
                "investment_readiness": "Limited analysis available"
            },
            "risks_and_opportunities": ["AI analysis unavailable - using basic extraction"],
            "analysis_method": "fallback_error",
            "analysis_timestamp": datetime.utcnow().isoformat()
        }