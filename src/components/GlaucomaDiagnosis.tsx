import { useEffect, useState } from 'react';

interface GlaucomaDiagnosisProps {
  isPositive?: boolean;
  confidence?: number;
  isLoading: boolean;
  error?: string;
}

export default function GlaucomaDiagnosis({
  isPositive,
  confidence,
  isLoading,
  error
}: GlaucomaDiagnosisProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  
  useEffect(() => {
    if (confidence !== undefined) {
      const interval = setInterval(() => {
        setAnimatedConfidence(prev => {
          const next = prev + 1;
          if (next >= confidence) {
            clearInterval(interval);
            return confidence;
          }
          return next;
        });
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [confidence]);
  
  if (isLoading) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Processando diagnóstico...</p>
        <p className="text-sm text-gray-500">Analisando características da imagem</p>
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
        <p className="mt-4 text-lg font-medium text-danger">Erro no diagnóstico</p>
        <p className="text-sm text-gray-700 text-center">{error}</p>
      </div>
    );
  }
  
  if (isPositive === undefined || confidence === undefined) {
    return null;
  }
  
  return (
    <div className={`card border ${isPositive ? 'border-danger/30 bg-danger/5' : 'border-secondary/30 bg-secondary/5'}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Resultado da Análise</h3>
        <p className="text-sm text-gray-500">
          Baseado na análise da imagem utilizando inteligência artificial
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
          isPositive ? 'bg-danger/20' : 'bg-secondary/20'
        }`}>
          {isPositive ? (
            <svg 
              className="w-12 h-12 text-danger" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          ) : (
            <svg 
              className="w-12 h-12 text-secondary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </div>
        
        <h4 className={`text-xl font-bold mt-4 ${isPositive ? 'text-danger' : 'text-secondary'}`}>
          {isPositive ? 'Sinais de Glaucoma Detectados' : 'Sem Sinais de Glaucoma'}
        </h4>
        
        <div className="w-full mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Confiança do diagnóstico</span>
            <span className="font-medium">{animatedConfidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${isPositive ? 'bg-danger' : 'bg-secondary'}`} 
              style={{ width: `${animatedConfidence}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Nota importante:</span> Este resultado é gerado por um sistema de inteligência artificial 
          e não substitui o diagnóstico médico profissional. Consulte sempre um oftalmologista para avaliação 
          clínica adequada.
        </p>
      </div>
    </div>
  );
} 