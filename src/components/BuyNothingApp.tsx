import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  Gift, 
  Download, 
  Printer, 
  Sparkles, 
  Check, 
  HelpCircle, 
  X, 
  Share2, 
  Heart, 
  Smile, 
  RotateCcw,
  Sliders,
  DollarSign
} from 'lucide-react';

interface CertificateData {
  name: string;
  price: number;
  currency: string;
  serialNumber: string;
  issueDate: string;
  avatarMood: 'surprised' | 'happy' | 'chill' | 'blank';
  giftMessage?: string;
  isGift: boolean;
  recipientName?: string;
}

export const BuyNothingApp: React.FC<{ onSwitchToCampusMate?: () => void }> = ({ onSwitchToCampusMate }) => {
  // Certificate State
  const [certData, setCertData] = useState<CertificateData>({
    name: 'Your Name Here',
    price: 10,
    currency: '$',
    serialNumber: 'NP-004821',
    issueDate: '01 SEP 2026',
    avatarMood: 'surprised',
    isGift: false
  });

  // Modal states
  const [isGetCertOpen, setIsGetCertOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [showStampAnimation, setShowStampAnimation] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form states
  const [inputName, setInputName] = useState('Janvi Porwal');
  const [selectedPrice, setSelectedPrice] = useState(10);
  const [customPrice, setCustomPrice] = useState('');
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftNote, setGiftNote] = useState('Happy Birthday! I spent real money to get you absolutely nothing.');

  const certificateRef = useRef<HTMLDivElement>(null);

  const priceOptions = [0, 1, 5, 10, 25, 50];

  const handleOpenCertModal = () => {
    setIsGetCertOpen(true);
  };

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = customPrice ? parseFloat(customPrice) || 0 : selectedPrice;
    const serial = `NP-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

    setCertData(prev => ({
      ...prev,
      name: inputName.trim() || 'A Generous Nobody',
      price: finalPrice,
      serialNumber: serial,
      issueDate: today,
      isGift: false
    }));

    setIsGetCertOpen(false);
    triggerCelebration();
  };

  const handleGenerateGift = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = customPrice ? parseFloat(customPrice) || 0 : selectedPrice;
    const serial = `NP-GIFT-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

    setCertData(prev => ({
      ...prev,
      name: giftRecipient.trim() || 'Lucky Recipient',
      recipientName: giftRecipient.trim() || 'Lucky Recipient',
      price: finalPrice,
      serialNumber: serial,
      issueDate: today,
      giftMessage: giftNote,
      isGift: true
    }));

    setIsGiftModalOpen(false);
    triggerCelebration();
  };

  const triggerCelebration = () => {
    setShowStampAnimation(true);
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FEF08A', '#F472B6', '#60A5FA', '#18181B']
      });
    } catch {
      // fallback
    }
    setTimeout(() => setShowStampAnimation(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Render Doodle Avatar
  const renderAvatar = (mood: CertificateData['avatarMood']) => {
    switch (mood) {
      case 'happy':
        return (
          <svg viewBox="0 0 80 80" className="w-full h-full text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="40" cy="40" r="30" />
            <circle cx="30" cy="35" r="3" fill="currentColor" />
            <circle cx="50" cy="35" r="3" fill="currentColor" />
            <path d="M28 46 Q40 58 52 46" />
          </svg>
        );
      case 'chill':
        return (
          <svg viewBox="0 0 80 80" className="w-full h-full text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="40" cy="40" r="30" />
            <path d="M24 35 L36 35 M44 35 L56 35" strokeWidth="4" />
            <path d="M32 50 Q40 52 48 50" />
          </svg>
        );
      case 'blank':
        return (
          <svg viewBox="0 0 80 80" className="w-full h-full text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="40" cy="40" r="30" />
            <circle cx="30" cy="35" r="2.5" fill="currentColor" />
            <circle cx="50" cy="35" r="2.5" fill="currentColor" />
            <line x1="32" y1="48" x2="48" y2="48" />
          </svg>
        );
      case 'surprised':
      default:
        // Surprised cartoon face matching the image exactly!
        return (
          <svg viewBox="0 0 80 80" className="w-full h-full text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="40" cy="40" r="30" />
            {/* Round wide eyes */}
            <circle cx="31" cy="34" r="5" fill="#FFF" strokeWidth="2" />
            <circle cx="31" cy="34" r="2" fill="currentColor" />
            <circle cx="49" cy="34" r="5" fill="#FFF" strokeWidth="2" />
            <circle cx="49" cy="34" r="2" fill="currentColor" />
            {/* Eyebrows */}
            <path d="M26 26 Q31 24 36 27" />
            <path d="M44 27 Q49 24 54 26" />
            {/* O shaped surprised mouth */}
            <ellipse cx="40" cy="50" rx="4.5" ry="6" fill="#FFF" strokeWidth="2" />
          </svg>
        );
    }
  };

  // Convert name to MRZ format
  const sanitizedMRZName = certData.name.toUpperCase().replace(/[^A-Z]/g, '<').slice(0, 24);

  return (
    <div className="notebook-paper min-h-screen text-zinc-900 font-sans selection:bg-amber-200 relative overflow-x-hidden">
      {/* Top Experience Switcher Bar (So user can switch between Buy Nothing and CampusMate Notebook) */}
      <div className="bg-zinc-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 z-40 relative">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-typewriter font-bold tracking-tight text-amber-300">
            NOTHINGONPURPOSE.COM
          </span>
          <span className="text-zinc-400 hidden sm:inline">• The High-Fidelity Hand-Drawn Notebook Web App</span>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToCampusMate && (
            <button
              onClick={onSwitchToCampusMate}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>🎓 Switch to CampusMate Portal</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Notebook Container (accounting for left red margin rule) */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:pl-28 md:pr-12 py-10 md:py-16">
        
        {/* Top Header Label from image: "PRODUCT #000 · IN STOCK FOREVER" */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-typewriter text-rose-700 tracking-wider font-semibold mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-zinc-900 rounded-full inline-block"></span>
            <span className="text-zinc-800 font-bold font-sans">Digital New Era</span>
          </div>
          <div>
            PRODUCT #000 · IN STOCK FOREVER
          </div>
        </div>

        {/* HERO GRID: Left Copy + Right Taped Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6 pt-2">
            {/* Big Headline matching image typography */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-handwriting text-zinc-900 leading-[1.05] tracking-tight">
                Buy <span className="highlighter-yellow px-4 py-0.5 rounded-full inline-block transform -rotate-1 shadow-2xs">nothing.</span>
              </h1>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold font-handwriting text-zinc-900 leading-[1.05] tracking-tight">
                Keep the
              </h2>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold font-handwriting text-zinc-900 leading-[1.05] tracking-tight">
                <span className="squiggly-underline">receipt.</span>
              </h2>
            </div>

            {/* Body Copy */}
            <p className="text-base sm:text-lg font-marker text-zinc-800 max-w-lg leading-relaxed pt-2">
              No product. No download. No hidden benefit. You choose what nothing is worth — and you walk away with a numbered certificate that proves you did it on purpose.
            </p>

            {/* Buttons from image */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {/* Black button: Get my certificate → */}
              <button
                onClick={handleOpenCertModal}
                className="sketchy-border bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 text-base sm:text-lg font-marker font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Get my certificate</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Pink button: Buy it as a gift 🎁 */}
              <button
                onClick={() => setIsGiftModalOpen(true)}
                className="sketchy-border-double bg-pink-200 hover:bg-pink-300 text-zinc-900 px-6 py-3 text-base sm:text-lg font-marker font-bold shadow-[3px_3px_0px_#18181B] hover:shadow-[1px_1px_0px_#18181B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Buy it as a gift 🎁</span>
              </button>
            </div>

            {/* Sub-copy from image */}
            <p className="text-xs sm:text-sm font-marker text-zinc-600 pt-2 leading-normal">
              Stuck for a birthday present? Give them nothing and a message on the wall.{' '}
              <a href="#wall" className="underline font-bold text-zinc-900 hover:text-amber-700">
                See who already has one
              </a>
            </p>

            {/* Red Monospace Specs from image */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-typewriter text-rose-800 font-bold tracking-tight">
              <span>✓ 0 GRAMS</span>
              <span>✓ SHIPS NEVER</span>
              <span>✓ FITS EVERYONE</span>
              <span>✓ NO UPDATES</span>
            </div>

            {/* Scroll Indicator Arrow from image */}
            <div className="pt-8 flex items-center gap-3">
              {/* Hand-drawn ink arrow */}
              <svg viewBox="0 0 60 40" className="w-12 h-8 text-zinc-900 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 10 Q25 35 48 20" />
                <path d="M40 16 L49 20 L44 28" />
              </svg>
              <a href="#details" className="text-base font-handwriting text-zinc-700 font-bold hover:text-zinc-900 hover:underline">
                Scroll. It gets worse.
              </a>
            </div>
          </div>

          {/* Right Column: The Certificate Object with Washi Tape and Stickers */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-full max-w-lg group">
              
              {/* Semi-translucent yellow masking / washi tape on top of the card */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-36 h-8 washi-tape z-30 rotate-[-1.5deg] pointer-events-none opacity-90 shadow-2xs"></div>

              {/* Yellow Circular Sticker on top-right: "0g" */}
              <div 
                className="absolute -top-6 -right-3 w-16 h-16 rounded-full bg-yellow-300 border-[3px] border-zinc-900 z-30 shadow-md flex items-center justify-center rotate-[14deg] cursor-pointer hover:scale-105 transition-transform"
                title="Weight: Exactly zero grams"
              >
                <span className="font-typewriter font-black text-xl text-zinc-900">0g</span>
              </div>

              {/* Blue Oval Sticker on bottom-left: "ships never" */}
              <div 
                className="absolute -bottom-5 -left-4 px-4 py-1.5 rounded-full bg-sky-200 border-2 border-zinc-900 z-30 shadow-md rotate-[-8deg] cursor-pointer hover:scale-105 transition-transform"
                title="Shipping Status: Ships never"
              >
                <span className="font-marker font-bold text-sm text-sky-950">ships never</span>
              </div>

              {/* The Certificate Card */}
              <div
                ref={certificateRef}
                className="bg-[#FAF7EE] border-[3px] border-amber-900/60 rounded-lg p-6 sm:p-7 shadow-xl transform rotate-[1.2deg] hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
                style={{
                  boxShadow: '8px 10px 0px rgba(24, 24, 27, 0.15)'
                }}
              >
                {/* Dashed Golden Inner Border */}
                <div className="border border-dashed border-amber-800/40 p-4 sm:p-5 rounded relative">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-[11px] font-typewriter text-amber-950 font-bold border-b border-amber-900/20 pb-2 mb-4">
                    <span>NOTHINGONPURPOSE.COM</span>
                    <span className="bg-amber-950/10 px-2 py-0.5 rounded text-amber-900 font-mono">
                      {certData.serialNumber}
                    </span>
                  </div>

                  {/* Middle Content */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    
                    {/* Left: Doodle Avatar Box */}
                    <div 
                      onClick={() => {
                        const moods: CertificateData['avatarMood'][] = ['surprised', 'happy', 'chill', 'blank'];
                        const next = moods[(moods.indexOf(certData.avatarMood) + 1) % moods.length];
                        setCertData(prev => ({ ...prev, avatarMood: next }));
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-zinc-900 rounded p-1 shrink-0 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-colors shadow-2xs"
                      title="Click to change expression!"
                    >
                      {renderAvatar(certData.avatarMood)}
                    </div>

                    {/* Right: Certificate Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-typewriter text-amber-900 tracking-wider font-semibold uppercase block">
                        CERTIFICATE OF NOTHING
                      </span>

                      {/* Name in elegant cursive script */}
                      <h3 
                        onClick={handleOpenCertModal}
                        className="text-2xl sm:text-3xl font-bold font-handwriting text-zinc-900 truncate hover:text-amber-700 cursor-pointer transition-colors mt-0.5"
                        title="Click to edit name"
                      >
                        {certData.name}
                      </h3>

                      <p className="text-xs font-marker text-zinc-600 italic">
                        {certData.isGift ? 'Gifted Certified Nothing' : 'Certified Nothing Enthusiast'}
                      </p>

                      {/* Meta stats */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-[10px] sm:text-[11px] font-typewriter text-amber-950 font-bold">
                        <span>PAID {certData.price} {certData.currency}</span>
                        <span>ISSUED {certData.issueDate}</span>
                        <span>EXPIRES NEVER</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Text Disclaimer */}
                  <p className="text-[11px] font-marker text-zinc-700 leading-snug mt-4 pt-3 border-t border-amber-900/10">
                    {certData.giftMessage ? (
                      <span className="italic font-bold text-amber-900">"{certData.giftMessage}"</span>
                    ) : (
                      "Received, as promised, absolutely nothing. No product, no download, no hidden benefit."
                    )}
                  </p>

                  {/* Circular Rubber Stamp: "RECEIVED NOTHING" on bottom right */}
                  <div className="absolute right-3 bottom-6 transform -rotate-12 pointer-events-none opacity-80">
                    <div className="w-24 h-24 rounded-full border-2 border-amber-800 flex flex-col items-center justify-center p-1 text-center bg-amber-800/5 shadow-2xs">
                      <div className="w-20 h-20 rounded-full border border-dashed border-amber-800 flex flex-col items-center justify-center">
                        <span className="text-[8px] font-typewriter font-bold tracking-widest text-amber-900">OFFICIAL SEAL</span>
                        <span className="text-[10px] font-typewriter font-black tracking-wider text-amber-900 leading-tight">RECEIVED<br/>NOTHING</span>
                        <span className="text-[7px] font-typewriter text-amber-800">★ 0 GRAMS ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Monospace MRZ Barcode Text at bottom */}
                  <div className="mt-4 pt-2 font-mono text-[9px] sm:text-[10px] text-zinc-500 tracking-wider overflow-hidden select-all whitespace-pre leading-tight">
                    <div>{`VH000006<${sanitizedMRZName}<<<<<<<<<<<<<<<<`}</div>
                    <div>{`01000USD<20260901<RECEIVED<NOTHING<<<<`}</div>
                  </div>
                </div>
              </div>

              {/* Caption below certificate */}
              <p className="text-center text-xs font-marker text-zinc-600 mt-4">
                Yours comes with your name on it. Shown at actual size, which is none.
              </p>

              {/* Quick Actions Bar for Certificate */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={handleOpenCertModal}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-zinc-900 text-xs font-marker font-bold rounded-lg border border-amber-300 transition-colors flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize This</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-marker font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: "SCROLL. IT GETS WORSE." EXPANDED DETAILS */}
        <div id="details" className="mt-24 pt-12 border-t-2 border-dashed border-zinc-300 space-y-16">
          
          {/* Comparison Table: The Value of Nothing */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                SCIENTIFIC MARKET COMPARISON
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                Why pay for things when you can pay for <span className="highlighter-yellow px-2 py-0.5 rounded">nothing?</span>
              </h3>
              <p className="text-sm font-marker text-zinc-600 max-w-lg mx-auto">
                A side-by-side analysis verified by certified non-accountants.
              </p>
            </div>

            <div className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-2xl shadow-[6px_6px_0px_#18181B] overflow-x-auto p-4 sm:p-6">
              <table className="w-full text-left text-xs sm:text-sm font-marker">
                <thead>
                  <tr className="border-b-2 border-zinc-900 text-zinc-900 text-base">
                    <th className="pb-3 pl-2">Feature / Metric</th>
                    <th className="pb-3 text-center bg-amber-200/80 rounded-t-xl px-4 font-bold">
                      ⭐ NOTHING (This)
                    </th>
                    <th className="pb-3 text-center text-zinc-500">iPhone 16 Pro</th>
                    <th className="pb-3 text-center text-zinc-500">Cup of Coffee</th>
                    <th className="pb-3 text-center text-zinc-500 pr-2">Gym Membership</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-300">
                  <tr>
                    <td className="py-3 pl-2 font-bold text-zinc-900">Weight & Bulk</td>
                    <td className="py-3 text-center bg-amber-100/50 font-bold text-emerald-800">0 grams (weightless)</td>
                    <td className="py-3 text-center text-zinc-600">199 grams</td>
                    <td className="py-3 text-center text-zinc-600">350 grams</td>
                    <td className="py-3 text-center text-zinc-600">Guilt only</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-2 font-bold text-zinc-900">Battery Life</td>
                    <td className="py-3 text-center bg-amber-100/50 font-bold text-emerald-800">Infinite (Never dies)</td>
                    <td className="py-3 text-center text-zinc-600">16 hours</td>
                    <td className="py-3 text-center text-zinc-600">45 minutes</td>
                    <td className="py-3 text-center text-zinc-600">N/A</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-2 font-bold text-zinc-900">Shelf Life</td>
                    <td className="py-3 text-center bg-amber-100/50 font-bold text-emerald-800">Forever (Never rots)</td>
                    <td className="py-3 text-center text-zinc-600">Obsolete in 12 mos</td>
                    <td className="py-3 text-center text-zinc-600">Cold in 20 min</td>
                    <td className="py-3 text-center text-zinc-600">Cancelled in Feb</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-2 font-bold text-zinc-900">Maintenance Costs</td>
                    <td className="py-3 text-center bg-amber-100/50 font-bold text-emerald-800">$0.00</td>
                    <td className="py-3 text-center text-zinc-600">$199 AppleCare</td>
                    <td className="py-3 text-center text-zinc-600">Tip jar pressure</td>
                    <td className="py-3 text-center text-zinc-600">$65/month auto-billed</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-2 font-bold text-zinc-900">Buyer's Remorse</td>
                    <td className="py-3 text-center bg-amber-100/50 font-bold text-emerald-800">0% (You knew it)</td>
                    <td className="py-3 text-center text-zinc-600">High</td>
                    <td className="py-3 text-center text-zinc-600">Jitters</td>
                    <td className="py-3 text-center text-zinc-600">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: THE WALL OF RECEIPTS */}
          <div id="wall" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                  LIVE COMMUNITY WALL
                </span>
                <h3 className="text-3xl font-bold font-handwriting text-zinc-900">
                  Certified Nothing Owners
                </h3>
                <p className="text-xs sm:text-sm font-marker text-zinc-600">
                  Real simulated receipts from proud owners of absolute void.
                </p>
              </div>

              <button
                onClick={handleOpenCertModal}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-marker font-bold rounded-xl text-sm self-start shadow-[2px_2px_0px_#000]"
              >
                + Add Yours to the Wall
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Janvi Porwal', roll: 'NMIMS A012', paid: '$10', note: 'Finally, an academic purchase that fits my mental bandwidth.', serial: 'NP-004821', time: '12 mins ago' },
                { name: 'Aarav Sharma', roll: 'Overloaded Planner', paid: '$5', note: 'Cleaner than my college LMS dashboard. 10/10.', serial: 'NP-009182', time: '1 hour ago' },
                { name: 'Joshua Rebello', roll: 'S020', paid: '$20', note: 'Follows all 8 Shneiderman rules: zero errors possible because nothing exists.', serial: 'NP-003319', time: '3 hours ago' },
                { name: 'Janvi Jain', roll: 'A011', paid: '$15', note: 'I bought this for my group project teammate who contributed nothing.', serial: 'NP-007742', time: '5 hours ago' },
                { name: 'Sneha Mehta', roll: 'Club Coordinator', paid: '$2', note: 'Lightweight. No event permissions required from the Dean.', serial: 'NP-001244', time: 'Yesterday' },
                { name: 'Karan Verma', roll: 'Senior', paid: '$50', note: 'Put this on my resume under Achievements. Awaiting offers.', serial: 'NP-008911', time: '2 days ago' }
              ].map((entry, idx) => (
                <div 
                  key={idx}
                  className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-xl p-4 shadow-[3px_3px_0px_rgba(24,24,27,0.15)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-typewriter text-zinc-500 mb-2">
                      <span className="font-bold text-amber-900">{entry.serial}</span>
                      <span>{entry.time}</span>
                    </div>
                    <p className="font-handwriting text-xl font-bold text-zinc-900 leading-tight">
                      {entry.name}
                    </p>
                    <span className="text-[11px] font-typewriter text-zinc-500 block mb-2">
                      {entry.roll} • Paid {entry.paid}
                    </span>
                    <p className="text-xs font-marker text-zinc-700 italic border-l-2 border-amber-400 pl-2">
                      "{entry.note}"
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-200 text-right">
                    <span className="text-[9px] font-typewriter font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ VERIFIED ZERO
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: FREQUENTLY AVOIDED QUESTIONS */}
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                OFFICIAL CLARIFICATIONS
              </span>
              <h3 className="text-3xl font-bold font-handwriting text-zinc-900">
                Frequently Avoided Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                { q: 'Will anything physically arrive in the mail?', a: 'No. That would completely violate our warranty. You will receive 0 grams of physical matter.' },
                { q: 'Can I get a refund for nothing?', a: 'Yes. Upon request, we will promptly refund you absolutely nothing in return.' },
                { q: 'Is this tax deductible?', a: 'Consult your accountant, then listen closely as they gently laugh and hang up the phone.' },
                { q: 'What is nothing made of?', a: '100% recycled empty promises, quantum vacuum fluctuations, and pure intention.' }
              ].map((faq, idx) => (
                <div key={idx} className="bg-[#FAF7EE] border-2 border-zinc-900 p-4 rounded-xl shadow-[3px_3px_0px_#18181B]">
                  <h4 className="font-marker font-bold text-base text-zinc-900 mb-1">
                    Q: {faq.q}
                  </h4>
                  <p className="font-marker text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-zinc-300 text-center font-typewriter text-xs text-zinc-500 space-y-2">
          <p>© 2026 Nothing On Purpose • All rights reserved to nothing.</p>
          <p className="text-[10px] text-zinc-400">
            Hand-Drawn Indie Notebook Aesthetic • Human-Computer Interaction Project Edition
          </p>
        </div>
      </div>

      {/* MODAL 1: GET MY CERTIFICATE */}
      {isGetCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF7EE] border-[3px] border-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#000] relative">
            <button 
              onClick={() => setIsGetCertOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-typewriter font-bold uppercase text-amber-900 tracking-wider">
                CERTIFICATE CUSTOMIZER
              </span>
              <h3 className="text-2xl font-bold font-handwriting text-zinc-900 mt-0.5">
                Claim Your Certificate of Nothing
              </h3>
            </div>

            <form onSubmit={handleGenerateCertificate} className="space-y-4 font-marker">
              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  Your Full Name (As it will appear)
                </label>
                <input
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="e.g. Janvi Porwal"
                  className="w-full px-3 py-2 bg-white border-2 border-zinc-900 rounded-xl font-handwriting text-xl text-zinc-900 focus:outline-none focus:bg-amber-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  What is Nothing worth to you?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priceOptions.map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => {
                        setSelectedPrice(price);
                        setCustomPrice('');
                      }}
                      className={`py-2 px-1 text-center font-typewriter font-bold rounded-xl border-2 transition-all ${
                        selectedPrice === price && !customPrice
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-[2px_2px_0px_#F59E0B]'
                          : 'bg-white text-zinc-800 border-zinc-400 hover:border-zinc-900'
                      }`}
                    >
                      {price === 0 ? '$0 (Free)' : `$${price}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  Or enter custom amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 42"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border-2 border-zinc-900 rounded-xl font-typewriter text-sm text-zinc-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-marker font-bold text-lg rounded-xl shadow-[4px_4px_0px_#F59E0B] hover:shadow-[2px_2px_0px_#F59E0B] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Issue My Certificate Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUY AS A GIFT */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF7EE] border-[3px] border-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#000] relative">
            <button 
              onClick={() => setIsGiftModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-typewriter font-bold uppercase text-pink-700 tracking-wider">
                GIFT NOTHING TO SOMEONE
              </span>
              <h3 className="text-2xl font-bold font-handwriting text-zinc-900 mt-0.5">
                The Ultimate Thoughtful Gift 🎁
              </h3>
              <p className="text-xs font-marker text-zinc-600 mt-1">
                For the person who literally has everything (or deserves nothing).
              </p>
            </div>

            <form onSubmit={handleGenerateGift} className="space-y-4 font-marker">
              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  Recipient's Name
                </label>
                <input
                  type="text"
                  required
                  value={giftRecipient}
                  onChange={(e) => setGiftRecipient(e.target.value)}
                  placeholder="e.g. My Best Friend / Group Partner"
                  className="w-full px-3 py-2 bg-white border-2 border-zinc-900 rounded-xl font-handwriting text-xl text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  Gift Message (Printed directly on receipt)
                </label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-zinc-900 rounded-xl text-xs text-zinc-900 font-marker"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  Gift Tier
                </label>
                <div className="grid grid-cols-3 gap-2 font-typewriter text-xs">
                  {[5, 10, 25].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedPrice(amt)}
                      className={`py-2 rounded-xl border-2 font-bold ${
                        selectedPrice === amt ? 'bg-pink-300 border-zinc-900 shadow-xs' : 'bg-white border-zinc-400'
                      }`}
                    >
                      ${amt} Nothing
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-pink-300 hover:bg-pink-400 text-zinc-900 font-marker font-bold text-lg rounded-xl border-2 border-zinc-900 shadow-[4px_4px_0px_#18181B] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5" />
                  <span>Send Nothing As A Gift</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
