# Lightweight base
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the specific folder
COPY api_gateway/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from root
COPY . .

# Set Python path to include /app
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Run FastAPI as a module
CMD ["uvicorn", "api_gateway.main:app", "--host", "0.0.0.0", "--port", "8000"]
