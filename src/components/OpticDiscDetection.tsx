"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

const backendUrl = "http://localhost:8000";

interface OpticDiscDetectionProps {
  originalImageUrl: string;
  resultImageUrl?: string; // URL da imagem com a marcação do disco óptico
  isLoading: boolean;
  error?: string;
  detections?: Array<{
    box: [number, number, number, number];
    confidence: number;
    class: string;
  }>;
}

export default function OpticDiscDetection({ 
  originalImageUrl, 
  resultImageUrl, 
  isLoading, 
  error, 
  detections
}: OpticDiscDetectionProps) {
  const [view, setView] = useState<'original' | 'detection'>('detection');
  
  // Retry logic para imagem de detecção
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (view === 'detection' && resultImageUrl) {
      setImgSrc(resultImageUrl.startsWith('/static/') ? `${backendUrl}${resultImageUrl}` : resultImageUrl);
    } else if (view === 'original' && originalImageUrl) {
      setImgSrc(originalImageUrl.startsWith('/static/') ? `${backendUrl}${originalImageUrl}` : originalImageUrl);
    }
  }, [view, resultImageUrl, originalImageUrl]);

  const handleImageError = () => {
    // Retry após 300ms
    setTimeout(() => {
      setImgSrc((prev) => prev ? prev + `?retry=${Date.now()}` : prev);
    }, 300);
  };

  useEffect(() => {
    // Resetar para a visualização de detecção quando novos resultados chegarem
    if (resultImageUrl) {
      setView('detection');
    }
  }, [resultImageUrl]);

  if (isLoading) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Analisando imagem...</h3>
        <p className="text-gray-500 text-center">
          Nosso modelo de IA está detectando o disco óptico na sua imagem.
          <br />Isso pode levar alguns segundos.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-full border-danger/20">
        <div className="card-header bg-danger/5 border-danger/20 flex items-center space-x-2">
          <svg 
            className="w-5 h-5 text-danger" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="font-medium text-danger">Erro na Detecção</span>
        </div>
        <div className="card-body">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-danger" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <p className="text-gray-700 text-center max-w-md">{error}</p>
            <button className="btn btn-outline btn-sm mt-6">
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resultImageUrl) {
    return null;
  }

  return (
    <div className="card h-full">
      <div className="card-header flex items-center justify-between">
        <h3 className="font-medium">Detecção do Disco Óptico</h3>
        
        <div className="tab-group inline-flex rounded-md overflow-hidden border border-gray-200">
          <button
            className={`px-3 py-1 text-sm font-medium ${
              view === 'original' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setView('original')}
          >
            Original
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium ${
              view === 'detection' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setView('detection')}
          >
            Detecção
          </button>
        </div>
      </div>
      
      <div className="card-body p-0">
        <div className="aspect-video relative w-full overflow-hidden border-t border-b border-gray-200">
          <Image 
            src={imgSrc || ''}
            alt={view === 'original' ? "Imagem original" : "Detecção do disco óptico"} 
            fill
            className="object-contain"
            onError={handleImageError}
          />
        </div>
      </div>
      
      <div className="card-footer bg-gray-50">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-700">
                A detecção do disco óptico é fundamental para o diagnóstico do glaucoma. 
                Nossa IA identifica alterações na proporção entre a escavação e o disco (relação E/D), 
                um importante indicador de dano glaucomatoso ao nervo óptico.
              </p>
            </div>
          </div>
          {detections && detections.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold text-sm mb-1">Estatísticas da Detecção:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                {detections.map((det, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span><b>Classe:</b> {det.class}</span>
                    <span><b>Confiança:</b> {(det.confidence * 100).toFixed(2)}%</span>
                    <span><b>Box:</b> [{det.box.join(', ')}]</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 