import { Calendar, Palette, Flower } from 'lucide-react';

export function Services() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
       <h2 className="text-4xl md:text-6xl font-['Pacifico'] text-white text-center mb-16 text-shadow-barbie">
          Pick Your Treat
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Nails & Lashes Service */}
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#333] flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            {/* Image Header */}
            <div className="h-64 overflow-hidden border-b-4 border-black relative">
                <img src="/images/nails-pink.jpg" alt="Nails" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 font-['Montserrat'] font-bold text-xs">
                    NAILS & LASHES
                </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-['Pacifico'] text-3xl mb-3 text-[#FF69B4]">Beauty Clinic</h3>
                <p className="font-['Montserrat'] text-sm mb-6 flex-grow font-medium text-gray-600 leading-relaxed">
                Specializing in Gel extensions, BIAB, intricate nail art, and volume lashes.
                </p>
                <button onClick={() => window.open('https://www.instagram.com/stephsbeautyclinic/', '_blank')} 
                className="w-full py-4 bg-black text-white font-bold font-['Montserrat'] hover:bg-[#FF69B4] transition-colors flex items-center justify-center gap-2 border-2 border-transparent hover:border-black uppercase tracking-widest text-sm">
                <Calendar size={16} /> Book Now
                </button>
            </div>
          </div>

          {/* Phone Cases */}
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#333] flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
             {/* We don't have a phone photo yet, so we use a pattern or keeping the previous style, 
                 BUT let's use the lash photo here as a placeholder for 'Detail Work' or keep it graphic */}
            <div className="h-64 bg-[#E0F7FA] border-b-4 border-black flex items-center justify-center relative overflow-hidden">
                 <div className="text-8xl animate-pulse">📱</div>
                 <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 font-['Montserrat'] font-bold text-xs">
                    ACCESSORIES
                </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-['Pacifico'] text-3xl mb-3 text-[#FF69B4]">Luxe Cases</h3>
                <p className="font-['Montserrat'] text-sm mb-6 flex-grow font-medium text-gray-600 leading-relaxed">
                Handmade decoden cases with charms, cream clay, and rhinestones. 
                </p>
                <button onClick={() => window.open('https://www.instagram.com/stephsluxecreations/', '_blank')} 
                className="w-full py-4 bg-black text-white font-bold font-['Montserrat'] hover:bg-[#FF69B4] transition-colors flex items-center justify-center gap-2 border-2 border-transparent hover:border-black uppercase tracking-widest text-sm">
                <Palette size={16} /> Order Custom
                </button>
            </div>
          </div>

          {/* Flowers */}
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#333] flex flex-col overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="h-64 overflow-hidden border-b-4 border-black relative">
                <img src="/images/flowers-pink.jpg" alt="Bouquet" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 font-['Montserrat'] font-bold text-xs">
                    GIFTS
                </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-['Pacifico'] text-3xl mb-3 text-[#FF69B4]">Floral Garden</h3>
                <p className="font-['Montserrat'] text-sm mb-6 flex-grow font-medium text-gray-600 leading-relaxed">
                Satin ribbon roses and everlasting arrangements. The perfect gift that never fades.
                </p>
                <button onClick={() => window.open('https://www.instagram.com/stephsfloralgarden/#', '_blank')} 
                className="w-full py-4 bg-black text-white font-bold font-['Montserrat'] hover:bg-[#FF69B4] transition-colors flex items-center justify-center gap-2 border-2 border-transparent hover:border-black uppercase tracking-widest text-sm">
                <Flower size={16} /> Shop Flowers
                </button>
            </div>
          </div>

        </div>
    </section>
  )
}