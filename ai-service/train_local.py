import os
import sys
import shutil
import zipfile
import yaml
from pathlib import Path

# ==============================================================================
# CẤU HÌNH ĐƯỜNG DẪN
# ==============================================================================
ZIP_PATH = r"C:\Users\ADMIN\Downloads\FOOD-INGREDIENTS detection.v1i.yolov8.zip"
EXTRACT_DIR = r"D:\Project\dataset_food"
DEST_MODEL_DIR = str(Path(__file__).resolve().parent / "models")
RUNS_DIR = r"D:\Project\yolo_runs"

EPOCHS = 50       # Số vòng lặp huấn luyện (có thể đổi thành 25 nếu muốn nhanh hơn)
BATCH_SIZE = 8    # Phù hợp với 4GB VRAM của card Quadro T1000
IMG_SIZE = 640    # Độ phân giải chuẩn của YOLOv8

def main():
    print("=" * 60)
    print("🚀 BẮT ĐẦU QUY TRÌNH HUẤN LUYỆN YOLOv8 NHẬN DIỆN NGUYÊN LIỆU")
    print("=" * 60)

    # 1. Kiểm tra PyTorch và GPU
    try:
        import torch
        print(f"📦 PyTorch version: {torch.__version__}")
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            print(f"✅ Đã tìm thấy GPU: {gpu_name}")
            device = 0
        else:
            print("⚠️ CẢNH BÁO: Không tìm thấy GPU CUDA! Script sẽ chạy bằng CPU (chậm).")
            device = "cpu"
    except ImportError:
        print("❌ Lỗi: Chưa cài đặt PyTorch! Vui lòng chạy lệnh cài đặt PyTorch trước.")
        sys.exit(1)

    # 2. Giải nén dữ liệu nếu chưa giải nén
    yaml_path = os.path.join(EXTRACT_DIR, "data.yaml")
    if not os.path.exists(yaml_path):
        if not os.path.exists(ZIP_PATH):
            print(f"❌ Không tìm thấy file zip tại: {ZIP_PATH}")
            sys.exit(1)
        
        print(f"\n📂 Đang giải nén bộ dữ liệu từ {ZIP_PATH} ...")
        os.makedirs(EXTRACT_DIR, exist_ok=True)
        with zipfile.ZipFile(ZIP_PATH, "r") as z:
            z.extractall(EXTRACT_DIR)
        print("✅ Giải nén thành công!")
    else:
        print(f"\n✅ Bộ dữ liệu đã có sẵn tại: {EXTRACT_DIR}")

    # 3. Chuẩn hóa đường dẫn trong data.yaml
    print("\n⚙️ Cập nhật cấu hình file data.yaml ...")
    with open(yaml_path, "r", encoding="utf-8") as f:
        data_cfg = yaml.safe_load(f)

    train_imgs = Path(EXTRACT_DIR) / "train" / "images"
    val_imgs = Path(EXTRACT_DIR) / "valid" / "images"
    test_imgs = Path(EXTRACT_DIR) / "test" / "images"

    data_cfg["train"] = str(train_imgs).replace("\\", "/")
    data_cfg["val"] = str(val_imgs).replace("\\", "/")
    if test_imgs.exists():
        data_cfg["test"] = str(test_imgs).replace("\\", "/")

    with open(yaml_path, "w", encoding="utf-8") as f:
        yaml.dump(data_cfg, f, allow_unicode=True)

    print(f"✅ Số lượng nhãn nguyên liệu: {data_cfg.get('nc', 'N/A')}")
    print(f"✅ Cấu hình data.yaml: {yaml_path}")

    # 4. Huấn luyện YOLOv8
    print("\n" + "=" * 60)
    print(f"🔥 BẮT ĐẦU TRAIN: {EPOCHS} Epochs | Batch: {BATCH_SIZE} | ImgSz: {IMG_SIZE}")
    print("=" * 60)

    from ultralytics import YOLO

    model = YOLO("yolov8n.pt")  # Tải trọng số pre-trained nano
    
    results = model.train(
        data=yaml_path,
        epochs=EPOCHS,
        batch=BATCH_SIZE,
        imgsz=IMG_SIZE,
        device=device,
        project=RUNS_DIR,
        name="food_detect",
        workers=2,
        exist_ok=True
    )

    # 5. Tự động sao chép file kết quả vào EatGym
    best_weights = os.path.join(RUNS_DIR, "food_detect", "weights", "best.pt")
    target_weights = os.path.join(DEST_MODEL_DIR, "yolov8_food.pt")

    if os.path.exists(best_weights):
        os.makedirs(DEST_MODEL_DIR, exist_ok=True)
        shutil.copyfile(best_weights, target_weights)
        print("\n" + "=" * 60)
        print("🎉 HUẤN LUYỆN HOÀN TẤT THÀNH CÔNG!")
        print(f"✅ Trọng số mô hình đã được tự động lưu vào:")
        print(f"   👉 {target_weights}")
        print("=" * 60)
    else:
        print(f"\n⚠️ Train xong nhưng không tìm thấy file best.pt tại: {best_weights}")

if __name__ == "__main__":
    main()
