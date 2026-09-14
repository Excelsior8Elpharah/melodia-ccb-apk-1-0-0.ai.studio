import React from 'react';

export type ClefType = 'sol' | 'fa' | 'do' | 'dupla' | 'pauta' | 'auto';

interface MusicalWatermarkProps {
  type?: ClefType;
  instrumento?: string;
  className?: string;
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center-right';
  opacityClass?: string;
}

// Crisp Vector Paths for Musical Clefs
const TrebleClefSVG = () => (
  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full">
    <path d="M52.3,184.2 C45.1,184.2 39.5,179.8 39.5,172.5 C39.5,164.2 46.2,158.4 53.6,158.4 C55.2,158.4 56.8,158.8 58.2,159.5 C55.8,142.1 43.1,128.6 29.8,118.2 C19.2,109.9 10.1,99.2 10.1,84.6 C10.1,58.8 30.5,37.5 50.8,14.2 C53.2,11.5 56.5,7.2 59.8,2.5 C60.8,1.1 62.4,1 63.2,2.3 C63.8,3.2 63.6,4.5 62.9,5.7 C58.2,14.1 50.1,28.8 45.3,42.6 C39.5,59.3 40.2,77.5 48.6,92.6 C52.1,99.0 57.3,104.5 63.5,108.9 C69.2,112.9 75.8,115.6 81.2,120.4 C90.5,128.7 95.8,141.1 94.2,154.2 C92.1,171.3 78.5,185.1 61.2,185.8 C60.2,185.8 58.7,185.8 57.5,185.7 C56.5,191.8 53.2,197.8 46.2,197.8 C41.2,197.8 37.1,194.2 37.1,189.1 C37.1,182.8 42.6,178.5 48.5,178.5 C50.8,178.5 52.8,179.2 54.5,180.3 C55.5,175.4 56.3,170.2 56.8,165.1 C51.2,164.3 46.2,167.5 44.8,172.5 C44.2,174.6 44.6,176.8 45.8,178.2 C43.2,178.5 41.5,180.8 41.5,183.5 C41.5,187.8 45.2,190.8 49.8,190.8 C54.8,190.8 58.6,186.2 59.5,180.2 C72.8,178.8 82.8,167.5 84.1,153.8 C85.3,141.8 80.2,130.8 71.8,123.5 C66.8,119.1 60.5,116.8 54.8,113.1 C46.8,107.9 39.8,101.2 35.8,92.5 C31.2,82.5 31.8,70.1 36.2,59.8 C41.1,48.2 49.2,35.2 56.1,23.5 C53.2,32.8 48.5,42.8 46.2,52.5 C43.2,65.2 43.8,78.2 49.2,89.8 C53.8,99.8 61.8,107.2 71.2,112.5 C78.2,116.5 85.8,121.2 90.8,128.2 C97.2,137.2 99.1,149.2 96.8,160.2 C93.2,177.2 77.2,190.8 59.8,190.8 C56.8,190.8 54.2,188.5 52.3,184.2 Z" />
  </svg>
);

const BassClefSVG = () => (
  <svg viewBox="0 0 100 120" fill="currentColor" className="w-full h-full">
    <path d="M38.5,12 C21.2,12 7.2,25.8 7.2,43.1 C7.2,58.2 18.1,70.5 32.8,72.8 C24.1,81.5 14.8,91.2 5.2,99.8 C3.8,101.1 3.5,103.2 4.8,104.6 C5.5,105.3 6.5,105.6 7.5,105.6 C8.2,105.6 9.0,105.3 9.6,104.8 C23.8,92.1 38.2,77.5 48.8,61.2 C57.2,48.2 60.5,33.1 56.8,18.5 C53.8,6.8 43.5,12 38.5,12 Z M35.2,21.5 C44.8,21.5 50.8,28.8 49.2,38.5 C47.8,47.2 40.5,58.8 32.1,65.2 C22.5,63.5 15.2,54.8 15.2,43.1 C15.2,31.2 24.1,21.5 35.2,21.5 Z M78.2,22.5 C72.8,22.5 68.5,26.8 68.5,32.2 C68.5,37.6 72.8,41.9 78.2,41.9 C83.6,41.9 87.9,37.6 87.9,32.2 C87.9,26.8 83.6,22.5 78.2,22.5 Z M78.2,52.5 C72.8,52.5 68.5,56.8 68.5,62.2 C68.5,67.6 72.8,71.9 78.2,71.9 C83.6,71.9 87.9,67.6 87.9,62.2 C87.9,56.8 83.6,52.5 78.2,52.5 Z" />
  </svg>
);

const AltoClefSVG = () => (
  <svg viewBox="0 0 100 120" fill="currentColor" className="w-full h-full">
    <path d="M15,10 L25,10 L25,110 L15,110 Z M30,10 L35,10 L35,110 L30,110 Z M38,10 C48,10 56,18 56,28 C56,36 50,42 42,45 C52,48 58,56 58,66 C58,78 48,86 38,86 L38,76 C44,76 50,71 50,64 C50,57 44,52 38,52 L38,44 C44,44 50,39 50,32 C50,25 44,20 38,20 Z M62,34 C70,34 78,41 78,50 C78,57 72,63 65,65 C74,68 80,76 80,86 C80,98 70,106 60,106 L60,96 C66,96 72,91 72,84 C72,77 66,72 60,72 L60,64 C66,64 72,59 72,52 C72,45 66,40 60,40 Z" />
  </svg>
);

const StaffLinesSVG = () => (
  <svg viewBox="0 0 400 120" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <line x1="0" y1="20" x2="400" y2="20" />
    <line x1="0" y1="40" x2="400" y2="40" />
    <line x1="0" y1="60" x2="400" y2="60" />
    <line x1="0" y1="80" x2="400" y2="80" />
    <line x1="0" y1="100" x2="400" y2="100" />
  </svg>
);

// Map instruments to clefs automatically
export function getClefForInstrument(instrumento?: string): ClefType {
  if (!instrumento) return 'sol';
  const inst = instrumento.toLowerCase();

  // Bass Clef Instruments
  if (
    inst.includes('violoncelo') || 
    inst.includes('baixo') || 
    inst.includes('contrabaixo') || 
    inst.includes('trombone') || 
    inst.includes('tuba') || 
    inst.includes('eufônio') || 
    inst.includes('euphonium') || 
    inst.includes('fagote') || 
    inst.includes('bombardino')
  ) {
    return 'fa';
  }

  // Alto Clef Instruments
  if (inst.includes('viola') && !inst.includes('violino') && !inst.includes('violão')) {
    return 'do';
  }

  // Dual Clef Instruments
  if (inst.includes('órgão') || inst.includes('piano') || inst.includes('teclado')) {
    return 'dupla';
  }

  // Default Treble Clef (Violino, Flauta, Trompete, Saxofone, Clarinete, Oboé, Trompa, etc.)
  return 'sol';
}

export default function MusicalWatermark({
  type = 'auto',
  instrumento,
  className = '',
  position = 'bottom-right',
  opacityClass = 'opacity-[0.035] dark:opacity-[0.06]'
}: MusicalWatermarkProps) {
  const activeType = type === 'auto' ? getClefForInstrument(instrumento) : type;

  // Position classes
  const positionClasses = {
    'bottom-right': '-bottom-8 -right-8 md:-bottom-12 md:-right-12',
    'top-right': '-top-8 -right-8 md:-top-12 md:-right-12',
    'bottom-left': '-bottom-8 -left-8 md:-bottom-12 md:-left-12',
    'top-left': '-top-8 -left-8 md:-top-12 md:-left-12',
    'center-right': 'top-1/2 -translate-y-1/2 -right-10 md:-right-16',
  }[position];

  return (
    <div 
      className={`absolute ${positionClasses} pointer-events-none select-none z-0 overflow-hidden text-slate-900 dark:text-blue-200 transition-opacity duration-300 ${opacityClass} ${className}`}
      aria-hidden="true"
    >
      {activeType === 'sol' && (
        <div className="w-48 h-80 md:w-64 md:h-96 transform rotate-[-12deg]">
          <TrebleClefSVG />
        </div>
      )}

      {activeType === 'fa' && (
        <div className="w-48 h-56 md:w-64 md:h-72 transform rotate-[-6deg]">
          <BassClefSVG />
        </div>
      )}

      {activeType === 'do' && (
        <div className="w-44 h-52 md:w-60 md:h-68 transform rotate-[4deg]">
          <AltoClefSVG />
        </div>
      )}

      {activeType === 'dupla' && (
        <div className="flex items-center gap-4 w-72 h-72 md:w-96 md:h-96 transform rotate-[-8deg]">
          <div className="w-1/2 h-full">
            <TrebleClefSVG />
          </div>
          <div className="w-1/2 h-full pt-10">
            <BassClefSVG />
          </div>
        </div>
      )}

      {activeType === 'pauta' && (
        <div className="w-96 h-36 md:w-[600px] md:h-48 transform rotate-[-5deg]">
          <StaffLinesSVG />
        </div>
      )}
    </div>
  );
}
