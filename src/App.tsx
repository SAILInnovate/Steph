import { Hero } from './components/Hero';
import { About } from './components/About';
import { Lookbook } from './components/Lookbook';
import { HowToOrder } from './components/HowToOrder';
import { Policies } from './components/Policies';
import { FloatingElements } from './components/FloatingElements';
import { Booking } from './components/Booking'; // <--- Import this

function App() {
  return (
    <div className="min-h-screen relative overflow-x-hidden text-[#333] pb-20">
      <FloatingElements />
      
      <Hero />
      <About />
      <Lookbook />
      
      <div className="bg-white border-t-8 border-black mt-12">
        <HowToOrder />
        <Policies />
        
        <footer className="bg-[#FF69B4] border-t-8 border-black py-12 px-6 text-center">
            <p className="font-['Montserrat'] font-bold text-white mb-8">
              © 2025 Steph's World
            </p>
            <a 
              href="http://praedexa.com/stefani"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border-4 border-black font-bold text-xs hover:scale-105 transition-transform"
            >
              ✝ My Faith
            </a>
        </footer>
      </div>

      {/* The Floating Booking Button */}
      <Booking /> 
    </div>
  );
}

export default App;