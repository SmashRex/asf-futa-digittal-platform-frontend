import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sectionIds = ['about', 'schedule', 'life', 'visit'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-15% 0px -50% 0px',
        threshold: 0.1,
      }
    );

    const observeTargets = () => {
      sectionIds.forEach((id) => {
        const el = document.querySelector(`[data-section-id="${id}"]`);
        if (el) observer.observe(el);
      });
    };

    observeTargets();
    const timer = setTimeout(observeTargets, 500);

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setActiveSection(sectionId);
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'about', label: 'About ASF' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'life', label: 'Life at ASF' },
    { id: 'visit', label: 'Visit Us' },
  ];

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md w-full top-0 sticky border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20 z-50 transition-colors shadow-sm">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-label-caps text-[#5B0617] font-bold text-lg tracking-widest uppercase">ASF FUTA</span>
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          aria-label="Toggle menu" 
          className="md:hidden text-stone-600 hover:bg-stone-100 p-2 rounded-xl active:scale-95 transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button 
                key={item.id}
                type="button" 
                className={`font-body-md transition-all cursor-pointer relative py-1 ${
                  isActive 
                    ? 'text-[#5B0617] font-bold border-b-2 border-[#5B0617]' 
                    : 'font-medium text-stone-600 hover:text-[#5B0617]'
                }`} 
                onClick={(e) => scrollToSection(e, item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link 
            to="/portal" 
            className="inline-flex items-center justify-center bg-[#18181B] text-white font-body-md font-semibold h-[42px] px-6 rounded-xl hover:bg-[#27272A] transition-colors shadow-sm"
          >
            Member App
          </Link>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 flex flex-col gap-8 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button 
                key={item.id}
                type="button" 
                className={`font-display-reading text-3xl border-b border-stone-100 pb-4 text-left cursor-pointer transition-colors ${
                  isActive 
                    ? 'text-[#5B0617] font-bold pl-2 border-l-4 border-[#5B0617]' 
                    : 'text-[#18181B]'
                }`} 
                onClick={(e) => scrollToSection(e, item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="mt-8">
          <Link 
            to="/portal" 
            onClick={() => setIsMenuOpen(false)}
            className="w-full inline-flex items-center justify-center bg-[#5B0617] text-white font-body-md font-semibold h-[52px] px-6 rounded-xl hover:bg-[#7A1F2B] transition-colors shadow-sm"
          >
            Open Member App
          </Link>
        </div>
      </div>
    </>
  );
}
