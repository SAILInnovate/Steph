import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const [nameVisible, setNameVisible] = useState(false);
  const [bubblesVisible, setBubblesVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setNameVisible(true), 500);
    setTimeout(() => setBubblesVisible(true), 1500);
  }, []);

  const handleBubbleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      <h1
        className={`text-6xl md:text-8xl font-['Pacifico'] text-[#FF69B4] mb-16 transition-all duration-1000 ${
          nameVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{ textShadow: '3px 3px 0px #333333' }}
      >
        Steph
      </h1>

      <div
        className={`flex flex-col md:flex-row gap-8 md:gap-16 mb-16 transition-all duration-1000 ${
          bubblesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <button
          onClick={() => handleBubbleClick('https://www.instagram.com/stephsluxecreations?igsh=MWJtcXZhMXlqcHkwZw==')}
          className="bubble-link group"
          aria-label="Visit Steph's Luxe Creations on Instagram"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#FFC2E2] to-[#FF69B4] flex items-center justify-center text-6xl md:text-7xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] group-hover:shadow-[12px_12px_0px_#333333] group-active:shadow-[4px_4px_0px_#333333] transition-all duration-200 group-hover:scale-110 group-active:scale-95">
            📱
          </div>
          <p className="mt-4 font-['Montserrat'] font-bold text-lg text-[#333333]">
            Luxe Creations
          </p>
        </button>

        <button
          onClick={() => handleBubbleClick('https://www.instagram.com/stephsfloralgarden?igsh=bjB2amN1ZjIyOGQw')}
          className="bubble-link group"
          aria-label="Visit Steph's Floral Garden on Instagram"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#FFC2E2] to-[#FF69B4] flex items-center justify-center text-6xl md:text-7xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] group-hover:shadow-[12px_12px_0px_#333333] group-active:shadow-[4px_4px_0px_#333333] transition-all duration-200 group-hover:scale-110 group-active:scale-95">
            🌸
          </div>
          <p className="mt-4 font-['Montserrat'] font-bold text-lg text-[#333333]">
            Floral Garden
          </p>
        </button>
      </div>

      <div className="animate-bounce">
        <ChevronDown className="w-8 h-8 text-[#FF69B4]" />
      </div>
    </section>
  );
}
