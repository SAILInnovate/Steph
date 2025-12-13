import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  X, 
  CalendarCheck, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  Copy, 
  Instagram,
  User,
  AlertCircle,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  Check,
  Camera,
  MessageCircle,
  Download,
  Clock,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// CONSTANTS
const STORAGE_KEY = 'stephs_active_booking';

// Helper Component for Copying Text
const CopyRow = ({ label, value }: { label: string, value: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg group hover:border-black transition-colors">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-mono font-bold text-sm sm:text-base select-all">{value}</p>
      </div>
      <button 
        onClick={handleCopy} 
        type="button" 
        className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-black hover:bg-black hover:text-white'}`}
      >
        {copied ? 'COPIED!' : 'COPY'}
      </button>
    </div>
  );
};

export function Booking() {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState("Simple Design");

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

  // ----------------------------------------------------------------
  // STATIC DATA
  // ----------------------------------------------------------------
  const services = [
    { id: 1, category: "Simple Design", name: "Short Length", duration: 90, price: "£25" },
    { id: 2, category: "Simple Design", name: "Medium Length", duration: 90, price: "£30" },
    { id: 3, category: "Simple Design", name: "Long Length", duration: 105, price: "£35" },
    { id: 4, category: "Simple Design", name: "XL Length", duration: 120, price: "£40" },
    { id: 5, category: "Simple Design", name: "XXL Length", duration: 135, price: "£45" },
    { id: 6, category: "Complex Design", name: "Short Length", duration: 105, price: "£30" },
    { id: 7, category: "Complex Design", name: "Medium Length", duration: 120, price: "£35" },
    { id: 8, category: "Complex Design", name: "Long Length", duration: 135, price: "£40" },
    { id: 9, category: "Complex Design", name: "XL Length", duration: 150, price: "£45" },
    { id: 10, category: "Complex Design", name: "XXL Length", duration: 165, price: "£50" },
    { id: 11, category: "Toes", name: "Simple AC Toes", duration: 60, price: "£20" },
    { id: 12, category: "Toes", name: "Complex AC Toes", duration: 75, price: "£25" },
    { id: 13, category: "Toes", name: "Gel Polish Toes", duration: 45, price: "£5" },
  ];

  // Derived Data
  const categories = useMemo(() => Array.from(new Set(services.map(s => s.category))), []);
  const filteredServices = services.filter(s => s.category === activeCategory);

  // ----------------------------------------------------------------
  // CALENDAR & DOWNLOAD LOGIC
  // ----------------------------------------------------------------
  
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
    
    // 1. Prepare Dates
    const start = new Date(selectedSlot);
    const end = new Date(start.getTime() + selectedService.duration * 60000);
    const now = new Date();
    
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    // 2. Generate Unique ID (Required for Apple Calendar to accept it seamlessly)
    const uid = `${now.getTime()}@stephsbeauty.com`;

    // 3. Build ICS Content (Strict format for iOS)
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//StephsBeautyClinic//Booking//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${format(now)}
DTSTART:${format(start)}
DTEND:${format(end)}
SUMMARY:💅 Appt: StephsBeautyClinic
DESCRIPTION:Ref: ${bookingRef}\\nService: ${selectedService.name}\\nRemember £10 Deposit is paid!
LOCATION:StephsBeautyClinic
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    // 4. Create File Blob
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    // 5. iOS Detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
        // iOS Magic: Navigating to the file triggers the native "Add to Calendar" sheet
        window.location.assign(url);
    } else {
        // Android/Desktop: Standard Download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'StephsBeautyAppointment.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  // ----------------------------------------------------------------
  // DATE HELPER LOGIC
  // ----------------------------------------------------------------
  const isOperatingDay = (date: Date) => [0, 2, 6].includes(date.getDay()); // Sun, Tue, Sat
  
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

  // ----------------------------------------------------------------
  // EFFECTS (Lifecycle & Cache)
  // ----------------------------------------------------------------

  // Handle Open/Close & Cache Restoration
  useEffect(() => {
    if (isOpen) {
      // 1. Check for saved booking when opening
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const appointmentDate = new Date(parsed.slot);

          // Only restore if the appointment hasn't passed yet
          if (appointmentDate > new Date()) {
            setBookingRef(parsed.ref);
            setSelectedService(parsed.service);
            setSelectedSlot(parsed.slot);
            setClientDetails(prev => ({ ...prev, name: parsed.clientName || '' }));
            setStep(5); // Jump straight to the receipt
            return; // Stop here, don't reset
          } else {
            // It's an old booking, clear it
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          console.error("Error parsing saved booking", e);
        }
      }
    } else {
      // 2. Reset logic when closing
      const timer = setTimeout(() => {
        setStep(1); 
        setSelectedService(null); 
        setSelectedDate(''); 
        setAvailableSlots([]); 
        setSelectedSlot(''); 
        setBookingRef('');
        setClientDetails({ name: '', instagram: '', phone: '', notes: '' }); 
        setTermsAccepted(false); 
        setErrorMsg('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-fetch slots if we move to step 2 without a date (should default to smart date)
  useEffect(() => {
      if (isOpen && step === 2 && !selectedDate) {
          const smartDate = getSmartStartDate();
          setSelectedDate(smartDate);
          fetchSlots(smartDate);
      }
  }, [isOpen, step, getSmartStartDate]);

  // ----------------------------------------------------------------
  // API ACTIONS
  // ----------------------------------------------------------------

  const fetchSlots = async (dateStr: string) => {
    setIsLoading(true); 
    setErrorMsg(''); 
    setAvailableSlots([]);
    
    try {
        const d = new Date(dateStr);
        if (!isOperatingDay(d)) { 
            setIsLoading(false); 
            return; 
        }
        
        const { data, error } = await supabase.functions.invoke('stephs-booking-handler', {
            body: { 
                action: 'get-availability', 
                payload: { 
                    date: dateStr, 
                    durationMinutes: selectedService?.duration || 60 
                } 
            }
        });

        if (error) throw error;
        if (data.error) setErrorMsg(data.error);
        else setAvailableSlots(data.slots || []);
        
    } catch (err) { 
        setErrorMsg("Connection failed. Try again."); 
    } finally { 
        setIsLoading(false); 
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; 
    setSelectedDate(date); 
    setSelectedSlot(''); 
    fetchSlots(date);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) { 
        alert("You must agree to the deposit policy."); 
        return; 
    }
    
    setIsLoading(true); 
    setErrorMsg('');

    // Sanitize Instagram handle
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

      // Success! Set Ref
      setBookingRef(data.referenceCode);

      // SAVE TO LOCAL STORAGE (CACHE)
      const bookingData = {
        ref: data.referenceCode,
        service: selectedService,
        slot: selectedSlot,
        clientName: clientDetails.name
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));

      // Move to Payment Step
      setStep(4);

    } catch (err: any) { 
        setErrorMsg(err.message || "Booking failed."); 
    } finally { 
        setIsLoading(false); 
    }
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white w-full max-w-md h-[90vh] md:h-[85vh] rounded-3xl border-4 border-black shadow-[8px_8px_0px_#FF69B4] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#FF69B4] p-4 flex justify-between items-center border-b-4 border-black shrink-0 relative z-20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💅</span>
            <h3 className="font-['Pacifico'] text-xl text-white tracking-wide">Steph's Calendar</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="bg-white text-black p-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col relative z-10">
          
          {/* STEP 1: Services (Redesigned) */}
          {step === 1 && (
            <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
              
              {/* Sticky Top Section */}
              <div className="bg-white border-b-4 border-black p-4 pb-2 sticky top-0 z-20 shadow-sm">
                 <h2 className="font-['Montserrat'] font-bold text-2xl mb-3 text-center">Select Service</h2>
                 
                 {/* Warning Banner */}
                 <div className="bg-yellow-50 border-2 border-black p-2 rounded-lg text-[10px] font-bold text-center flex items-center justify-center gap-2 mb-4">
                    <AlertCircle size={14} className="text-red-500"/> STRICTLY 1 PERSON PER BOOKING
                 </div>

                 {/* Categories Tabs */}
                 <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all border-2 ${
                          activeCategory === cat 
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_#FF69B4]' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Service List */}
              <div className="p-4 space-y-3 pb-8">
                {filteredServices.map((service) => (
                    <button 
                      key={service.id} 
                      onClick={() => { setSelectedService(service); setStep(2); }} 
                      className="w-full bg-white p-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_#ccc] hover:shadow-[4px_4px_0px_#FF69B4] hover:bg-[#FFF0F5] hover:-translate-y-0.5 transition-all flex justify-between items-center group"
                    >
                      <div className="text-left flex-1 pr-4">
                        <h3 className="font-bold text-base group-hover:text-[#FF69B4] transition-colors">{service.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
                           <Clock size={12} />
                           <span>{service.duration} mins</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="bg-[#FF69B4] text-white font-black text-sm px-3 py-1 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                            {service.price}
                        </span>
                        <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" size={20}/>
                      </div>
                    </button>
                  ))}
                  
                  {/* Empty state padding to scroll to bottom nicely */}
                  <div className="h-4"></div>
              </div>
            </div>
          )}

           {/* STEP 2: Date */}
           {step === 2 && (
            <div className="p-6 space-y-6 animate-in slide-in-from-right duration-300">
              <button onClick={() => setStep(1)} className="text-xs font-bold underline hover:text-[#FF69B4]">← Back to Services</button>
              <div>
                <h2 className="font-['Montserrat'] font-bold text-2xl mb-1">Pick a Slot</h2>
                <div className="text-sm text-gray-500 bg-white border-2 border-black p-3 rounded-lg mb-4 shadow-[2px_2px_0px_#ccc] space-y-2">
                    <div className="flex items-start gap-3">
                        <CalendarDays size={20} className="text-[#FF69B4] mt-0.5 shrink-0"/>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-bold text-black text-xs uppercase">Availability</p>
                                <span className="bg-[#FF69B4] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">5 DAYS NOTICE</span>
                            </div>
                            <p className="text-xs font-medium leading-tight mb-2">We are open <span className="font-bold text-black">Tue, Sat, Sun</span>.</p>
                            <p className="text-xs font-bold text-green-600 bg-green-50 p-1 rounded inline-block border border-green-200">Next Opening: {getReadableDate(getSmartStartDate())}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/50 p-1 rounded-xl">
                    <label className="block font-bold text-xs mb-1 ml-1 text-gray-500 uppercase">Select Date</label>
                    <input 
                        type="date" 
                        min={new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]} 
                        onChange={handleDateChange} 
                        value={selectedDate} 
                        className="w-full p-3 border-4 border-black rounded-xl font-['Montserrat'] font-bold text-base outline-none focus:border-[#FF69B4] focus:shadow-[4px_4px_0px_#FF69B4] transition-all" 
                    />
                </div>
              </div>
              {selectedDate && (
                <div className="animate-in fade-in duration-500">
                  <h3 className="font-bold mb-3">Available Times</h3>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-[#FF69B4] w-8 h-8" />
                    </div>
                  ) : errorMsg ? (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg font-bold text-sm text-center border-2 border-red-100">{errorMsg}</div>
                  ) : !isOperatingDay(new Date(selectedDate)) ? (
                    <div className="bg-gray-100 border-2 border-gray-300 p-4 rounded-xl text-center opacity-80">
                        <p className="text-gray-500 font-bold mb-1">Clinic Closed 😴</p>
                        <p className="text-xs text-gray-500">Please select Tue, Sat, or Sun.</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="bg-red-50 border-2 border-red-100 p-4 rounded-xl text-center">
                        <p className="text-red-500 font-bold mb-1">Fully Booked</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map((slot) => {
                        const dateObj = new Date(slot);
                        return (
                            <button 
                                key={slot} 
                                onClick={() => { setSelectedSlot(slot); setStep(3); }} 
                                className="bg-white py-3 border-2 border-black rounded-lg hover:bg-[#FF69B4] hover:text-white font-bold shadow-[2px_2px_0px_#333] active:translate-y-1 active:shadow-none"
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

          {/* STEP 3: Details & Notes */}
          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-5 animate-in slide-in-from-right duration-300">
              <button type="button" onClick={() => setStep(2)} className="text-xs font-bold underline hover:text-[#FF69B4]">← Back to Times</button>
              <h2 className="font-['Montserrat'] font-bold text-2xl">Your Details</h2>
              <div className="bg-[#FFF0F5] p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_#FF69B4]">
                <div className="space-y-1 font-medium">
                    <p className="text-xs font-bold text-gray-500 uppercase">{selectedService?.category}</p>
                    <p className="text-lg font-bold leading-none">{selectedService?.name}</p>
                    <p className="text-2xl font-['Pacifico'] mt-2">{new Date(selectedSlot).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                    <User className="absolute left-4 top-4 text-gray-400" size={20}/>
                    <input required type="text" value={clientDetails.name} onChange={e => setClientDetails({...clientDetails, name: e.target.value})} className="w-full p-3 pl-12 border-4 border-black rounded-xl outline-none focus:border-[#FF69B4] text-base" placeholder="Full Name" />
                </div>
                <div className="relative">
                    <Instagram className="absolute left-4 top-4 text-gray-400" size={20}/>
                    <input required type="text" value={clientDetails.instagram} onChange={e => setClientDetails({...clientDetails, instagram: e.target.value})} className="w-full p-3 pl-12 border-4 border-black rounded-xl outline-none focus:border-[#FF69B4] text-base" placeholder="Instagram (@username)" />
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400 font-bold text-sm">📞</span>
                    <input required type="tel" value={clientDetails.phone} onChange={e => setClientDetails({...clientDetails, phone: e.target.value})} className="w-full p-3 pl-12 border-4 border-black rounded-xl outline-none focus:border-[#FF69B4] text-base" placeholder="Phone Number" />
                </div>
                
                <div className="relative">
                    <textarea 
                        value={clientDetails.notes} 
                        onChange={e => setClientDetails({...clientDetails, notes: e.target.value})}
                        className="w-full p-3 border-4 border-black rounded-xl outline-none focus:border-[#FF69B4] text-base min-h-[100px] resize-none"
                        placeholder="Any notes? (e.g. broken nail, specific design idea...)"
                    />
                </div>
              </div>

              {/* FIXED CHECKBOX: Using bg-white OR bg-black, never both */}
              <label className="flex items-start gap-3 p-3 bg-red-50 border-2 border-red-100 rounded-xl cursor-pointer hover:border-red-300 transition-colors select-none">
                  <input type="checkbox" className="hidden" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}/>
                  <div className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center mt-0.5 transition-colors ${termsAccepted ? 'bg-black' : 'bg-white'}`}>
                    {termsAccepted && <Check size={14} className="text-white"/>}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-red-600 uppercase">Required</p>
                    <p className="text-xs text-gray-700 font-medium leading-tight">I understand that the <span className="font-bold">£10 deposit is NON-REFUNDABLE</span>.</p>
                  </div>
              </label>

              {errorMsg && <p className="text-red-500 font-bold text-sm text-center">{errorMsg}</p>}
              <button disabled={isLoading || !termsAccepted} type="submit" className="w-full py-4 bg-black text-white font-['Montserrat'] font-black text-lg uppercase rounded-xl hover:bg-[#FF69B4] shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
              </button>
            </form>
          )}

          {/* STEP 4: Payment Instructions */}
          {step === 4 && (
            <div className="p-6 text-center py-4 animate-in zoom-in space-y-4 h-full flex flex-col justify-start">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h2 className="font-['Pacifico'] text-2xl text-[#FF69B4]">Pending!</h2>
              </div>
              
              <div className="bg-red-50 border-4 border-red-500 p-4 rounded-xl shadow-[4px_4px_0px_#ef4444] text-left">
                  <div className="flex items-start gap-3">
                      <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 animate-pulse" />
                      <div className="w-full">
                        <h4 className="font-black text-sm uppercase text-red-600">CRITICAL: USE THIS REFERENCE</h4>
                        <p className="text-xs font-bold text-gray-800 leading-tight mb-2">Payments sent without this code cannot be tracked.</p>
                        <CopyRow label="Mandatory Reference Code" value={bookingRef} />
                      </div>
                  </div>
              </div>
              
              <div className="bg-[#FFF0F5] border-2 border-black p-4 rounded-xl relative text-left">
                <div className="flex items-center gap-2 mb-3 border-b border-black/10 pb-2">
                    <CreditCard size={16} className="text-[#FF69B4]"/>
                    <p className="text-xs font-bold text-gray-500 uppercase">Bank Details</p>
                </div>
                <div className="space-y-2">
                   <CopyRow label="Account Name" value="MISS STEFANI A DO" />
                   <CopyRow label="Sort Code" value="77-19-38" />
                   <CopyRow label="Account Number" value="55982968" />
                </div>
              </div>

               {(() => {
                    const total = parsePrice(selectedService?.price); 
                    const deposit = 10; 
                    const remaining = total - deposit;
                    return (
                        <div className="flex flex-col gap-1 bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500"><span>Total Service:</span> <span>£{total}</span></div>
                            <div className="flex justify-between text-xs text-gray-500"><span>Deposit Due:</span> <span>£{deposit}</span></div>
                            <div className="flex justify-between font-bold text-black border-t border-gray-300 pt-1 mt-1"><span>Pay on Day:</span> <span>£{remaining}</span></div>
                        </div>
                    );
                })()}

              <button 
                onClick={() => setStep(5)} 
                className="w-full py-3 bg-[#FF69B4] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] active:translate-y-1"
              >
                I've Sent the Payment!
              </button>
            </div>
          )}

          {/* STEP 5: FINAL RECEIPT */}
          {step === 5 && (
            <div className="p-6 text-center py-4 animate-in zoom-in space-y-5 h-full flex flex-col justify-start">
               <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 text-[#FFD700]" />
                <h2 className="font-['Pacifico'] text-2xl text-black">All Done!</h2>
               </div>
               
               <div className="bg-black text-white p-4 rounded-xl shadow-[4px_4px_0px_#ccc] text-left">
                   <div className="flex items-center gap-2 mb-2 text-[#FFD700] font-bold uppercase text-xs"><Camera size={16}/> Recommendation</div>
                   <p className="text-sm font-medium leading-snug">Please <strong>take a screenshot</strong> of this screen for your records.</p>
               </div>

               <div className="bg-white border-4 border-black p-5 rounded-xl text-left space-y-3 relative">
                   <div className="absolute top-3 right-3"><div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div></div>
                   <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Reference</p>
                    <p className="font-mono text-xl font-bold">{bookingRef}</p>
                   </div>
                   <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Service</p>
                    <p className="font-bold">{selectedService?.name}</p>
                   </div>
                   <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Time</p>
                    <p className="font-bold">{new Date(selectedSlot).toLocaleString('en-GB', {weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</p>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={addToGoogleCalendar} 
                    className="bg-gray-100 p-3 rounded-lg text-xs font-bold border border-gray-300 hover:bg-white hover:border-black transition-all flex flex-col items-center gap-1"
                   >
                       <CalendarDays size={20} className="text-blue-600"/> Add to Google
                   </button>
                   <button 
                    onClick={downloadIcsFile} 
                    className="bg-gray-100 p-3 rounded-lg text-xs font-bold border border-gray-300 hover:bg-white hover:border-black transition-all flex flex-col items-center gap-1"
                   >
                       <Download size={20} className="text-black"/> Add to Apple/iOS
                   </button>
               </div>

               <button 
                onClick={() => window.open('https://www.instagram.com/stephsbeautyclinic/', '_blank')}
                className="w-full py-4 bg-[#FF69B4] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 flex items-center justify-center gap-2"
               >
                   <MessageCircle size={20}/> Message Steph on Insta
               </button>

               {/* Button to Clear Cache and Book Again */}
               <div className="pt-4 border-t border-gray-200 mt-4">
                    <button 
                        onClick={() => {
                            if (window.confirm("Start a new booking? This will clear the current receipt view.")) {
                                localStorage.removeItem(STORAGE_KEY);
                                setStep(1);
                                setSelectedService(null);
                                setSelectedSlot('');
                                setBookingRef('');
                            }
                        }}
                        className="text-xs font-bold text-gray-400 hover:text-black underline w-full text-center"
                    >
                        Book a New Appointment / Clear Receipt
                    </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}