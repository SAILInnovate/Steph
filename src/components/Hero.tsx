import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const links = [
    { label: "Nails & Lashes", url: "https://www.instagram.com/stephsbeautyclinic/", color: "bg-white text-black", icon: "💅" },
    { label: "Phone Cases", url: "https://www.instagram.com/stephsluxecreations/", color: "bg-[#FF69B4] text-white", icon: "📱" },
    { label: "Flowers", url: "https://www.instagram.com/stephsfloralgarden/#", color: "bg-white text-black", icon: "🌸" },
  ];

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative z-10">
      
      {/* Brand */}
      <div className={`text-center mb-12 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-6xl font-['Pacifico'] text-white mb-2 text-shadow-barbie">
          Steph's World
        </h1>
        <p className="font-['Montserrat'] font-bold text-sm text-white bg-black inline-block px-4 py-1 -rotate-2">
          EST. 2025
        </p>
      </div>

      {/* The 3 Big Buttons (Mobile First Menu) */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between px-6 py-5 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all ${link.color} 
            ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <span className="font-['Montserrat'] font-black text-xl uppercase tracking-wider">{link.label}</span>
            <span className="text-3xl">{link.icon}</span>
          </a>
        ))}
      </div>

      <div className="absolute bottom-6 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </section>
  );
}