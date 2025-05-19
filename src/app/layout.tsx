import './styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'GlaucomaVision AI - Diagnóstico por Imagem de Retina',
  description: 'Sistema de análise de imagens de retina para diagnóstico de glaucoma usando inteligência artificial',
  keywords: 'glaucoma, diagnóstico, IA, inteligência artificial, oftalmologia, saúde ocular, retina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 