import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }
    
    // Criar URL para preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Enviar para o componente pai
    onImageSelected(file, url);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <div className="relative w-full h-64 mx-auto">
            <Image 
              src={previewUrl} 
              alt="Preview da imagem" 
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg 
                className="w-16 h-16 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                />
              </svg>
            </div>
            <p className="text-lg font-medium">
              Arraste uma imagem de retina ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Suporta imagens JPG, PNG e TIFF
            </p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {previewUrl && (
        <div className="mt-4 flex justify-center">
          <button 
            className="btn btn-outline"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            Remover imagem
          </button>
        </div>
      )}
    </div>
  );
} 