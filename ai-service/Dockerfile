# ============================================================
#  EatGym AI Service – Dockerfile
#  Python 3.11 + FastAPI + YOLOv8
# ============================================================

FROM python:3.11-slim

# Copy uv trực tiếp từ image chính thức của Astral trên Docker Hub (không cần dùng pip tải)
COPY --from=astral/uv:latest /uv /bin/uv

# System deps for OpenCV headless
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Security: non-root user
RUN groupadd -r eatgym && useradd -r -g eatgym eatgym

WORKDIR /app

# Tăng timeout mạng cho uv lên 3600s (1 tiếng) để không bị ngắt giữa chừng
ENV UV_HTTP_TIMEOUT=3600

# Cài đặt PyTorch CPU bằng uv (hỗ trợ --torch-backend cpu chính chủ, chỉ ~180MB, tải đa luồng)
RUN uv pip install --system --no-cache \
    --torch-backend cpu \
    torch torchvision

# Cài đặt các thư viện còn lại
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

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
