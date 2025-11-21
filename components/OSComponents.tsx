
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, X, Maximize2, Wifi, Battery, Search, Command, Apple } from 'lucide-react';
import { WindowState } from '../types';

// --- Window Component ---
interface WindowFrameProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, onClose, onMinimize, onFocus, children }) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
      style={{ 
        zIndex: win.zIndex,
        width: win.defaultWidth || 800,
        height: win.defaultHeight || 550,
        // Randomize initial position slightly
        x: (typeof window !== 'undefined' ? window.innerWidth / 2 : 0) - ((win.defaultWidth || 800) / 2) + (Math.random() * 40 - 20), 
        y: 100 + (Math.random() * 40 - 20)
      }}
      className={`absolute flex flex-col rounded-xl overflow-hidden 
      shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] 
      backdrop-blur-3xl border border-white/10 ring-1 ring-black/20
      ${win.id === 'music' ? 'bg-[#121212]/95 shadow-[0_0_40px_rgba(236,72,153,0.15)] border-t-white/20' : 'bg-[#1e1e1e]/90'}
      `}
    >
      {/* Window Title Bar */}
      <div 
        className="h-10 flex items-center justify-between px-4 shrink-0 cursor-default bg-gradient-to-b from-white/5 to-transparent border-b border-white/5"
        onDoubleClick={onMinimize}
      >
        <div className="flex items-center gap-2 group w-20">
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center text-black/50 shadow-inner active:opacity-80">
             <X size={8} className="opacity-0 group-hover:opacity-100 text-black/80" strokeWidth={3} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center text-black/50 shadow-inner active:opacity-80">
             <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black/80" strokeWidth={3} />
          </button>
          <button className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center text-black/50 shadow-inner active:opacity-80">
             <Maximize2 size={6} className="opacity-0 group-hover:opacity-100 text-black/80" strokeWidth={4} />
          </button>
        </div>
        <div className="text-xs font-medium text-white/50 select-none tracking-wide flex items-center gap-2">
            {win.icon && <div className="w-3 h-3 opacity-50">{win.icon}</div>}
            {win.title}
        </div>
        <div className="w-20"></div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-hidden relative bg-transparent">
        {children}
      </div>
    </motion.div>
  );
};

// --- Dock Component ---
interface DockProps {
  windows: WindowState[];
  onOpen: (id: string) => void;
}

export const Dock: React.FC<DockProps> = ({ windows, onOpen }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 pb-4 pt-5 rounded-[2rem] bg-black/30 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-end gap-4 z-[9999] hover:scale-[1.02] transition-transform duration-500">
      {windows.map((win) => (
        <DockIcon key={win.id} window={win} onClick={() => onOpen(win.id)} />
      ))}
    </div>
  );
};

const DockIcon = ({ window, onClick }: { window: WindowState, onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-end h-full gap-2">
            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.8 }} 
                        animate={{ opacity: 1, y: -16, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-14 bg-black/80 backdrop-blur-md text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-white/10 pointer-events-none"
                    >
                        {window.title}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-black/80"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                layout
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                animate={{ 
                    y: isHovered ? -15 : 0,
                    scale: isPressed ? 0.9 : (isHovered ? 1.2 : 1)
                }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="w-14 h-14 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-white/10 ring-1 ring-black/20"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay"></div>
                {window.icon}
            </motion.button>
            
            {/* Active Indicator */}
            <div className="h-1 flex items-end justify-center">
                 <div className={`w-1 h-1 rounded-full bg-white/80 shadow-[0_0_5px_white] transition-all duration-300 ${window.isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            </div>
        </div>
    );
};

// --- Menu Bar Component ---
export const Menubar: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-8 bg-black/30 backdrop-blur-xl flex items-center justify-between px-5 z-[9999] text-[13px] font-medium text-white shadow-sm border-b border-white/5">
            <div className="flex items-center gap-6">
                <Apple size={16} fill="white" className="drop-shadow-sm hover:opacity-80 transition-opacity cursor-pointer" />
                <span className="hidden md:inline font-bold drop-shadow-sm">Neon OS</span>
                <span className="hidden md:inline drop-shadow-sm opacity-80 hover:opacity-100 cursor-default transition-opacity">System</span>
                <span className="hidden md:inline drop-shadow-sm opacity-80 hover:opacity-100 cursor-default transition-opacity">Visuals</span>
                <span className="hidden md:inline drop-shadow-sm opacity-80 hover:opacity-100 cursor-default transition-opacity">Audio</span>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-4 opacity-90">
                    <Battery size={18} className="drop-shadow-sm" />
                    <Wifi size={16} className="drop-shadow-sm" />
                    <Search size={16} className="drop-shadow-sm" />
                    <Command size={16} className="drop-shadow-sm" />
                </div>
                <div className="flex items-center gap-2 drop-shadow-sm font-semibold">
                    <span>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                </div>
            </div>
        </div>
    );
};
