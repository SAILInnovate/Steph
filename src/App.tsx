import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ProductShowcase } from './components/ProductShowcase';
import { HowToOrder } from './components/HowToOrder';
import { Policies } from './components/Policies';
import { Contact } from './components/Contact';
import { FloatingElements } from './components/FloatingElements';

function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF0F5] relative overflow-x-hidden">
      <FloatingElements />
      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Hero />
        <About />
        <ProductShowcase />
        <HowToOrder />
        <Policies />
        <Contact />
      </div>
    </div>
  );
}

export default App;
