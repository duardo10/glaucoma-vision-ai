# Backend Glaucoma Vision AI

## Estrutura

```
backend/
├── main.py           # Código principal FastAPI
├── requirements.txt  # Dependências Python
└── models/           # Coloque aqui seus arquivos .pth/.pt
```

## Como usar

1. **Coloque seus modelos (.pth/.pt) na pasta `models/`**
   - Exemplo: `backend/models/optic_disc_model.pth`
   - Exemplo: `backend/models/glaucoma_model.pt`

2. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Rode o servidor:**
   ```bash
   uvicorn main:app --reload
   ```
   O backend estará disponível em http://localhost:8000

4. **Endpoints disponíveis:**
   - `POST /api/detect-optic-disc` (envie uma imagem)
   - `POST /api/diagnosis-glaucoma` (envie uma imagem)

5. **Integração**
   - O frontend deve enviar imagens para esses endpoints para obter os resultados reais dos modelos.

---

> **Nota:** O código já está pronto para carregar os modelos. Basta descomentar e ajustar as linhas de carregamento dos modelos em `main.py`. 