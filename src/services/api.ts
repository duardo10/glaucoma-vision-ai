// Simulação da API para processamento de imagens
// Em um ambiente real, isso seria substituído por chamadas a uma API externa

import { sleep } from '@/utils/helpers';

// Tipo para o resultado da detecção do disco óptico
export interface OpticDiscDetectionResult {
  resultImageUrl: string;
}

// Tipo para o resultado do diagnóstico de glaucoma
export interface GlaucomaDiagnosisResult {
  isPositive: boolean;
  confidence: number;
}

// Função para detecção do disco óptico
export async function detectOpticDisc(imageFile: File): Promise<OpticDiscDetectionResult> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('http://127.0.0.1:8000/api/detect-optic-disc', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erro ao detectar disco óptico');
  }

  return await response.json();
}

// Função para diagnóstico de glaucoma
export async function diagnosisGlaucoma(imageFile: File): Promise<GlaucomaDiagnosisResult> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('http://127.0.0.1:8000/api/diagnosis-glaucoma', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erro ao realizar diagnóstico de glaucoma');
  }

  return await response.json();
} 