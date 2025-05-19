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
  // Simulação do processamento de detecção
  await sleep(2000);
  
  // Em um ambiente real, isso seria substituído pelo upload da imagem para um servidor
  // e pelo processamento real do modelo de IA
  
  // Simulação do resultado
  // Em um ambiente real, a URL viria do servidor após o processamento
  return {
    resultImageUrl: URL.createObjectURL(imageFile),
  };
}

// Função para diagnóstico de glaucoma
export async function diagnosisGlaucoma(imageFile: File): Promise<GlaucomaDiagnosisResult> {
  // Simulação do processamento de diagnóstico
  await sleep(3000);
  
  // Em um ambiente real, isso seria substituído pelo upload da imagem para um servidor
  // e pelo processamento real do modelo de IA
  
  // Simulando um resultado aleatório para demonstração
  const isPositive = Math.random() > 0.5;
  const confidence = Math.floor(Math.random() * 30) + 70; // Entre 70% e 99%
  
  return {
    isPositive,
    confidence,
  };
} 