"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">GlaucomaVision AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-primary font-medium">
            Início
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-primary font-medium">
            Sobre
          </Link>
          <Link href="/como-funciona" className="text-gray-700 hover:text-primary font-medium">
            Como Funciona
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link href="/analise" className="btn btn-primary">
            Nova Análise
          </Link>
        </div>
      </div>
    </header>
  );
} 