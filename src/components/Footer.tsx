import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GlaucomaVision AI</h3>
            <p className="text-gray-300 mb-4">
              Sistema de análise de imagens de retina para diagnóstico de glaucoma usando inteligência artificial.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-white">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-300 hover:text-white">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/analise" className="text-gray-300 hover:text-white">
                  Nova Análise
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <p className="text-gray-300">
              contato@glaucomavision.ai<br />
              (00) 1234-5678
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GlaucomaVision AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 