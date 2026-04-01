FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code (we copy everything from root to support local packages)
COPY . .

# Set Python path to include /app/packages
ENV PYTHONPATH=/app:/app/packages

EXPOSE 8000

CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
