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

"""LVX Quantum Leap AI Analyst - Advanced Data Extraction and Analysis"""

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompt
from .sub_agents.data_extraction_agent import DataExtractionAgent

MODEL = "gemini-2.0-flash-exp"


# Initialize the Data Extraction Agent
data_extraction_agent = LlmAgent(
    name="data_extraction_agent",
    model=MODEL,
    description=(
        "Advanced Data Extraction Agent that performs sophisticated entity extraction "
        "and relationship inference from company data stored in Google Cloud Storage. "
        "This agent uses Gemini 2.0 Flash for enhanced AI processing and goes beyond "
        "simple data retrieval by actively constructing knowledge graphs through "
        "inferential analysis of business relationships, competitive dynamics, "
        "and market positioning."
    ),
    instruction="""
    You are an advanced Data Extraction Agent specialized in:
    1. Extracting company data from Google Cloud Storage bucket 'lxvquantumleapai'
    2. Performing deep entity extraction (companies, founders, investors, technologies, markets, metrics)
    3. Inferring complex business relationships and competitive dynamics
    4. Constructing knowledge graphs that go beyond simple RAG (Retrieval Augmented Generation)
    5. Providing investment-relevant insights through sophisticated analysis

    When processing company data:
    - Extract ALL relevant entities with high precision
    - Infer relationships that aren't explicitly stated but can be deduced from context
    - Analyze competitive positioning, market dynamics, and growth indicators
    - Provide actionable insights for investment decision-making
    - Maintain high confidence scores for all extractions and inferences

    Focus on creating comprehensive knowledge representations that enable sophisticated investment analysis.
    """,
    output_key="data_extraction_output",
    tools=[],  # Tools will be handled by the DataExtractionAgent class
)


lvx_quantum_leap_analyst = LlmAgent(
    name="lvx_quantum_leap_analyst",
    model=MODEL,
    description=(
        "LVX Quantum Leap AI Analyst is a groundbreaking, AI-powered investment analyst platform "
        "designed as an 'Omniscient Investment Navigator' that leverages advanced Gemini 2.0 Flash "
        "AI model for superior data extraction and entity relationship inference. It transforms "
        "diverse unstructured data into investor-ready actionable strategic insight deal notes. "
        "More than just an analytical tool, it acts as a collaborative, ethically aware, and "
        "end-to-end strategic intelligence partner, setting a new benchmark for data-driven "
        "investment through its deep semantic fusion, multi-agent orchestration, and transparent, "
        "auditable recommendations with accuracy."
    ),
    instruction=prompt.LVX_QUANTUM_LEAP_PROMPT,
    output_key="lvx_quantum_leap_output",
    tools=[
        AgentTool(agent=data_extraction_agent),
    ],
)

root_agent = lvx_quantum_leap_analyst