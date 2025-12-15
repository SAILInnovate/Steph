import { useState } from 'react'; // 1. Import useState
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Lookbook } from './components/Lookbook';
import { HowToOrder } from './components/HowToOrder';
import { Policies } from './components/Policies';
import { FloatingElements } from './components/FloatingElements';
import { Booking } from './components/Booking';

function App() {
  // 2. Create the state to control the booking modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-[#333] pb-20">
      <FloatingElements />
      <Hero />
      <About />
      
      {/* 3. Pass the "open" function to Lookbook */}
      <Lookbook onOpenBooking={() => setIsBookingOpen(true)} />
      
      <div className="bg-white border-t-8 border-black mt-12">
        <HowToOrder />
        <Policies />
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

      {/* 4. Pass the state and setter to Booking */}
      <Booking 
        isOpen={isBookingOpen} 
        setIsOpen={setIsBookingOpen} 
      /> 
    </div>
  );
}

export default App;