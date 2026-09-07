import React from 'react';
import { Link } from 'react-router-dom';
import { useWebsiteCopy } from '../../../hooks/useWebsiteCopy';
import { CtaSectionCopy } from '../../../types/websiteCopy';

interface CTASectionProps {
  ctaContent?: CtaSectionCopy;
}

export default function CTASection({ ctaContent }: CTASectionProps = {}) {
  const { cta: fallbackCta } = useWebsiteCopy();
  const cta = ctaContent || fallbackCta;

  return (
    <section className="w-full py-24 sm:py-32 bg-[#5B0617] text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col gap-8 items-center">
        <h2 className="font-display-reading text-4xl sm:text-5xl lg:text-6xl text-white">
          {cta.heading.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < cta.heading.split('\n').length - 1 && <br/>}
            </React.Fragment>
          ))}
        </h2>
        <div className="font-body-reading text-lg sm:text-xl text-white/80 max-w-lg mb-4 whitespace-pre-wrap">
          {cta.text.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        
        <div className="flex flex-col gap-2 my-4">
          <span className="font-label-caps text-[11px] tracking-widest uppercase font-bold text-white/90">ASF FUTA</span>
          <span className="font-body-md text-white/70">Anglican Students' Fellowship<br/>Federal University of Technology, Akure</span>
        </div>
        
        <Link to="/portal" className="mt-4 flex items-center justify-center bg-white text-[#5B0617] font-body-md font-semibold h-[52px] px-8 rounded-xl hover:bg-[#FDFBF9] transition-colors active:scale-95 shadow-xl">
          {cta.ctaButtonText}
        </Link>
      </div>
    </section>
  );
}
