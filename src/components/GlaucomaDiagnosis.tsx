"use client";

import { useEffect, useState } from 'react';

interface GlaucomaDiagnosisProps {
  isPositive?: boolean;
  confidence?: string | number;
  isLoading: boolean;
  error?: string;
}

export default function GlaucomaDiagnosis({
  isPositive,
  confidence,
  isLoading,
  error
}: GlaucomaDiagnosisProps) {
  // Garantir que a barra nunca ultrapasse 100%
  const confidenceNumber = typeof confidence === 'string' ? parseFloat(confidence.replace(',', '.')) : confidence;
  const barConfidence = confidenceNumber !== undefined ? Math.min(confidenceNumber, 100) : 0;
  
  if (isLoading) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Processando diagnóstico...</h3>
        <p className="text-gray-500 text-center">
          Nosso modelo de IA está analisando padrões e características da imagem.
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
          <span className="font-medium text-danger">Erro no Diagnóstico</span>
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
  
  if (isPositive === undefined || confidence === undefined) {
    return null;
  }
  
  return (
    <div className="card h-full">
      <div className={`card-header flex items-center ${isPositive ? 'bg-danger/5 border-danger/20' : 'bg-secondary/5 border-secondary/20'}`}>
        <div 
          className={`w-3 h-3 rounded-full mr-2 ${isPositive ? 'bg-danger' : 'bg-secondary'}`} 
        />
        <h3 className="font-medium">
          Resultado da Análise
        </h3>
        <div className={`ml-auto badge ${isPositive ? 'badge-danger' : 'badge-secondary'}`}>
          {isPositive ? 'Sinais de Glaucoma' : 'Sem Sinais de Glaucoma'}
        </div>
      </div>

      <div className="card-body">
        <div className="flex flex-col items-center py-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
            isPositive ? 'bg-danger/10' : 'bg-secondary/10'
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
          
          <h4 className={`text-xl font-bold mb-1 ${isPositive ? 'text-danger' : 'text-secondary'}`}>
            {isPositive ? 'Sinais de Glaucoma Detectados' : 'Sem Sinais de Glaucoma'}
          </h4>
          <p className="text-gray-500 text-center mb-6">
            {isPositive 
              ? 'Nossa IA detectou características compatíveis com glaucoma nesta imagem.' 
              : 'Nossa IA não identificou alterações significativas compatíveis com glaucoma.'}
          </p>
          
          <div className="w-full mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Confiança do diagnóstico</span>
              <span className={`font-bold ${isPositive ? 'text-danger' : 'text-secondary'}`}>{confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${isPositive ? 'bg-danger' : 'bg-secondary'}`} 
                style={{ width: `${barConfidence}%` }}
              ></div>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <div className="flex">
              <div className="w-40 text-sm text-gray-500">Diagnóstico:</div>
              <div className="flex-1 text-sm font-medium">
                {isPositive ? 'Suspeita de Glaucoma' : 'Normal'}
              </div>
            </div>
            <div className="flex">
              <div className="w-40 text-sm text-gray-500">Confiança:</div>
              <div className="flex-1 text-sm font-medium">{confidence}%</div>
            </div>
            <div className="flex">
              <div className="w-40 text-sm text-gray-500">Método:</div>
              <div className="flex-1 text-sm font-medium">Deep Learning CNN</div>
            </div>
            <div className="flex">
              <div className="w-40 text-sm text-gray-500">Data:</div>
              <div className="flex-1 text-sm font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-footer bg-gray-50">
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
          <p className="text-sm text-gray-700">
            <span className="font-medium">Nota importante:</span> Este resultado é gerado por um sistema de inteligência artificial 
            e não substitui o diagnóstico médico profissional. Consulte sempre um oftalmologista para avaliação 
            clínica adequada.
          </p>
        </div>
      </div>
    </div>
  );
} 