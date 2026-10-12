#!/bin/bash
echo "=========================================="
echo "    EatGym - Khởi động Backend & Ngrok"
echo "=========================================="
docker compose up -d
echo ""
echo "Trạng thái các container:"
docker compose ps
echo ""
echo "API & Ngrok đã sẵn sàng tại: https://kindly-absolve-concur.ngrok-free.dev"
