# Lightweight base
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the specific folder
COPY agent_manager/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from root
COPY . .

# Set Python path to include /app
ENV PYTHONPATH=/app

# Run the manager as a module
CMD ["python", "-m", "agent_manager.main"]
