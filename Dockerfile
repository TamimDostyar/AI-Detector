FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/templates /app/static

# Copy project files and folders
COPY notebooks /app/notebooks/
COPY templates /app/templates/
COPY static /app/static/
COPY app.py /app/

# Expose the Flask port
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Start Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
