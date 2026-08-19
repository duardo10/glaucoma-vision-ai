# Backend - Diagnostico de Glaucoma (FastAPI + Docker)

O backend oferece os dois endpoints usados pelo frontend e nao depende de
Firebase ou de qualquer armazenamento externo.

## Endpoints

### `POST /api/detect-optic-disc`

- Recebe `multipart/form-data` com campo `file`.
- Executa a deteccao YOLO.
- Retorna `resultImageUrl` como `data:image/jpeg;base64,...`, junto com `detections`.

Exemplo de resposta:

```json
{
  "resultImageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "detections": [
    { "box": [120.5, 80.2, 300.1, 260.7], "confidence": 0.94, "class": "optic_disc" }
  ]
}
```

### `POST /api/diagnosis-glaucoma`

- Recebe `multipart/form-data` com campo `file`.
- Executa YOLO, recorta a regiao de interesse e classifica com ResNet50.
- Retorna `confidence` de 0 a 100.

```json
{ "isPositive": true, "confidence": 92.35 }
```

## Modelos

Os arquivos esperados sao:

```text
models/best.pt
models/fold_4_last.pth
```

O codigo carrega `best.pt` como YOLO e `fold_4_last.pth` como `state_dict` de
uma ResNet50 com duas classes. Confirme antes de usar:

- O pre-processamento usado no treinamento.
- A ordem de `CLASSES` em `backend/inference.py`.
- O nome da classe do disco optico em `yolo_model.names`.

## Rodar com Docker

No terminal:

```powershell
cd backend
docker compose up --build
```

Teste a API em outro terminal:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

O resultado esperado e `status: ok`.

## Rodar o frontend

Na raiz do projeto, em outro terminal:

```powershell
npm install
npm run dev
```

Abra `http://localhost:3000`. O frontend chama o backend em
`http://127.0.0.1:8000`.

## Observacao

A imagem anotada vai dentro do JSON em base64. Isso evita armazenamento
externo, mas pode produzir respostas grandes para imagens de alta resolucao.
O sistema e uma ferramenta de auxilio e nao substitui a avaliacao de um
oftalmologista.
