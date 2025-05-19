import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import OpticDiscDetection from '@/components/OpticDiscDetection';
import GlaucomaDiagnosis from '@/components/GlaucomaDiagnosis';
import { detectOpticDisc, diagnosisGlaucoma } from '@/services/api';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
  
  const handleImageSelected = async (file: File, previewUrl: string) => {
    setOriginalImageUrl(previewUrl);
    setSelectedFile(file);
    setDiscDetectionResult(null);
    setDiscDetectionError(null);
    setDiagnosisResult(null);
    setDiagnosisError(null);
    
    // Iniciar detecção do disco óptico
    setDiscDetectionLoading(true);
    try {
      const discResult = await detectOpticDisc(file);
      setDiscDetectionResult(discResult.resultImageUrl);
      
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
  
  return (
    <div className={`flex flex-col min-h-screen ${inter.className}`}>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Análise de Imagens Retinianas para Glaucoma</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Faça upload de uma imagem de fundo de olho para analisar a presença de sinais de glaucoma utilizando 
            modelos avançados de inteligência artificial.
          </p>
        </section>
        
        <section className="max-w-4xl mx-auto mb-12">
          <ImageUploader onImageSelected={handleImageSelected} />
        </section>
        
        {originalImageUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <OpticDiscDetection 
              originalImageUrl={originalImageUrl}
              resultImageUrl={discDetectionResult || undefined}
              isLoading={discDetectionLoading}
              error={discDetectionError || undefined}
            />
            
            <GlaucomaDiagnosis 
              isPositive={diagnosisResult?.isPositive}
              confidence={diagnosisResult?.confidence}
              isLoading={diagnosisLoading}
              error={diagnosisError || undefined}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 