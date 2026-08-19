"""
Integracao com o Firebase Storage.
Usado para: salvar a imagem original enviada pelo medico e a imagem anotada
(com a caixa do disco optico desenhada), retornando URLs publicas que o front
ja sabe consumir diretamente (ImageUploader/OpticDiscDetection usam a URL como veio,
sem precisar do prefixo "/static/").
"""

import os
import uuid
import firebase_admin
from firebase_admin import credentials, storage

def _get_bucket():
    if not firebase_admin._apps:
        caminho_credencial = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
        bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET")
        if not bucket_name or not os.path.isfile(caminho_credencial):
            raise RuntimeError(
                "Configure FIREBASE_STORAGE_BUCKET e FIREBASE_CREDENTIALS_PATH "
                "antes de enviar imagens."
            )
        cred = credentials.Certificate(caminho_credencial)
        firebase_admin.initialize_app(cred, {"storageBucket": bucket_name})
    return storage.bucket()


def upload_imagem(bytes_imagem: bytes, prefixo: str, content_type: str = "image/jpeg") -> str:
    """
    Sobe uma imagem para o Firebase Storage e retorna a URL publica.
    prefixo: pasta/dentro do bucket, ex: "originais" ou "anotadas"
    """
    bucket = _get_bucket()
    nome_arquivo = f"{prefixo}/{uuid.uuid4().hex}.jpg"
    blob = bucket.blob(nome_arquivo)

    blob.upload_from_string(bytes_imagem, content_type=content_type)
    blob.make_public()  # simples e direto para uso individual; troque por signed URL se precisar de mais controle

    return blob.public_url