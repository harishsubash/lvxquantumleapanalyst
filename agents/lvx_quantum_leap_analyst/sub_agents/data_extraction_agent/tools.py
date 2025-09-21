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

"""Tools for Data Extraction Agent"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

from google.cloud import storage
from google.api_core.exceptions import GoogleAPICallError

logger = logging.getLogger(__name__)

class DataExtractionTools:
    """Utility tools for data extraction and processing."""

    def __init__(self, bucket_name: str = "lxvquantumleapai"):
        """
        Initialize data extraction tools.

        Args:
            bucket_name: Google Cloud Storage bucket name
        """
        # Use environment variable if available, otherwise use provided bucket name
        self.bucket_name = os.getenv("GOOGLE_CLOUD_STORAGE_BUCKET_DATA", bucket_name)
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(self.bucket_name)

    def list_available_companies(self) -> Dict[str, Any]:
        """
        List all available companies in the GCS bucket.

        Returns:
            Dict containing company information
        """
        try:
            companies = []
            total_files = 0

            # List all company directories
            blobs = self.storage_client.list_blobs(self.bucket_name, prefix="Company Data/")

            company_dirs = set()
            for blob in blobs:
                if "/" in blob.name:
                    company_dir = blob.name.split("/")[1]
                    if company_dir:
                        company_dirs.add(company_dir)
                        total_files += 1

            # Get details for each company
            for company_name in sorted(company_dirs):
                company_prefix = f"Company Data/{company_name}/"
                company_blobs = list(self.bucket.list_blobs(prefix=company_prefix))

                # Get last updated timestamp
                last_updated = None
                if company_blobs:
                    last_updated = max((blob.updated for blob in company_blobs if blob.updated), default=None)

                companies.append({
                    "name": company_name,
                    "file_count": len(company_blobs),
                    "last_updated": last_updated.isoformat() if last_updated else None
                })

            return {
                "companies": companies,
                "total_companies": len(companies),
                "total_files": total_files
            }

        except GoogleAPICallError as e:
            logger.error(f"GCS API error: {e}")
            return {"error": f"Failed to access GCS bucket: {str(e)}"}
        except Exception as e:
            logger.error(f"Error listing companies: {e}")
            return {"error": f"Failed to list companies: {str(e)}"}

    def validate_company_data(self, company_name: str) -> Dict[str, Any]:
        """
        Validate the completeness and quality of company data.

        Args:
            company_name: Name of the company to validate

        Returns:
            Dict containing validation results
        """
        try:
            company_prefix = f"Company Data/{company_name}/"
            blobs = list(self.bucket.list_blobs(prefix=company_prefix))

            validation = {
                "company_name": company_name,
                "total_files": len(blobs),
                "has_pitch_deck": False,
                "has_founder_checklist": False,
                "file_sizes": {},
                "data_quality_score": 0,
                "validation_timestamp": datetime.utcnow().isoformat()
            }

            for blob in blobs:
                filename = blob.name.split('/')[-1].lower()
                validation["file_sizes"][blob.name] = blob.size

                if 'pitch' in filename and ('deck' in filename or 'presentation' in filename):
                    validation["has_pitch_deck"] = True
                    validation["data_quality_score"] += 50
                elif 'founder' in filename and 'checklist' in filename:
                    validation["has_founder_checklist"] = True
                    validation["data_quality_score"] += 50

            # Additional quality checks
            validation["is_complete"] = validation["has_pitch_deck"] and validation["has_founder_checklist"]
            validation["quality_assessment"] = self._assess_data_quality(validation)

            return validation

        except Exception as e:
            logger.error(f"Error validating company data: {e}")
            return {"error": f"Failed to validate company data: {str(e)}"}

    def _assess_data_quality(self, validation: Dict[str, Any]) -> str:
        """Assess the overall quality of the company data."""
        score = validation["data_quality_score"]

        if score == 100:
            return "Excellent - Complete dataset with both pitch deck and founder checklist"
        elif score >= 50:
            return "Good - Partial dataset available"
        else:
            return "Limited - Minimal data available for analysis"

    def extract_text_preview(self, company_name: str, max_length: int = 1000) -> Dict[str, Any]:
        """
        Extract text previews from company documents.

        Args:
            company_name: Name of the company
            max_length: Maximum length of preview text

        Returns:
            Dict containing text previews
        """
        try:
            company_prefix = f"Company Data/{company_name}/"
            blobs = list(self.bucket.list_blobs(prefix=company_prefix))

            previews = {
                "company_name": company_name,
                "documents": {},
                "extraction_timestamp": datetime.utcnow().isoformat()
            }

            for blob in blobs:
                filename = blob.name.split('/')[-1]

                try:
                    content = blob.download_as_text()
                    preview = content[:max_length] + "..." if len(content) > max_length else content

                    previews["documents"][filename] = {
                        "preview": preview,
                        "full_length": len(content),
                        "truncated": len(content) > max_length
                    }
                except Exception as e:
                    logger.warning(f"Could not extract text from {filename}: {e}")
                    previews["documents"][filename] = {
                        "error": f"Could not extract text: {str(e)}"
                    }

            return previews

        except Exception as e:
            logger.error(f"Error extracting text previews: {e}")
            return {"error": f"Failed to extract text previews: {str(e)}"}

    def get_company_metadata(self, company_name: str) -> Dict[str, Any]:
        """
        Get comprehensive metadata for a company.

        Args:
            company_name: Name of the company

        Returns:
            Dict containing company metadata
        """
        try:
            # Get validation data
            validation = self.validate_company_data(company_name)
            if "error" in validation:
                return validation

            # Get text previews
            previews = self.extract_text_preview(company_name, max_length=500)

            # Combine metadata
            metadata = {
                "company_name": company_name,
                "validation": validation,
                "previews": previews.get("documents", {}),
                "metadata_timestamp": datetime.utcnow().isoformat(),
                "data_readiness": "ready" if validation.get("is_complete") else "partial"
            }

            return metadata

        except Exception as e:
            logger.error(f"Error getting company metadata: {e}")
            return {"error": f"Failed to get company metadata: {str(e)}"}