# ============================================================
#  EatGym AI Service – Dockerfile
#  Python 3.11 + FastAPI + YOLOv8
# ============================================================

FROM python:3.11-slim

# System deps for OpenCV headless
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Security: non-root user
RUN groupadd -r eatgym && useradd -r -g eatgym eatgym

WORKDIR /app

# Install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=120 --retries=5 \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    torch torchvision
RUN pip install --no-cache-dir --default-timeout=120 --retries=5 -r requirements.txt

# Copy application code
COPY app/ ./app/

# Copy model weights (if present at build time)
COPY models/ ./models/

# Switch to non-root
USER eatgym

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# QUAN TRỌNG: --host 0.0.0.0 để lắng nghe từ LAN
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
