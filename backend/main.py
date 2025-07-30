from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
from PIL import Image
import io
import os
# Adicionar imports necessários para os modelos
import torch.serialization
from ultralytics import YOLO
import torchvision.models as models
import torch.nn as nn
from fastapi.staticfiles import StaticFiles
import time
import logging

app = FastAPI()

# Permitir requisições do frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho dos modelos
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
OPTIC_DISC_MODEL_PATH = os.path.join(MODELS_DIR, "best.pt")
GLAUCOMA_MODEL_PATH = os.path.join(MODELS_DIR, "fold_4_last.pth")

# Carregar os modelos reais
try:
    optic_disc_model = YOLO(OPTIC_DISC_MODEL_PATH)
except Exception as e:
    optic_disc_model = None
    print(f"Erro ao carregar modelo de disco óptico: {e}")

try:
    glaucoma_model = models.resnet50()
    glaucoma_model.fc = nn.Linear(2048, 2)
    state_dict = torch.load(GLAUCOMA_MODEL_PATH, map_location=torch.device('cpu'))
    glaucoma_model.load_state_dict(state_dict)
    glaucoma_model.eval()
except Exception as e:
    glaucoma_model = None
    print(f"Erro ao carregar modelo de glaucoma: {e}")

# Criar pasta static se não existir
def ensure_static_dir():
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)
    return static_dir

STATIC_DIR = ensure_static_dir()
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.post("/api/detect-optic-disc")
async def detect_optic_disc(file: UploadFile = File(...)):
    try:
        if optic_disc_model is None:
            raise Exception("Modelo de detecção do disco óptico não carregado.")
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Salvar imagem original
        timestamp = int(time.time() * 1000)
        original_filename = f"original_{timestamp}.jpg"
        original_path = os.path.join(STATIC_DIR, original_filename)
        image.save(original_path)
        original_url = f"/static/{original_filename}"
        # Realizar detecção com YOLO
        results = optic_disc_model(image)
        boxes = results[0].boxes.xyxy.cpu().numpy() if hasattr(results[0], 'boxes') else []
        scores = results[0].boxes.conf.cpu().numpy() if hasattr(results[0], 'boxes') else []
        classes = results[0].boxes.cls.cpu().numpy() if hasattr(results[0], 'boxes') else []
        # Desenhar bounding box se houver detecção
        import cv2
        import numpy as np
        img_np = np.array(image)
        detections = []
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = map(int, box[:4])
            confidence = float(scores[i]) if i < len(scores) else None
            class_id = int(classes[i]) if i < len(classes) else None
            img_np = cv2.rectangle(img_np, (x1, y1), (x2, y2), (255, 0, 0), 3)
            detections.append({
                "box": [x1, y1, x2, y2],
                "confidence": confidence,
                "class": optic_disc_model.names[class_id] if hasattr(optic_disc_model, 'names') and class_id is not None else str(class_id)
            })
        image_to_save = Image.fromarray(img_np)
        result_filename = f"result_{timestamp}.jpg"
        result_path = os.path.join(STATIC_DIR, result_filename)
        image_to_save.save(result_path)
        logging.info(f"Imagem original salva em: {original_path}")
        logging.info(f"Imagem processada salva em: {result_path}")
        result_url = f"/static/{result_filename}"
        return {
            "originalImageUrl": original_url,
            "resultImageUrl": result_url,
            "detections": detections
        }
    except Exception as e:
        logging.error(f"Erro ao processar imagem: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/diagnosis-glaucoma")
async def diagnosis_glaucoma(file: UploadFile = File(...)):
    try:
        if glaucoma_model is None:
            raise Exception("Modelo de diagnóstico de glaucoma não carregado.")
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Pré-processamento para ResNet-50
        import torchvision.transforms as transforms
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        input_tensor = preprocess(image).unsqueeze(0)  # shape: [1, 3, 224, 224]
        with torch.no_grad():
            output = glaucoma_model(input_tensor)
            probabilities = torch.softmax(output, dim=1)[0]
            confidence, predicted = torch.max(probabilities, 0)
            is_positive = bool(predicted.item())
        return {
            "isPositive": is_positive,
            "confidence": float(confidence.item()) * 100  # porcentagem
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 