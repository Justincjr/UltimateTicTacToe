# Build stage for React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY react-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY react-frontend/ ./

# Build the frontend
RUN npm run build

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy only needed Python files
COPY flaskserver.py ./
COPY utils.py ./
COPY agent.py ./
COPY agent3.py ./
COPY agent5.py ./
COPY weights.py ./
COPY weights2.py ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./static

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Run the Flask server with Gunicorn (production WSGI server)
# Using 1 worker with threads to preserve in-memory session state
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "4", "flaskserver:app"]
