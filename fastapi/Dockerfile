# Use an official Python 3.10 slim image
FROM python:3.10-slim

# Reduce Python overhead and prevent .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /src

# Install system dependencies required by psycopg2 and bcrypt
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip first
RUN pip install --upgrade pip

# Copy and install dependencies first (for better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port FastAPI will listen on
EXPOSE 8000

# Default command to start the server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]