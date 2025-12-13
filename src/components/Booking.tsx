import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  X, CalendarCheck, Sparkles, CheckCircle, Loader2, 
  Instagram, User, AlertCircle, CalendarDays, CreditCard, 
  AlertTriangle, Check, Camera, MessageCircle, Download, 
  Clock, ChevronRight, Phone, HelpCircle, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// CONSTANTS
const STORAGE_KEY = 'stephs_active_booking';

// Helper: Copy Component
const CopyRow = ({ label, value }: { label: string, value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div onClick={handleCopy} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg active:bg-gray-50 transition-colors cursor-pointer">
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-mono font-bold text-sm truncate">{value}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {copied ? 'COPIED' : 'COPY'}
      </span>
    </div>
  );
};

export function Booking({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  // UI State
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState("Simple Design");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showLashGuide, setShowLashGuide] = useState(false); // NEW: State for lash guide

  // Booking Data State
  const [selectedService, setSelectedService] = useState<{name: string, duration: number, price: string, category: string} | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  
  // Client Form State
  const [clientDetails, setClientDetails] = useState({
    name: '',
    instagram: '',
    phone: '',
    notes: ''
  });
  
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Scroll Ref for UX
  const contentRef = useRef<HTMLDivElement>(null);

  // STATIC DATA
  const services = [
    // Simple Design
    { id: 1, category: "Simple Design", name: "Short Length", duration: 90, price: "£25" },
    { id: 2, category: "Simple Design", name: "Medium Length", duration: 90, price: "£30" },
    { id: 3, category: "Simple Design", name: "Long Length", duration: 105, price: "£35" },
    { id: 4, category: "Simple Design", name: "XL Length", duration: 120, price: "£40" },
    { id: 5, category: "Simple Design", name: "XXL Length", duration: 135, price: "£45" },
    // Complex Design
    { id: 6, category: "Complex Design", name: "Short Length", duration: 105, price: "£30" },
    { id: 7, category: "Complex Design", name: "Medium Length", duration: 120, price: "£35" },
    { id: 8, category: "Complex Design", name: "Long Length", duration: 135, price: "£40" },
    { id: 9, category: "Complex Design", name: "XL Length", duration: 150, price: "£45" },
    { id: 10, category: "Complex Design", name: "XXL Length", duration: 165, price: "£50" },
    // Toes
    { id: 11, category: "Toes", name: "Simple AC Toes", duration: 60, price: "£20" },
    { id: 12, category: "Toes", name: "Complex AC Toes", duration: 75, price: "£25" },
    // Lashes - Removed individual 'img' properties
    { id: 13, category: "Lashes", name: "Classics", duration: 90, price: "£25" },
    { id: 14, category: "Lashes", name: "Hybrids", duration: 105, price: "£30" },
    { id: 15, category: "Lashes", name: "Russians", duration: 120, price: "£35" },
  ];

  const categories = useMemo(() => Array.from(new Set(services.map(s => s.category))), [services]);
  const filteredServices = services.filter(s => s.category === activeCategory);

  // --- LOGIC: Calendar & API ---
  const isOperatingDay = (date: Date) => [0, 2, 6].includes(date.getDay()); 
  
  const getSmartStartDate = useCallback(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5); 
    while (!isOperatingDay(d)) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const getReadableDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const parsePrice = (priceStr: string | undefined) => {
    if (!priceStr) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const addToGoogleCalendar = () => {
    if (!selectedSlot || !selectedService) return;
    const start = new Date(selectedSlot);
    const end = new Date(start.getTime() + selectedService.duration * 60000);
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appt+with+StephsBeautyClinic&dates=${format(start)}/${format(end)}&details=Ref:+${bookingRef}%0AService:+${selectedService.name}&location=StephsBeautyClinic`;
    window.open(url, '_blank');
  };

  const downloadIcsFile = () => {
    if (!selectedSlot || !selectedService) return;
    const start = new Date(selectedSlot);
    const end = new Date(start.getTime() + selectedService.duration * 60000);
    const now = new Date();
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const uid = `${now.getTime()}@stephsbeauty.com`;
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//StephsBeautyClinic//Booking//EN\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${format(now)}\nDTSTART:${format(start)}\nDTEND:${format(end)}\nSUMMARY:💅 Appt: StephsBeautyClinic\nDESCRIPTION:Ref: ${bookingRef}\\nService: ${selectedService.name}\\nRemember £10 Deposit is paid!\nLOCATION:StephsBeautyClinic\nSTATUS:CONFIRMED\nSEQUENCE:0\nEND:VEVENT\nEND:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) window.location.assign(url);
    else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'StephsBeautyAppointment.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Load saved booking state on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (new Date(parsed.slot) > new Date()) {
            setBookingRef(parsed.ref);
            setSelectedService(parsed.service);
            setSelectedSlot(parsed.slot);
            setClientDetails(prev => ({ ...prev, name: parsed.clientName || '' }));
            setStep(5);
            return;
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) { console.error(e); }
      }
    } else {
      const timer = setTimeout(() => {
        setStep(1); setSelectedService(null); setSelectedDate(''); setAvailableSlots([]); setSelectedSlot(''); setBookingRef('');
        setClientDetails({ name: '', instagram: '', phone: '', notes: '' }); setTermsAccepted(false); setErrorMsg('');
        // Reset guides on close
        setShowSizeGuide(false);
        setShowLashGuide(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fetch slots when date selected
  useEffect(() => {
      if (isOpen && step === 2 && !selectedDate) {
          const smartDate = getSmartStartDate();
          setSelectedDate(smartDate);
          fetchSlots(smartDate);
      }
  }, [isOpen, step, getSmartStartDate]);

  const fetchSlots = async (dateStr: string) => {
    setIsLoading(true); setErrorMsg(''); setAvailableSlots([]);
    try {
        const d = new Date(dateStr);
        if (!isOperatingDay(d)) { setIsLoading(false); return; }
        const { data, error } = await supabase.functions.invoke('stephs-booking-handler', {
            body: { action: 'get-availability', payload: { date: dateStr, durationMinutes: selectedService?.duration || 60 } }
        });
        if (error) throw error;
        if (data.error) setErrorMsg(data.error);
        else setAvailableSlots(data.slots || []);
    } catch (err) { setErrorMsg("Connection failed. Try again."); } finally { setIsLoading(false); }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; setSelectedDate(date); setSelectedSlot(''); fetchSlots(date);
  };

  // Strict Phone Input Handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9\s+]/g, '');
    setClientDetails({ ...clientDetails, phone: value });
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setIsLoading(true); setErrorMsg('');
    let insta = clientDetails.instagram.trim();
    if (insta.includes('instagram.com/')) insta = insta.split('instagram.com/')[1].replace(/\/$/, '');
    if (insta && !insta.startsWith('@')) insta = '@' + insta;

    try {
      const { data, error } = await supabase.functions.invoke('stephs-booking-handler', {
        body: {
          action: 'create-booking',
          payload: {
            dateStr: selectedSlot,
            serviceName: `${selectedService?.category} - ${selectedService?.name}`,
            servicePrice: selectedService?.price,
            durationMinutes: selectedService?.duration,
            clientName: clientDetails.name,
            clientInstagram: insta, 
            clientPhone: clientDetails.phone,
            clientNotes: clientDetails.notes 
          }
        }
      });
      if (error) throw error; 
      if (data.error) throw new Error(data.error);
      setBookingRef(data.referenceCode);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ref: data.referenceCode, service: selectedService, slot: selectedSlot, clientName: clientDetails.name
      }));
      setStep(4);
    } catch (err: any) { setErrorMsg(err.message || "Booking failed."); } finally { setIsLoading(false); }
  };

  // --- RENDER ---
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
          BOOK APPOINTMENT
        </button>
      </div>
    );
  }

  // --- MAIN MODAL LAYOUT ---
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/80 backdrop-blur-sm transition-all duration-300">
      
      {/* Main Container */}
      <div className="w-full h-[100dvh] md:h-[85vh] md:max-w-md bg-white md:rounded-3xl flex flex-col relative overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#FF69B4] p-3 md:p-4 flex justify-between items-center border-b-4 border-black shrink-0 relative z-30">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">💅</span>
            <h3 className="font-['Pacifico'] text-lg md:text-xl text-white tracking-wide">Steph's Calendar</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="bg-white text-black p-1.5 md:p-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
            <div className="w-full h-1.5 bg-gray-100 relative z-20">
                <div 
                    className="h-full bg-black transition-all duration-500 ease-out" 
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>
        )}

        {/* Scrollable Content Area */}
        <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col relative z-10 pb-4"
        >
          
          {/* STEP 1: SERVICES */}
          {step === 1 && (
            <div className="flex flex-col animate-in slide-in-from-right duration-300">
              
              {/* Sticky Filters */}
              <div className="bg-white border-b-2 border-black p-3 sticky top-0 z-20 shadow-sm">
                 {/* Warning Banner */}
                 <div className="bg-yellow-50 border border-black p-1.5 rounded text-[10px] font-bold text-center flex items-center justify-center gap-2 mb-3">
                    <AlertCircle size={12} className="text-red-500"/> STRICTLY 1 PERSON PER BOOKING
                 </div>

                 {/* Categories */}
                 <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth snap-x">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(cat);
                            // Reset guides when changing category
                            setShowSizeGuide(false);
                            setShowLashGuide(false);
                        }}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all border-2 snap-start ${
                          activeCategory === cat 
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_#FF69B4]' 
                          : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Size Guide Toggle (Only for nails) */}
              {(activeCategory === "Simple Design" || activeCategory === "Complex Design") && (
                <div className="px-3 pt-3">
                    <button 
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full justify-center border border-dashed border-gray-300"
                    >
                        <HelpCircle size={14} />
                        {showSizeGuide ? "Hide Length Guide" : "Not sure about length? Click here"}
                    </button>
                    
                    {showSizeGuide && (
                        <div className="mt-2 rounded-xl overflow-hidden border-2 border-black animate-in fade-in slide-in-from-top-2 duration-300">
                            <img src="/images/naillengths.jpg" alt="Nail Length Guide" className="w-full h-auto" />
                        </div>
                    )}
                </div>
              )}

               {/* NEW: Lash Style Guide Toggle (Only for Lashes) */}
               {activeCategory === "Lashes" && (
                <div className="px-3 pt-3">
                    <button 
                        onClick={() => setShowLashGuide(!showLashGuide)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full justify-center border border-dashed border-gray-300"
                    >
                        <Eye size={14} />
                        {showLashGuide ? "Hide Lash Styles" : "See Lash Style Guide"}
                    </button>
                    
                    {showLashGuide && (
                        <div className="mt-2 rounded-xl overflow-hidden border-2 border-black animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Make sure lashprices.jpg is in public/images */}
                            <img src="/images/lashes.jpg" alt="Lash Style Guide" className="w-full h-auto" />
                        </div>
                    )}
                </div>
              )}

              {/* Service List */}
              <div className="p-3 space-y-3 pb-8">
                {filteredServices.map((service) => (
                    <button 
                      key={service.id} 
                      onClick={() => { setSelectedService(service); setStep(2); }} 
                      className="w-full bg-white p-4 border-2 border-black rounded-xl shadow-sm hover:shadow-[4px_4px_0px_#FF69B4] active:scale-[0.98] transition-all flex justify-between items-center group relative overflow-hidden"
                    >
                      <div className="text-left flex-1 pr-4 z-10">
                        <h3 className="font-bold text-base text-gray-900 group-hover:text-[#FF69B4]">{service.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                           <Clock size={12} />
                           <span>{service.duration} mins</span>
                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <span className="text-black font-bold">{service.price}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-full border border-gray-100 group-hover:bg-[#FF69B4] group-hover:border-black transition-colors z-10">
                         <ChevronRight className="text-gray-400 group-hover:text-white" size={16}/>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

           {/* STEP 2: DATE & TIME */}
           {step === 2 && (
            <div className="p-4 space-y-4 animate-in slide-in-from-right duration-300 flex flex-col h-full">
              <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-400 hover:text-black self-start flex items-center gap-1 mb-2">← BACK TO SERVICES</button>
              
              {/* Selected Service Recap (Simplified) */}
              <div className="bg-[#FFF0F5] border-2 border-[#FF69B4] rounded-xl p-3 flex items-center gap-4">
                 <div className="w-16 h-16 rounded-lg border border-black bg-white flex items-center justify-center shrink-0">
                    <Sparkles className="text-[#FF69B4]" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">YOU SELECTED</p>
                    <h3 className="font-black text-lg leading-tight">{selectedService?.name}</h3>
                    <p className="text-sm font-bold">{selectedService?.price} • {selectedService?.duration} mins</p>
                 </div>
              </div>

              <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-['Montserrat'] font-bold text-xl">Pick a Slot</h2>
                    <span className="bg-[#FF69B4] text-white text-[10px] font-bold px-2 py-0.5 rounded border border-black">5 DAYS NOTICE</span>
                </div>
                
                <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-gray-500">
                        <CalendarDays size={20}/>
                    </div>
                    <input 
                        type="date" 
                        min={new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]} 
                        onChange={handleDateChange} 
                        value={selectedDate} 
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg font-['Montserrat'] font-bold text-base md:text-sm outline-none focus:border-black focus:bg-white transition-all appearance-none" 
                    />
                </div>
                
                {!isOperatingDay(new Date(selectedDate)) && selectedDate && (
                    <div className="mt-3 text-xs font-medium text-red-500 bg-red-50 p-2 rounded flex gap-2">
                        <AlertCircle size={14}/>
                        <span>Closed. Try Tue, Sat, or Sun.</span>
                    </div>
                )}
              </div>

              {selectedDate && (
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-sm text-gray-500 uppercase mb-2 ml-1">Available Times</h3>
                  
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[150px]">
                        <Loader2 className="animate-spin text-[#FF69B4] w-8 h-8" />
                    </div>
                  ) : errorMsg ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg font-bold text-sm text-center border border-red-100">{errorMsg}</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="bg-gray-100 border border-gray-300 p-6 rounded-xl text-center">
                        <p className="text-gray-500 font-bold">No slots available 😔</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 pb-6">
                      {availableSlots.map((slot) => {
                        const dateObj = new Date(slot);
                        return (
                            <button 
                                key={slot} 
                                onClick={() => { setSelectedSlot(slot); setStep(3); }} 
                                className="bg-white py-3 border-2 border-gray-200 rounded-lg hover:border-[#FF69B4] hover:bg-[#FFF0F5] hover:text-[#FF69B4] active:bg-black active:text-white active:border-black font-bold text-sm transition-all"
                            >
                                {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: FORM DETAILS */}
          {step === 3 && (
            <div className="flex flex-col h-full">
                <div className="p-4 space-y-4 animate-in slide-in-from-right duration-300 pb-28">
                    <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1">← CHANGE TIME</button>
                    
                    <div className="bg-[#FFF0F5] p-4 border-l-4 border-[#FF69B4] rounded-r-lg">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{selectedService?.category}</p>
                        <p className="text-xl font-black">{selectedService?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">{getReadableDate(selectedSlot)}</span>
                            <span className="text-sm font-bold">{new Date(selectedSlot).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                    
                    <form id="booking-form" onSubmit={handleConfirmBooking} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold ml-1">FULL NAME</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                <input 
                                  required 
                                  type="text" 
                                  value={clientDetails.name} 
                                  onChange={e => setClientDetails({...clientDetails, name: e.target.value})} 
                                  className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl outline-none focus:border-black focus:shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all text-base md:text-sm" 
                                  placeholder="Jane Doe" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold ml-1">INSTAGRAM</label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                    <input 
                                      required 
                                      type="text" 
                                      value={clientDetails.instagram} 
                                      onChange={e => setClientDetails({...clientDetails, instagram: e.target.value})} 
                                      className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl outline-none focus:border-black transition-all text-base md:text-sm" 
                                      placeholder="@username" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold ml-1">PHONE</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                    <input 
                                      required 
                                      type="tel" 
                                      value={clientDetails.phone} 
                                      onChange={handlePhoneChange} 
                                      className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl outline-none focus:border-black transition-all text-base md:text-sm" 
                                      placeholder="07123..." 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-bold ml-1">NOTES (OPTIONAL)</label>
                            <textarea 
                                value={clientDetails.notes} 
                                onChange={e => setClientDetails({...clientDetails, notes: e.target.value})}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-black transition-all text-base md:text-sm min-h-[80px] resize-none"
                                placeholder="Designs, broken nails, etc..."
                            />
                        </div>

                        <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer active:bg-gray-50 transition-colors select-none mt-2">
                            <input type="checkbox" className="hidden" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}/>
                            <div className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center mt-0.5 shrink-0 transition-colors ${termsAccepted ? 'bg-black' : 'bg-white'}`}>
                                {termsAccepted && <Check size={14} className="text-white"/>}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">POLICY AGREEMENT</p>
                                <p className="text-xs text-gray-600 leading-tight mt-0.5">I understand that the <span className="font-bold text-black">£10 deposit is NON-REFUNDABLE</span> if I cancel within 48 hours.</p>
                            </div>
                        </label>
                    </form>
                </div>

                {/* Fixed Bottom Action Bar for Mobile */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-20 pb-8 md:pb-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    {errorMsg && <p className="text-red-500 font-bold text-xs text-center mb-2">{errorMsg}</p>}
                    <button 
                        form="booking-form"
                        disabled={isLoading || !termsAccepted} 
                        type="submit" 
                        className="w-full py-4 bg-black text-white font-['Montserrat'] font-black text-lg uppercase rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                    </button>
                </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {step === 4 && (
            <div className="flex flex-col h-full relative">
                <div className="p-5 text-center animate-in zoom-in space-y-5 pb-32">
                    <div className="flex flex-col items-center gap-1">
                        <div className="bg-green-100 p-3 rounded-full mb-1">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="font-['Montserrat'] font-bold text-xl text-black">Slot Reserved!</h2>
                        <p className="text-sm text-gray-500">Please send deposit to secure it.</p>
                    </div>
                    
                    <div className="bg-white border-2 border-red-500 p-4 rounded-xl shadow-[4px_4px_0px_#fca5a5] text-left relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 bg-red-500 w-16 h-16 rounded-full opacity-10"></div>
                        <h4 className="font-black text-xs uppercase text-red-500 flex items-center gap-1 mb-2">
                            <AlertTriangle size={14}/> Mandatory Reference
                        </h4>
                        <CopyRow label="Use as Payment Reference" value={bookingRef} />
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left space-y-2">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                            <CreditCard size={16} className="text-gray-400"/>
                            <p className="text-xs font-bold text-gray-500 uppercase">Bank Transfer</p>
                        </div>
                        <CopyRow label="Sort Code" value="77-19-38" />
                        <CopyRow label="Account Number" value="55982968" />
                        <CopyRow label="Account Name" value="MISS STEFANI A DO" />
                    </div>

                    {/* Price Breakdown */}
                    {(() => {
                        const total = parsePrice(selectedService?.price); 
                        const deposit = 10; 
                        return (
                          <div>
                            <div className="bg-black/5 p-3 rounded-lg flex justify-between items-center px-6">
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Deposit Due</p>
                                    <p className="text-xl font-bold text-black">£{deposit}</p>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-300"></div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Due at Appt</p>
                                    <p className="text-xl font-bold text-gray-400">£{total - deposit}</p>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2 font-medium">
                                The remaining <span className="font-bold text-black">£{total - deposit}</span> is to be paid on the day.
                            </p>
                          </div>
                        );
                    })()}
                </div>

                {/* Fixed Bottom Action */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-20 pb-8 md:pb-4">
                    <button 
                        onClick={() => setStep(5)} 
                        className="w-full py-4 bg-[#FF69B4] text-white font-bold text-lg rounded-xl shadow-[0_4px_0px_#db2777] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        I've Sent the Payment!
                    </button>
                </div>
            </div>
          )}

          {/* STEP 5: RECEIPT */}
          {step === 5 && (
            <div className="p-5 text-center animate-in zoom-in space-y-6 pb-8">
               <div className="flex flex-col items-center gap-1 mt-4">
                <Sparkles className="w-10 h-10 text-[#FFD700] animate-pulse" />
                <h2 className="font-['Pacifico'] text-3xl text-black">All Done!</h2>
                <p className="text-gray-500 text-sm">We'll verify your payment shortly.</p>
               </div>
               
               <div className="bg-black text-white p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                   <Camera size={16} className="text-orange-400"/>
                   <span>Screenshot this screen!</span>
               </div>

               <div className="bg-white border-[3px] border-black p-6 rounded-2xl text-left space-y-4 relative shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                   <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                   <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Booking Reference</p>
                    <p className="font-mono text-2xl font-black tracking-widest">{bookingRef}</p>
                   </div>
                   <div className="h-[1px] bg-gray-100 w-full"></div>
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                        <p className="font-bold text-sm">{getReadableDate(selectedSlot)}</p>
                       </div>
                       <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Time</p>
                        <p className="font-bold text-sm">{new Date(selectedSlot).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                       </div>
                   </div>
                   <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Service</p>
                    <p className="font-bold text-sm">{selectedService?.name}</p>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                   <button onClick={addToGoogleCalendar} className="bg-gray-50 p-3 rounded-xl text-xs font-bold border border-gray-200 active:bg-gray-100 transition-all flex flex-col items-center gap-2">
                       <CalendarDays size={20} className="text-blue-600"/> <span>Add to Google</span>
                   </button>
                   <button onClick={downloadIcsFile} className="bg-gray-50 p-3 rounded-xl text-xs font-bold border border-gray-200 active:bg-gray-100 transition-all flex flex-col items-center gap-2">
                       <Download size={20} className="text-gray-700"/> <span>Add to Apple</span>
                   </button>
               </div>

               <button 
                onClick={() => window.open('https://www.instagram.com/stephsbeautyclinic/', '_blank')}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                   <MessageCircle size={20}/> Message on Instagram
               </button>

               <button 
                onClick={() => {
                    if (window.confirm("Start a new booking?")) {
                        localStorage.removeItem(STORAGE_KEY);
                        setStep(1); setSelectedService(null); setSelectedSlot(''); setBookingRef('');
                    }
                }}
                className="text-xs font-bold text-gray-400 hover:text-black underline pt-4"
               >
                 Start New Booking
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}