#!/bin/bash

# LVX Quantum Leap AI Analyst - Deployment Script
# Copyright 2025 Google LLC

set -e  # Exit on any error

echo "🏦 LVX Quantum Leap AI Analyst - Deployment Script"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required environment variables are set
check_environment() {
    print_info "Checking environment variables..."
    
    if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
        print_error "GOOGLE_CLOUD_PROJECT environment variable is not set"
        echo "Please set it with: export GOOGLE_CLOUD_PROJECT=your-project-id"
        exit 1
    fi
    
    if [ -z "$GOOGLE_CLOUD_STORAGE_BUCKET" ]; then
        print_error "GOOGLE_CLOUD_STORAGE_BUCKET environment variable is not set"
        echo "Please set it with: export GOOGLE_CLOUD_STORAGE_BUCKET=your-staging-bucket"
        exit 1
    fi
    
    print_status "Environment variables validated"
    echo "   PROJECT: $GOOGLE_CLOUD_PROJECT"
    echo "   STAGING_BUCKET: $GOOGLE_CLOUD_STORAGE_BUCKET"
    echo "   DATA_BUCKET: ${GOOGLE_CLOUD_STORAGE_BUCKET_DATA:-lxvquantumleapai}"
    echo
}

# Check if gcloud is authenticated
check_authentication() {
    print_info "Checking Google Cloud authentication..."
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 > /dev/null; then
        print_error "Not authenticated with Google Cloud"
        echo "Please run: gcloud auth login"
        exit 1
    fi
    
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    print_status "Authenticated as: $ACTIVE_ACCOUNT"
}

# Enable required APIs
enable_apis() {
    print_info "Enabling required Google Cloud APIs..."
    
    APIs=(
        "aiplatform.googleapis.com"
        "storage.googleapis.com"
        "bigquery.googleapis.com"
        "compute.googleapis.com"
    )
    
    for api in "${APIs[@]}"; do
        print_info "Enabling $api..."
        gcloud services enable $api --project=$GOOGLE_CLOUD_PROJECT
    done
    
    print_status "Required APIs enabled"
}

# Create staging bucket if it doesn't exist
create_staging_bucket() {
    print_info "Checking staging bucket: $GOOGLE_CLOUD_STORAGE_BUCKET"
    
    if gsutil ls -b gs://$GOOGLE_CLOUD_STORAGE_BUCKET > /dev/null 2>&1; then
        print_status "Staging bucket already exists"
    else
        print_info "Creating staging bucket..."
        gsutil mb gs://$GOOGLE_CLOUD_STORAGE_BUCKET
        print_status "Staging bucket created"
    fi
}

# Install Python dependencies
install_dependencies() {
    print_info "Installing Python dependencies..."
    
    if [ ! -d ".venv" ]; then
        print_info "Creating virtual environment..."
        python3 -m venv .venv
    fi
    
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    print_status "Dependencies installed"
}

# Deploy the agent
deploy_agent() {
    print_info "Deploying LVX Quantum Leap AI Analyst..."
    
    source .venv/bin/activate
    
    cd deployment
    python deploy_lvx_analyst.py --create \
        --project_id=$GOOGLE_CLOUD_PROJECT \
        --bucket=$GOOGLE_CLOUD_STORAGE_BUCKET
    
    print_status "Agent deployment initiated"
}

# List deployed agents
list_agents() {
    print_info "Listing deployed agents..."
    
    source .venv/bin/activate
    cd deployment
    python deploy_lvx_analyst.py --list \
        --project_id=$GOOGLE_CLOUD_PROJECT \
        --bucket=$GOOGLE_CLOUD_STORAGE_BUCKET
}

# Main deployment process
main() {
    case "${1:-deploy}" in
        "deploy")
            check_environment
            check_authentication
            enable_apis
            create_staging_bucket
            install_dependencies
            deploy_agent
            ;;
        "list")
            check_environment
            check_authentication
            list_agents
            ;;
        "delete")
            if [ -z "$2" ]; then
                print_error "Resource ID required for delete operation"
                echo "Usage: $0 delete <resource_id>"
                exit 1
            fi
            check_environment
            check_authentication
            source .venv/bin/activate
            cd deployment
            python deploy_lvx_analyst.py --delete --resource_id=$2
            ;;
        "help")
            echo "Usage: $0 [command]"
            echo
            echo "Commands:"
            echo "  deploy     Deploy the LVX Quantum Leap AI Analyst (default)"
            echo "  list       List all deployed agents"
            echo "  delete     Delete a deployed agent (requires resource_id)"
            echo "  help       Show this help message"
            echo
            echo "Environment variables required:"
            echo "  GOOGLE_CLOUD_PROJECT               GCP project ID"
            echo "  GOOGLE_CLOUD_STORAGE_BUCKET        GCP staging bucket"
            echo "  GOOGLE_CLOUD_STORAGE_BUCKET_DATA   GCS data bucket (optional, defaults to lxvquantumleapai)"
            echo
            echo "Examples:"
            echo "  $0 deploy"
            echo "  $0 list"
            echo "  $0 delete projects/my-project/locations/us-central1/reasoning_engines/12345"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"