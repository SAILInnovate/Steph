import { useEffect, useState, useRef } from 'react';

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-6 bg-white border-y-4 border-black">
      <div className={`max-w-md mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="w-32 h-32 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-[#FF69B4] rounded-full translate-x-1 translate-y-1 border-2 border-black"></div>
            {/* UPDATED: Better Alt Text for Image Search */}
            <img 
              src="/images/steph-profile.jpg" 
              alt="Steph - Nail Tech & Artist in Droylsden Manchester" 
              className="relative w-full h-full object-cover rounded-full border-2 border-black z-10" 
            />
        </div>

        <h2 className="text-3xl font-['Pacifico'] text-[#FF69B4] mb-3">Hey, I'm Steph!</h2>
        
        {/* UPDATED: Specific Location Text */}
        <p className="font-['Montserrat'] text-sm text-[#333] font-medium leading-relaxed">
          I'm a <span className="font-bold bg-[#FFD700]/30 px-1">Qualified Nail & Lash Tech based in Droylsden, Manchester</span>. 
          Whether you need intricate BIAB art or a handmade custom phone case, I put my heart, soul, and sparkles into every creation.
        </p>
      </div>
    </section>
  );
}