"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OpticDiscDetectionProps {
  originalImageUrl: string;
  resultImageUrl?: string; // URL da imagem com a marcação do disco óptico
  isLoading: boolean;
  error?: string;
}

export default function OpticDiscDetection({ 
  originalImageUrl, 
  resultImageUrl, 
  isLoading, 
  error 
}: OpticDiscDetectionProps) {
  const [view, setView] = useState<'original' | 'detection'>('detection');
  
  useEffect(() => {
    // Resetar para a visualização de detecção quando novos resultados chegarem
    if (resultImageUrl) {
      setView('detection');
    }
  }, [resultImageUrl]);

  if (isLoading) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Analisando imagem...</p>
        <p className="text-sm text-gray-500">Detectando disco óptico</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-12 border border-danger/20 bg-danger/5">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-medium text-danger">Erro na detecção</p>
        <p className="text-sm text-gray-700 text-center">{error}</p>
      </div>
    );
  }

  if (!resultImageUrl) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Detecção do Disco Óptico</h3>
        
        <div className="flex rounded-md overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${
              view === 'original' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setView('original')}
          >
            Original
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              view === 'detection' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setView('detection')}
          >
            Detecção
          </button>
        </div>
      </div>
      
      <div className="relative w-full h-64 rounded-md overflow-hidden">
        <Image 
          src={view === 'original' ? originalImageUrl : resultImageUrl} 
          alt={view === 'original' ? "Imagem original" : "Detecção do disco óptico"} 
          fill
          className="object-contain"
        />
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          A detecção do disco óptico é uma etapa importante para o diagnóstico de glaucoma, 
          pois alterações em sua aparência podem indicar danos ao nervo óptico.
        </p>
      </div>
    </div>
  );
} 