# Backend - Diagnóstico de Glaucoma (FastAPI + Firebase + Docker)

Backend feito sob medida para o front que você já tem. Os dois endpoints batem
exatamente com o que `services/api.ts` chama.

## Endpoints

### `POST /api/detect-optic-disc`
- Recebe: `multipart/form-data` com campo `file` (a imagem)
- Retorna:
```json
{
  "resultImageUrl": "https://storage.googleapis.com/.../anotadas/xxx.jpg",
  "detections": [
    { "box": [120.5, 80.2, 300.1, 260.7], "confidence": 0.94, "class": "optic_disc" }
  ]
}
```
Roda o YOLOv8n, desenha a caixa detectada na imagem, sobe a imagem anotada pro
Firebase Storage e devolve a URL pública (o front já sabe usar essa URL direto).

### `POST /api/diagnosis-glaucoma`
- Recebe: `multipart/form-data` com campo `file`
- Retorna:
```json
{ "isPositive": true, "confidence": 92.35 }
```
Roda YOLOv8n → recorta a ROI → classifica com ResNet50. **`confidence` vai de 0 a 100**
(o front usa `{confidence}%` direto, sem multiplicar — atenção pra não confundir
com a confiança das `detections`, que é 0–1).

---

## 1. Configurar o Firebase

1. Crie o projeto em https://console.firebase.google.com
2. Ative **Storage** (Build → Storage → "Vamos começar")
3. Vá em ⚙️ **Configurações do projeto → Contas de serviço → Gerar nova chave privada**
4. Salve o arquivo baixado como `secrets/serviceAccountKey.json` (crie essa pasta na raiz do projeto)
5. Anote o nome do seu bucket (aparece na tela do Storage, algo como `seu-projeto.appspot.com`)
   e coloque em `FIREBASE_STORAGE_BUCKET` no `docker-compose.yml`

## 2. Colocar os modelos treinados

```
app/models/yolov8n_glaucoma.pt
app/models/resnet50_classificador.pth
```

Ajuste em `app/inference.py`:
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
```bash
curl http://localhost:8000/health
```

## 4. Rodar o front

Sem nenhuma alteração no front — ele já aponta pra `http://127.0.0.1:8000`.
Só suba o backend antes de usar a plataforma.

## Observação sobre segurança

As imagens são salvas como públicas no Firebase Storage (`blob.make_public()`),
o que é simples e funciona bem para uso individual. Se em algum momento a
plataforma for exposta publicamente com dados de pacientes reais, troque por
URLs assinadas com expiração (`blob.generate_signed_url()`) em vez de tornar
os arquivos públicos permanentemente.