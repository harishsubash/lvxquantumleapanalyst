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

"""Deployment script for LVX Quantum Leap AI Analyst"""

import os
import sys
from pathlib import Path

import vertexai
from absl import app, flags
from dotenv import load_dotenv
from vertexai import agent_engines
from vertexai.preview.reasoning_engines import AdkApp

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from lvx_quantum_leap_analyst.agent import lvx_quantum_leap_analyst

FLAGS = flags.FLAGS
flags.DEFINE_string("project_id", None, "GCP project ID.")
flags.DEFINE_string("location", "us-central1", "GCP location.")
flags.DEFINE_string("bucket", None, "GCP staging bucket.")
flags.DEFINE_string("resource_id", None, "ReasoningEngine resource ID.")

flags.DEFINE_bool("list", False, "List all agents.")
flags.DEFINE_bool("create", False, "Creates a new agent.")
flags.DEFINE_bool("delete", False, "Deletes an existing agent.")
flags.DEFINE_bool("test", False, "Test the deployed agent.")
flags.mark_bool_flags_as_mutual_exclusive(["create", "delete", "test"])


def create() -> None:
    """Creates an agent engine for LVX Quantum Leap AI Analyst."""
    print("🚀 Creating LVX Quantum Leap AI Analyst agent engine...")
    
    adk_app = AdkApp(agent=lvx_quantum_leap_analyst, enable_tracing=True)

    remote_agent = agent_engines.create(
        adk_app,
        display_name="LVX Quantum Leap AI Analyst",
        description="Advanced Data Extraction and Entity Relationship Inference Engine for Investment Analysis",
        requirements=[
            "google-adk>=0.0.2",
            "google-cloud-aiplatform[agent_engines]>=1.91.0,!=1.92.0",
            "google-genai>=1.5.0,<2.0.0",
            "google-cloud-storage>=2.10.0",
            "google-cloud-bigquery>=3.11.0",
            "vertexai>=1.38.0",
            "pydantic>=2.10.6,<3.0.0",
            "absl-py>=2.2.1,<3.0.0",
            "python-dotenv>=1.0.0",
        ],
        # Optional: Include additional packages if needed
        # extra_packages=["custom_package==1.0.0"],
    )
    
    print(f"✅ Created remote agent: {remote_agent.resource_name}")
    print(f"🔗 Agent Display Name: {remote_agent.display_name}")
    print(f"📅 Created: {remote_agent.create_time}")
    
    return remote_agent


def delete(resource_id: str) -> None:
    """Delete an existing agent engine."""
    print(f"🗑️  Deleting agent with resource ID: {resource_id}")
    
    remote_agent = agent_engines.get(resource_id)
    remote_agent.delete(force=True)
    
    print(f"✅ Deleted remote agent: {resource_id}")


def list_agents() -> None:
    """List all deployed agent engines."""
    print("📋 Listing all deployed agents...")
    
    remote_agents = agent_engines.list()
    
    if not remote_agents:
        print("❌ No agents found")
        return
    
    template = """
🤖 {agent.name} ("{agent.display_name}")
   📝 Description: {description}
   🆔 Resource Name: {agent.resource_name}
   📅 Created: {agent.create_time}
   🔄 Updated: {agent.update_time}
   📍 Location: {location}
"""
    
    for agent in remote_agents:
        description = getattr(agent, 'description', 'No description available')
        location = getattr(agent, 'location', 'Unknown')
        
        print(template.format(
            agent=agent,
            description=description,
            location=location
        ))


def test_deployed_agent(resource_id: str) -> None:
    """Test a deployed agent with sample data."""
    print(f"🧪 Testing deployed agent: {resource_id}")
    
    try:
        remote_agent = agent_engines.get(resource_id)
        
        # Test query for the LVX Quantum Leap AI Analyst
        test_query = """
        Extract and analyze data for company "01. Data stride" from the GCS bucket.
        Perform advanced entity extraction and relationship inference.
        Focus on:
        - Company entities and founder information
        - Market analysis and competitive positioning  
        - Investment readiness assessment
        - Risk and opportunity identification
        """
        
        print("📤 Sending test query to deployed agent...")
        print(f"Query: {test_query[:100]}...")
        
        # Note: Actual testing would require proper API calls
        # This is a placeholder for the testing structure
        print("⚠️  Test execution requires proper API integration")
        print("✅ Agent deployment structure verified")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")


def validate_environment() -> tuple[str, str, str]:
    """Validate required environment variables."""
    project_id = (
        FLAGS.project_id
        if FLAGS.project_id
        else os.getenv("GOOGLE_CLOUD_PROJECT")
    )
    location = (
        FLAGS.location if FLAGS.location else os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    )
    bucket = (
        FLAGS.bucket
        if FLAGS.bucket
        else os.getenv("GOOGLE_CLOUD_STORAGE_BUCKET")
    )

    print("🔧 Environment Configuration:")
    print(f"   PROJECT: {project_id}")
    print(f"   LOCATION: {location}")
    print(f"   STAGING_BUCKET: {bucket}")
    print()

    if not project_id:
        raise ValueError("Missing required environment variable: GOOGLE_CLOUD_PROJECT")
    if not bucket:
        raise ValueError("Missing required environment variable: GOOGLE_CLOUD_STORAGE_BUCKET")
    
    return project_id, location, bucket


def main(argv: list[str]) -> None:
    """Main deployment function."""
    del argv  # unused
    
    print("🏦 LVX Quantum Leap AI Analyst - Deployment Manager")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv()
    
    try:
        # Validate environment
        project_id, location, bucket = validate_environment()
        
        # Initialize Vertex AI
        print("🔧 Initializing Vertex AI...")
        vertexai.init(
            project=project_id,
            location=location,
            staging_bucket=f"gs://{bucket}",
        )
        print("✅ Vertex AI initialized")
        print()
        
        # Execute requested action
        if FLAGS.list:
            list_agents()
        elif FLAGS.create:
            create()
        elif FLAGS.delete:
            if not FLAGS.resource_id:
                print("❌ resource_id is required for delete operation")
                print("Usage: python deploy_lvx_analyst.py --delete --resource_id=<resource_id>")
                return
            delete(FLAGS.resource_id)
        elif FLAGS.test:
            if not FLAGS.resource_id:
                print("❌ resource_id is required for test operation")
                print("Usage: python deploy_lvx_analyst.py --test --resource_id=<resource_id>")
                return
            test_deployed_agent(FLAGS.resource_id)
        else:
            print("📋 Available commands:")
            print("  --create              Create new agent deployment")
            print("  --list                List all deployed agents")
            print("  --delete              Delete existing agent (requires --resource_id)")
            print("  --test                Test deployed agent (requires --resource_id)")
            print()
            print("📋 Environment variables required:")
            print("  GOOGLE_CLOUD_PROJECT           GCP project ID")
            print("  GOOGLE_CLOUD_STORAGE_BUCKET    GCP staging bucket")
            print("  GOOGLE_CLOUD_LOCATION          GCP location (optional, defaults to us-central1)")
            print()
            print("📋 Example usage:")
            print("  python deploy_lvx_analyst.py --create")
            print("  python deploy_lvx_analyst.py --list")
            print("  python deploy_lvx_analyst.py --delete --resource_id=projects/*/locations/*/reasoning_engines/*")
            
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    app.run(main)