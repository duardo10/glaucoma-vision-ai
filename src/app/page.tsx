"use client";

import { useState, useEffect } from 'react';
import { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import OpticDiscDetection from '@/components/OpticDiscDetection';
import GlaucomaDiagnosis from '@/components/GlaucomaDiagnosis';
import { detectOpticDisc, diagnosisGlaucoma } from '@/services/api';
import { createContext, useContext } from 'react';

// Contexto para reset global
export const NewAnalysisContext = createContext<() => void>(() => {});

export default function Home() {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [discDetectionLoading, setDiscDetectionLoading] = useState(false);
  const [discDetectionResult, setDiscDetectionResult] = useState<string | null>(null);
  const [discDetectionError, setDiscDetectionError] = useState<string | null>(null);
  
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    isPositive: boolean;
    confidence: number;
  } | null>(null);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [discDetections, setDiscDetections] = useState<any[] | null>(null);
  const [resetUploader, setResetUploader] = useState(false);
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  
  const handleImageSelected = async (file: File, previewUrl: string) => {
    setOriginalImageUrl(previewUrl);
    setSelectedFile(file);
    setDiscDetectionResult(null);
    setDiscDetectionError(null);
    setDiagnosisResult(null);
    setDiagnosisError(null);
    setDiscDetections(null);
    
    // Iniciar detecção do disco óptico
    setDiscDetectionLoading(true);
    try {
      const discResult = await detectOpticDisc(file);
      setDiscDetectionResult(discResult.resultImageUrl);
      setDiscDetections(discResult.detections || null);
      
      // Iniciar diagnóstico de glaucoma após a detecção do disco óptico
      setDiagnosisLoading(true);
      try {
        const diagResult = await diagnosisGlaucoma(file);
        setDiagnosisResult(diagResult);
      } catch (error) {
        setDiagnosisError('Não foi possível completar o diagnóstico. Tente novamente.');
      } finally {
        setDiagnosisLoading(false);
      }
      
    } catch (error) {
      setDiscDetectionError('Não foi possível detectar o disco óptico. Tente novamente.');
    } finally {
      setDiscDetectionLoading(false);
    }
  };

  // Função para resetar todos os estados e permitir nova análise
  const handleNewAnalysis = () => {
    setOriginalImageUrl(null);
    setSelectedFile(null);
    setDiscDetectionResult(null);
    setDiscDetectionError(null);
    setDiagnosisResult(null);
    setDiagnosisError(null);
    setDiscDetections(null);
    setResetUploader(r => !r); // alterna o valor para forçar reset
  };
  
  return (
    <NewAnalysisContext.Provider value={handleNewAnalysis}>
      <div className={`flex flex-col min-h-screen bg-gray-50 ${isPageLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="hero-gradient py-20 border-b border-gray-100">
            <div className="container mx-auto px-4 text-center relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
              
              <div className="inline-block bg-primary-50 px-4 py-1.5 rounded-full text-primary-700 font-medium text-sm mb-6 shadow-sm">
                Tecnologia avançada em diagnóstico ocular
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                Diagnóstico de Glaucoma<br className="hidden md:block" />com Inteligência Artificial
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
                Faça upload de uma imagem de fundo de olho para analisar a presença de sinais de 
                glaucoma utilizando modelos avançados de inteligência artificial.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <a href="#analise" className="btn btn-primary btn-lg shadow-md hover:shadow-lg transform transition hover:-translate-y-1">
                  Iniciar Diagnóstico
                </a>
                <a href="#como-funciona" className="btn btn-outline btn-lg">
                  Como Funciona
                </a>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-gray-500 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span>Privacidade protegida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span>Resultados em segundos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Tecnologia avançada</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Main Analysis Section */}
          <section id="analise" className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium py-1 px-3 rounded-md mb-3">Diagnóstico</span>
                <h2 className="text-3xl font-bold mb-4">Análise de Imagens Retinianas</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Faça upload de uma imagem de retina para obter um diagnóstico automatizado
                  de possíveis sinais de glaucoma usando nossa tecnologia de IA.
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto mb-16 shadow-card rounded-2xl overflow-hidden">
                <ImageUploader onImageSelected={handleImageSelected} reset={resetUploader} />
              </div>
              
              {originalImageUrl && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-in">
                    <OpticDiscDetection 
                      originalImageUrl={originalImageUrl}
                      resultImageUrl={discDetectionResult || undefined}
                      isLoading={discDetectionLoading}
                      error={discDetectionError || undefined}
                      detections={discDetections || undefined}
                    />
                    <GlaucomaDiagnosis 
                      isPositive={diagnosisResult?.isPositive}
                      confidence={diagnosisResult?.confidence !== undefined ? Number(diagnosisResult.confidence).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : undefined}
                      isLoading={diagnosisLoading}
                      error={diagnosisError || undefined}
                    />
                  </div>
              )}
            </div>
          </section>
          
          {/* How It Works Section */}
          <section id="como-funciona" className="py-20 bg-white border-y border-gray-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium py-1 px-3 rounded-md mb-3">Processo</span>
                <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Nosso sistema utiliza modelos avançados de inteligência artificial para analisar imagens
                  de retina e identificar sinais de glaucoma com precisão.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="feature-card">
                  <div className="mb-5">
                    <div className="feature-icon-bg mb-4">
                      <svg className="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">1. Upload da Imagem</h3>
                    <p className="text-gray-600">
                      Faça o upload de uma imagem de fundo de olho de alta qualidade no formato JPG, PNG ou TIFF.
                    </p>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="mb-5">
                    <div className="feature-icon-bg mb-4">
                      <svg className="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">2. Detecção do Disco Óptico</h3>
                    <p className="text-gray-600">
                      Nossa IA localiza e analisa o disco óptico, uma estrutura crucial para o diagnóstico de glaucoma.
                    </p>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="mb-5">
                    <div className="feature-icon-bg mb-4">
                      <svg className="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">3. Análise e Diagnóstico</h3>
                    <p className="text-gray-600">
                      O sistema avalia os padrões na imagem e fornece um diagnóstico com nível de confiança baseado nos dados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Important Notice */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Aviso Importante</h3>
                    <p className="text-gray-700 mb-2">
                      Este sistema é uma ferramenta de auxílio ao diagnóstico e não substitui a avaliação de um médico oftalmologista.
                      Os resultados devem ser interpretados por profissionais qualificados.
                    </p>
                    <p className="text-gray-700">
                      Sempre consulte um profissional de saúde para diagnóstico e tratamento adequados de condições oculares.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </NewAnalysisContext.Provider>
  );
} 