# LVX Quantum Leap AI Analyst

## Running the Project

### Prerequisites
- Python 3.11+
- Poetry installed
- Google Cloud CLI authenticated
- `.env` file configured (copy from `.env.example`)

### Setup
```bash
# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Or source the virtual environment directly
source .venv/bin/activate
```

### Configuration
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` with your Google Cloud project details:
```bash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=asia-south1
GOOGLE_CLOUD_STORAGE_BUCKET=your-staging-bucket
GOOGLE_CLOUD_STORAGE_BUCKET_DATA=your-data-bucket
```

### Authentication
```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project $GOOGLE_CLOUD_PROJECT
```

### Running the Agent

**CLI Mode:**
```bash
adk run lvx_quantum_leap_analyst
```

**Web Interface:**
```bash
adk web
```

### Deployment
See `DEPLOYMENT.md` for cloud deployment instructions.
