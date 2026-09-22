import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../components/Logo';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#18181B] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 font-body-md">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 mb-1">
            <Logo size="sm" theme="white" variant="futa" />
          </div>
          <p className="text-white/60 leading-relaxed max-w-sm">
            Anglican Students' Fellowship<br/>
            Federal University of Technology, Akure
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <span className="font-bold text-white mb-2">Explore</span>
          <a href="#about" className="text-white/60 hover:text-white transition-colors">About ASF</a>
          <a href="#life" className="text-white/60 hover:text-white transition-colors">Life at ASF</a>
          <a href="#schedule" className="text-white/60 hover:text-white transition-colors">Events</a>
          <a href="#visit" className="text-white/60 hover:text-white transition-colors">Visit Us</a>
          <a href="#contact" className="text-white/60 hover:text-white transition-colors">Contact</a>
        </div>
        
        <div className="flex flex-col gap-4">
          <span className="font-bold text-white mb-2">Connect</span>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Facebook</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">YouTube</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">WhatsApp</a>
        </div>
        
        <div className="flex flex-col gap-4">
          <span className="font-bold text-white mb-2">More</span>
          <a 
            href="#visit" 
            onClick={(e) => {
              const el = document.querySelector('[data-section-id="visit"]');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-white/60 hover:text-white transition-colors"
          >
            Support ASF
          </a>
          <Link to="/portal" className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
            Member App
          </Link>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-xs">
        <span>&copy; {currentYear} ASF FUTA. All rights reserved.</span>
        <Link to="/tech" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          Powered by ASF
        </Link>
      </div>
    </footer>
  );
}
