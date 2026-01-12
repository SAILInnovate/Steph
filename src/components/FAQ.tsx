import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { 
      q: "Where in Manchester are you located?", 
      a: "I am based in Droylsden (M43), just a short distance from Manchester city center. Exact location is provided upon booking confirmation." 
    },
    { 
      q: "Do you offer BIAB (Builder in a Bottle)?", 
      a: "Yes! I specialize in BIAB nails to help grow your natural nails, as well as complex gel art and extensions." 
    },
    { 
      q: "How do I order a custom phone case?", 
      a: "You can order directly through my 'Luxe Cases' section. I ship all handmade decoden cases across the UK from my Manchester studio." 
    },
    { 
      q: "What payment methods do you accept?", 
      a: "I accept cash and bank transfers. A non-refundable £10 deposit is required to secure all appointments and custom orders." 
    }
  ];

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        <div className="bg-white p-3 border-4 border-black shadow-[4px_4px_0px_#000] rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-[#FF69B4]" />
        </div>
        <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center text-shadow-barbie">
          Common Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_#333] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#FF69B4]"
            >
              <div className="p-6 flex justify-between items-center bg-white">
                <h3 className="font-['Montserrat'] font-bold text-lg md:text-xl pr-8">
                  {faq.q}
                </h3>
                {isOpen ? <Minus className="shrink-0 text-[#FF69B4]" /> : <Plus className="shrink-0 text-black" />}
              </div>
              
              <div 
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 font-['Montserrat'] text-gray-600 leading-relaxed border-t-2 border-dashed border-gray-200 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}