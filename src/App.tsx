import { useState } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Lookbook } from './components/Lookbook';
import { HowToOrder } from './components/HowToOrder';
import { Policies } from './components/Policies';
import { FloatingElements } from './components/FloatingElements';
import { Booking } from './components/Booking';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-[#333] pb-20">
      {/* Background Animation */}
      <FloatingElements />
      
      {/* Main Content */}
      <Hero />
      <About />
      
      {/* Services Grid - Passes the open function to the Nails card */}
      <Lookbook onOpenBooking={() => setIsBookingOpen(true)} />
      
      {/* Information Section Wrapper */}
      <div className="bg-white border-t-8 border-black mt-12">
        <HowToOrder />
        <Policies />
        <FAQ />
        <Contact />
        
        {/* Footer */}
        <footer className="bg-[#FF69B4] border-t-8 border-black py-12 px-6 text-center">
            <p className="font-['Montserrat'] font-bold text-white mb-8">
              © {new Date().getFullYear()} Steph's World
            </p>
            <a 
              href="http://praedexa.com/u/stefani"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border-4 border-black font-bold text-xs hover:scale-105 transition-transform"
            >
              ✝ My Faith
            </a>
        </footer>
      </div>

      {/* Booking Modal Overlay */}
      <Booking 
        isOpen={isBookingOpen} 
        setIsOpen={setIsBookingOpen} 
      /> 
    </div>
  );
}

export default App;