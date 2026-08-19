"""
Backend de diagnostico de glaucoma - FastAPI + Firebase
Endpoints usados pelo front (services/api.ts):
  POST /api/detect-optic-disc   -> multipart "file" -> { resultImageUrl, detections }
  POST /api/diagnosis-glaucoma  -> multipart "file" -> { isPositive, confidence }
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from firebase_service import upload_imagem
from inference import detectar_disco_optico, diagnosticar_glaucoma

app = FastAPI(title="Glaucoma Diagnosis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em producao, troque pela URL real do front (ex: http://localhost:3000)
    allow_methods=["*"],
    allow_headers=["*"],
)


class DetectOpticDiscResponse(BaseModel):
    resultImageUrl: str
    detections: Optional[list] = None


class DiagnosisResponse(BaseModel):
    isPositive: bool
    confidence: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/detect-optic-disc", response_model=DetectOpticDiscResponse)
async def detect_optic_disc(file: UploadFile = File(...)):
    imagem_bytes = await file.read()

    try:
        resultado = detectar_disco_optico(imagem_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na deteccao do disco optico: {e}")

    # Sobe a imagem anotada (com a caixa desenhada) para o Firebase Storage
    url_imagem_anotada = upload_imagem(resultado["imagem_anotada_bytes"], prefixo="anotadas")

    return DetectOpticDiscResponse(
        resultImageUrl=url_imagem_anotada,
        detections=resultado["detections"],
    )


@app.post("/api/diagnosis-glaucoma", response_model=DiagnosisResponse)
async def diagnosis_glaucoma(file: UploadFile = File(...)):
    imagem_bytes = await file.read()

    try:
        resultado = diagnosticar_glaucoma(imagem_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no diagnostico: {e}")

    # Guarda a imagem original enviada (para poder carregar depois, se precisar)
    upload_imagem(imagem_bytes, prefixo="originais")

    return DiagnosisResponse(
        isPositive=resultado["isPositive"],
        confidence=resultado["confidence"],
    )