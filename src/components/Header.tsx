"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'
    }`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo e nome */}
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="relative w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-primary-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">GlaucomaVision</span>
              <span className="text-primary-700 font-extrabold">AI</span>
            </div>
          </Link>
          
          {/* Links de navegação - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-md hover:bg-gray-50 transition-all"
            >
              Início
            </Link>
            <Link 
              href="#analise" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-md hover:bg-gray-50 transition-all"
            >
              Diagnóstico
            </Link>
            <Link 
              href="#como-funciona" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-md hover:bg-gray-50 transition-all"
            >
              Como Funciona
            </Link>
            <Link 
              href="#" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-md hover:bg-gray-50 transition-all"
            >
              Sobre
            </Link>
          </nav>
          
          {/* Botão de ação principal */}
          <div className="flex items-center gap-4">
            <Link href="#analise" className="hidden md:block btn btn-primary btn-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 transform">
              Nova Análise
            </Link>
            
            {/* Botão do menu mobile */}
            <button 
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-100 animate-fade-in">
            <Link 
              href="/" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              href="#analise" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Diagnóstico
            </Link>
            <Link 
              href="#como-funciona" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link 
              href="#" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <div className="mt-3 px-4 py-3 bg-gray-50 rounded-md">
              <Link href="#analise" className="w-full btn btn-primary text-center shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                Nova Análise
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 