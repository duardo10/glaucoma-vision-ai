"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { formatFileSize } from '@/utils/helpers';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{name: string, size: number} | null>(null);
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
    setFileDetails({
      name: file.name,
      size: file.size
    });
    
    // Enviar para o componente pai
    onImageSelected(file, url);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setFileDetails(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="card overflow-hidden">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-medium">Upload de Imagem de Retina</h3>
          {previewUrl && (
            <span className="badge badge-primary">Imagem Carregada</span>
          )}
        </div>
        
        <div className="card-body">
          <div 
            className={`border-2 border-dashed rounded-lg transition-all ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : previewUrl 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={!previewUrl ? triggerFileInput : undefined}
          >
            {previewUrl ? (
              <div className="p-4">
                <div className="relative w-full h-64 mx-auto mb-4 rounded-md overflow-hidden border border-gray-200">
                  <Image 
                    src={previewUrl} 
                    alt="Preview da imagem" 
                    fill
                    className="object-contain"
                  />
                </div>
                
                {fileDetails && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700 mb-1 truncate max-w-xs">{fileDetails.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(fileDetails.size)}</p>
                    </div>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={resetFile}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Carregue sua imagem de retina
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Arraste e solte uma imagem aqui, ou clique para selecionar um arquivo
                </p>
                <p className="text-xs text-gray-400">
                  Formatos suportados: JPG, PNG, TIFF (máximo 10MB)
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          {previewUrl && (
            <div className="mt-4">
              <div className="alert alert-info flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Imagem carregada com sucesso!</span> Agora nossa Inteligência Artificial irá analisar a imagem para detectar o disco óptico e realizar o diagnóstico.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!previewUrl && (
          <div className="card-footer flex justify-center">
            <button 
              className="btn btn-primary btn-icon"
              onClick={triggerFileInput}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Selecionar Imagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 