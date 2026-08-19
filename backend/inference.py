"""
Pipeline de inferencia: YOLOv8n (deteccao do disco optico) + ResNet50 (classificacao de glaucoma).
"""

import io
import logging
import os
import numpy as np
from PIL import Image, ImageDraw
from ultralytics import YOLO
import torch
import torchvision.models
from torchvision import transforms

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CLASSES = ["normal", "glaucoma"]  # Confirme a ordem usada no treinamento.

# --- Carregamento dos modelos (uma vez, na subida do container) ---
YOLO_MODEL_PATH = "models/best.pt"
RESNET_MODEL_PATH = "models/fold_4_last.pth"

yolo_model = YOLO(YOLO_MODEL_PATH)

resnet_model = torchvision.models.resnet50()
resnet_model.fc = torch.nn.Linear(2048, len(CLASSES))
checkpoint = torch.load(RESNET_MODEL_PATH, map_location="cpu", weights_only=True)
state_dict = checkpoint.get("state_dict", checkpoint) if isinstance(checkpoint, dict) else checkpoint
resnet_model.load_state_dict(state_dict)
resnet_model.eval()

# TODO: ajuste para o mesmo pre-processamento usado no treino do ResNet50
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def _rodar_yolo(imagem: Image.Image):
    """Roda o YOLOv8n e retorna a lista de detections + a melhor box (para recorte da ROI)."""
    conf_threshold = float(os.getenv("YOLO_CONF_THRESHOLD", "0.05"))

    # IMPORTANTE: o Ultralytics espera arrays numpy em BGR (convencao do OpenCV).
    # PIL abre e converte em RGB, entao invertemos os canais aqui antes de passar pro modelo.
    # Sem isso, o YOLO recebe as cores trocadas e a deteccao fica prejudicada (poucas ou nenhuma caixa).
    imagem_bgr = np.ascontiguousarray(np.array(imagem)[:, :, ::-1])

    resultados = yolo_model.predict(
        imagem_bgr,
        conf=conf_threshold,
        imgsz=640,
        verbose=False,
    )
    boxes = resultados[0].boxes

    logger.info(
        "YOLO: %d deteccao(oes), confianca maxima=%s, limiar=%.3f",
        len(boxes),
        f"{float(boxes.conf.max()):.4f}" if len(boxes) else "nenhuma",
        conf_threshold,
    )

    detections = []
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0])
        classe_idx = int(box.cls[0])
        classe_nome = yolo_model.names[classe_idx]
        detections.append({
            "box": [round(x1, 2), round(y1, 2), round(x2, 2), round(y2, 2)],
            "confidence": round(conf, 4),
            "class": classe_nome,
        })

    if len(boxes) == 0:
        return detections, None

    melhor_box = boxes[boxes.conf.argmax()]
    bbox = melhor_box.xyxy[0].tolist()
    return detections, bbox


def detectar_disco_optico(imagem_bytes: bytes) -> dict:
    """
    Usado pelo endpoint /api/detect-optic-disc.
    Roda o YOLOv8n, desenha a(s) caixa(s) na imagem e retorna a imagem anotada (bytes) + detections.
    """
    imagem = Image.open(io.BytesIO(imagem_bytes)).convert("RGB")
    detections, _ = _rodar_yolo(imagem)

    imagem_anotada = imagem.copy()
    draw = ImageDraw.Draw(imagem_anotada)
    for det in detections:
        x1, y1, x2, y2 = det["box"]
        draw.rectangle([x1, y1, x2, y2], outline="red", width=4)
        draw.text((x1, max(y1 - 15, 0)), f'{det["class"]} {det["confidence"]*100:.1f}%', fill="red")

    buffer = io.BytesIO()
    imagem_anotada.save(buffer, format="JPEG")

    return {
        "imagem_anotada_bytes": buffer.getvalue(),
        "detections": detections,
    }


def diagnosticar_glaucoma(imagem_bytes: bytes) -> dict:
    """
    Usado pelo endpoint /api/diagnosis-glaucoma.
    Roda YOLOv8n -> recorta ROI -> ResNet50 -> retorna isPositive + confidence (0-100).
    """
    imagem = Image.open(io.BytesIO(imagem_bytes)).convert("RGB")
    _, bbox = _rodar_yolo(imagem)

    usou_fallback = bbox is None
    if usou_fallback:
        logger.warning(
            "YOLO nao encontrou o disco optico; classificando a imagem completa como fallback."
        )
        roi = imagem
    else:
        x1, y1, x2, y2 = bbox
        roi = imagem.crop((x1, y1, x2, y2))

    tensor = transform(roi).unsqueeze(0)
    with torch.no_grad():
        saida = resnet_model(tensor)
        probs = torch.softmax(saida, dim=1)[0]
        indice_classe = int(torch.argmax(probs))
        confianca = float(probs[indice_classe])

    classe = CLASSES[indice_classe]
    logger.info(
        "ResNet50: classe=%s, prob_normal=%.4f, prob_glaucoma=%.4f, entrada=%s",
        classe,
        float(probs[0]),
        float(probs[1]),
        "imagem_completa_fallback" if usou_fallback else "roi_yolo",
    )
    return {
        "isPositive": classe == "glaucoma",
        "confidence": round(confianca * 100, 2),  # front espera 0-100
    }