# Backend - Diagnóstico de Glaucoma (FastAPI + Docker)

Backend feito sob medida para o front que você já tem. Os dois endpoints batem
exatamente com o que `services/api.ts` chama.

## Endpoints

### `POST /api/detect-optic-disc`
- Recebe: `multipart/form-data` com campo `file` (a imagem)
- Retorna:
```json
{
  "resultImageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "detections": [
    { "box": [120.5, 80.2, 300.1, 260.7], "confidence": 0.94, "class": "optic_disc" }
  ]
}
```
Roda o YOLOv8n, desenha a caixa detectada na imagem e devolve a imagem anotada
codificada em base64 como uma data URL. O navegador exibe essa string
diretamente, sem Firebase ou outro storage externo.

### `POST /api/diagnosis-glaucoma`
- Recebe: `multipart/form-data` com campo `file`
## 1. Modelos treinados
1. Crie o projeto em https://console.firebase.google.com
2. Ative **Storage** (Build → Storage → "Vamos começar")
models/best.pt
models/fold_4_last.pth
5. Anote o nome do seu bucket (aparece na tela do Storage, algo como `seu-projeto.appspot.com`)
   e coloque em `FIREBASE_STORAGE_BUCKET` no `docker-compose.yml`
O código atual carrega `best.pt` como YOLO e `fold_4_last.pth` como `state_dict`
de uma ResNet50 com duas classes. Confirme antes de usar:

```
app/models/yolov8n_glaucoma.pt
app/models/resnet50_classificador.pth
## 2. Rodar com Docker

```powershell
cd backend
- Como o ResNet50 foi salvo (modelo completo ou `state_dict`)
- O pré-processamento (resize/normalização) usado no treino
- A ordem de `CLASSES` (confirme se é `["normal", "glaucoma"]` mesmo)
- O nome da classe que o YOLO usa para o disco óptico (`yolo_model.names`)

## 3. Rodar com Docker

```bash
docker compose up --build
```

Backend sobe em `http://localhost:8000` — mesma porta que o front (`services/api.ts`
e `backendUrl` no `ImageUploader`/`OpticDiscDetection`) já espera por padrão.

Teste:
```powershell
Invoke-RestMethod http://localhost:8000/health
```

## 3. Rodar o front

Na raiz do projeto, em outro terminal:

```powershell
npm install
npm run dev
```

Abra `http://localhost:3000`. O frontend chama o backend em
`http://127.0.0.1:8000`.

## Observações

Como a imagem anotada vai no JSON, respostas podem ficar grandes para imagens
de alta resolução. Para produção ou arquivos grandes, prefira armazenamento
temporário ou streaming. O sistema é uma ferramenta de auxílio e não substitui
a avaliação de um oftalmologista.