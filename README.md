# Glaucoma Vision AI

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

Intelligent platform for glaucoma diagnosis and progression monitoring using computer vision and deep learning.

</div>

---

## Overview

Glaucoma Vision AI is a clinical decision-support system designed to assist healthcare professionals in the early detection and longitudinal monitoring of glaucoma — one of the leading causes of irreversible blindness worldwide. The platform combines state-of-the-art deep learning models with an intuitive interface to deliver automated analysis of ocular fundus images with clinical-grade reliability.

## Features

- Automated segmentation and analysis of ocular fundus images
- Cup-to-disc ratio (CDR) estimation via deep learning
- Glaucoma progression tracking over time
- Detailed diagnostic report generation
- REST API for integration with clinical systems
- Responsive web interface for clinical environments

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, TypeScript, TailwindCSS |
| Backend | Python, FastAPI |
| AI / ML | TensorFlow, PyTorch |
| Database | PostgreSQL |
| Infrastructure | Docker, GitHub Actions |

## Project Structure
```
glaucoma-vision-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── models/
│   │   └── utils/
│   ├── main.py
│   └── requirements.txt
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.9+
- Docker (optional)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/duardo10/glaucoma-vision-ai.git
cd glaucoma-vision-ai
```

**2. Configure environment variables**
```bash
cp .env.example .env
```

**3. Install frontend dependencies**
```bash
cd frontend
npm install
```

**4. Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

**Backend** — starts on `http://localhost:8000`
```bash
cd backend
uvicorn main:app --reload
```

**Frontend** — starts on `http://localhost:3000`
```bash
cd frontend
npm run dev
```

API documentation is available at `http://localhost:8000/docs` via Swagger UI.

## Contributing

Contributions are welcome. Please follow the steps below:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request describing your changes

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Team

**Core Developers**

- [Luis Eduardo Silva Brito](https://github.com/duardo10) — Full Stack Developer
- [Jeanderson Gomes de Sousa](https://github.com/JeandsGomes) — Back-End Developer, AI & Computer Vision

**Academic Advisor**

- [Flávio Araújo](https://github.com/flavio86) — Professor & Research Supervisor

## Acknowledgements

This project was developed under the support of:

- [CNPq](https://www.gov.br/cnpq/) — Brazilian National Council for Scientific and Technological Development
- [UFPI](https://www.ufpi.br/) — Federal University of Piauí

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Luis Eduardo Silva Brito — [duardos36@gmail.com](mailto:duardos36@gmail.com) — [@duardo10](https://github.com/duardo10)

---

<div align="center">
  <sub>Glaucoma Vision AI — Federal University of Piaui, Brazil</sub>
</div>
