import { useState } from 'react';
import { X, CalendarCheck, Sparkles } from 'lucide-react';

export function Booking() {
  const [isOpen, setIsOpen] = useState(false);

  // Your specific Square Booking Link
  const SQUARE_URL = "https://book.squareup.com/appointments/xk043y4nx5ytwe/location/LK5C57F990Y1G/services";

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-black text-white font-['Montserrat'] font-bold text-lg px-6 py-4 rounded-full border-4 border-[#FF69B4] shadow-[4px_4px_0px_#FF69B4] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#FF69B4] transition-all flex items-center gap-3 animate-bounce"
        >
          <div className="relative">
            <CalendarCheck className="w-6 h-6" />
            <Sparkles className="w-4 h-4 text-[#FFD700] absolute -top-2 -right-2 animate-pulse" />
          </div>
          BOOK NAILS
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end md:justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      
      {/* Mobile: Slides up from bottom. Desktop: Floats in center */}
      <div className="bg-white w-full h-[90vh] md:h-[85vh] md:max-w-4xl md:rounded-3xl rounded-t-3xl border-t-4 md:border-4 border-black shadow-[0px_-4px_0px_#FF69B4] md:shadow-[8px_8px_0px_#FF69B4] flex flex-col overflow-hidden relative animate-in slide-in-from-bottom duration-500">
        
        {/* Header */}
        <div className="bg-[#FF69B4] p-4 flex justify-between items-center border-b-4 border-black">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💅</span>
            <h3 className="font-['Pacifico'] text-xl md:text-2xl text-white">Steph's Nail Bar</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-white text-black p-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_#333] active:translate-y-1 active:shadow-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* The Booking Frame */}
        <div className="flex-1 w-full bg-white relative">
          <iframe 
            src={SQUARE_URL}
            title="Book Appointment"
            className="w-full h-full border-none"
            loading="lazy"
          />
        </div>
        
        {/* Footer Note */}
        <div className="bg-[#FFF0F5] p-2 text-center border-t-4 border-black">
          <p className="font-['Montserrat'] text-xs font-bold text-[#FF69B4]">
            ✨ No deposit required. Pay at appointment. ✨
          </p>
        </div>
      </div>
    </div>
  );
}