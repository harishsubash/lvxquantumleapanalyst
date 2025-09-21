# LVX Quantum Leap AI Analyst - Deployment Guide

## 🚀 Deployment Overview

The LVX Quantum Leap AI Analyst can be deployed to Google Cloud Platform using Vertex AI Agent Engines. This enables cloud-based execution with scalable infrastructure and managed AI services.

## 📋 Prerequisites

### 1. Google Cloud Project Setup
```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com  
gcloud services enable bigquery.googleapis.com
```

### 2. Environment Variables
```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_STORAGE_BUCKET="your-staging-bucket"
export GOOGLE_CLOUD_STORAGE_BUCKET_DATA="lxvquantumleapai"  # Data bucket
export GOOGLE_CLOUD_LOCATION="us-central1"  # Optional, defaults to us-central1
```

### 3. Create Staging Bucket
```bash
gsutil mb gs://your-staging-bucket
```

## 🛠️ Deployment Methods

### Method 1: Automated Deployment Script (Recommended)

```bash
# Make script executable
chmod +x deployment/deploy.sh

# Deploy the agent
./deployment/deploy.sh deploy

# List deployed agents
./deployment/deploy.sh list

# Delete an agent
./deployment/deploy.sh delete <resource_id>
```

### Method 2: Manual Python Deployment

```bash
# Navigate to deployment directory
cd deployment

# Create new agent
python deploy_lvx_analyst.py --create

# List all agents
python deploy_lvx_analyst.py --list

# Delete agent
python deploy_lvx_analyst.py --delete --resource_id=<resource_id>

# Test deployed agent
python deploy_lvx_analyst.py --test --resource_id=<resource_id>
```

## 📊 Deployment Configuration

### Agent Specifications
- **Name**: LVX Quantum Leap AI Analyst
- **Model**: Gemini 1.5 Pro
- **Features**: Advanced Data Extraction & Entity Relationship Inference
- **Tracing**: Enabled for debugging and monitoring

### Required Dependencies
```
google-adk>=0.0.2
google-cloud-aiplatform[agent_engines]>=1.91.0,!=1.92.0
google-genai>=1.5.0,<2.0.0
google-cloud-storage>=2.10.0
google-cloud-bigquery>=3.11.0
vertexai>=1.38.0
pydantic>=2.10.6,<3.0.0
```

## 🔧 Post-Deployment Configuration

### 1. Verify Deployment
```bash
# Check deployment status
./deployment/deploy.sh list

# Test with sample data
python -c "
from deployment.deploy_lvx_analyst import test_deployed_agent
test_deployed_agent('your-resource-id')
"
```

### 2. Configure Data Access
Ensure the deployed agent has access to:
- GCS bucket `lxvquantumleapai` for data extraction
- BigQuery dataset for knowledge graph storage
- Vertex AI API for entity extraction

### 3. Set Up Monitoring
- Enable Cloud Logging for agent execution logs
- Configure alerting for failed executions
- Monitor API quotas and usage

## 🚀 Usage After Deployment

### API Access
```python
from vertexai import agent_engines

# Get deployed agent
agent = agent_engines.get("your-resource-id")

# Query the agent
response = agent.query("Analyze company data for '01. Data stride'")
```

### Web Interface
- Access through Google Cloud Console
- Agent Engines section in Vertex AI
- Interactive testing and monitoring

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

2. **API Not Enabled**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

3. **Insufficient Permissions**
   - Ensure service account has `aiplatform.admin` role
   - Grant `storage.objectViewer` for GCS access
   - Grant `bigquery.dataEditor` for BigQuery access

4. **Resource Quota Exceeded**
   - Check Vertex AI quotas in Cloud Console
   - Request quota increases if needed
   - Monitor API usage patterns

### Debug Commands
```bash
# Check project configuration
gcloud config list

# Verify API enablement
gcloud services list --enabled

# Test authentication
gcloud auth list

# Check resource quotas
gcloud compute project-info describe --project=$GOOGLE_CLOUD_PROJECT
```

## 🏗️ Architecture Details

### Deployment Architecture
```
┌─────────────────────────────────────────────────┐
│                Cloud Console                    │
├─────────────────────────────────────────────────┤
│                Vertex AI                        │
│  ┌─────────────────────────────────────────┐    │
│  │        Agent Engine                     │    │
│  │  ┌─────────────────────────────────┐    │    │
│  │  │   LVX Quantum Leap Analyst      │    │    │
│  │  │                                 │    │    │
│  │  │  - Data Extraction Agent        │    │    │
│  │  │  - Entity Extraction           │    │    │
│  │  │  - Relationship Inference      │    │    │
│  │  │  - Investment Analysis         │    │    │
│  │  └─────────────────────────────────┘    │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
              │                      │
              ▼                      ▼
    ┌─────────────────┐    ┌─────────────────┐
    │   GCS Bucket    │    │    BigQuery     │
    │ lxvquantumleapai│    │ Knowledge Graph │
    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **Input**: Company analysis requests via API/Console
2. **Processing**: Agent extracts data from GCS, performs AI analysis
3. **Storage**: Results stored in BigQuery knowledge graph
4. **Output**: Investment insights and recommendations

## 📈 Performance Optimization

### Scaling Considerations
- **Concurrent Requests**: Agent engines handle multiple requests
- **Data Caching**: Implement caching for frequently accessed data
- **Resource Limits**: Monitor memory and CPU usage
- **API Quotas**: Track and optimize API call patterns

### Best Practices
- Use environment-specific configurations
- Implement proper error handling and retries
- Monitor performance metrics
- Regular updates and maintenance

## 🔐 Security Configuration

### Access Control
- Use IAM roles for fine-grained permissions
- Implement service account authentication
- Configure network security policies
- Enable audit logging

### Data Protection
- Encrypt data in transit and at rest
- Implement access logging
- Regular security audits
- Compliance with data protection regulations

## 📞 Support and Maintenance

### Monitoring
- Cloud Logging for execution logs
- Cloud Monitoring for performance metrics
- Error reporting and alerting
- Usage analytics and optimization

### Updates
- Regular dependency updates
- Agent model version management
- Configuration changes via deployment scripts
- Rollback procedures for failed deployments