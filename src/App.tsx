
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WindowFrame, Dock, Menubar } from './components/OSComponents';
import { NotesApp, CountdownApp, MusicApp } from './components/Apps';
import { AppData, WindowState } from './types';
import { StickyNote, Timer, Settings, Music, Monitor, HardDrive } from 'lucide-react';

// Simulated Default Data
const INITIAL_DATA: AppData = {
  notes: [
      { id: '1', title: 'Welcome to CloudOS', content: 'Welcome to the new system.\n\nMusic App now supports Netease Cloud Music and direct MP3 links.', updatedAt: Date.now() }
  ],
  events: [
      { id: '1', title: 'System Launch', targetDate: '2025-01-01', color: 'bg-blue-500' }
  ],
  music: [
      { id: '1', title: 'Neon Blade', artist: 'MoonDeity', coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500', type: 'direct', source: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3', addedAt: Date.now() }
  ],
  settings: { theme: 'dark', wallpaper: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop' }
};

const App: React.FC = () => {
  // System Data (Synced)
  const [systemData, setSystemData] = useState<AppData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Window Management State
  const [windows, setWindows] = useState<WindowState[]>([
      { 
          id: 'music', 
          title: 'Neon Music', 
          isOpen: true, 
          isMinimized: false, 
          zIndex: 10, 
          icon: <div className="w-full h-full bg-gradient-to-b from-pink-500 to-purple-900 flex items-center justify-center text-white shadow-inner"><Music size={28}/></div>, 
          component: null,
          defaultWidth: 950,
          defaultHeight: 650
      },
      { 
          id: 'notes', 
          title: 'Notes', 
          isOpen: false, 
          isMinimized: false, 
          zIndex: 1, 
          icon: <div className="w-full h-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center text-white"><StickyNote size={28} className="text-yellow-900"/></div>, 
          component: null, 
          defaultWidth: 700,
          defaultHeight: 500
      },
      { 
          id: 'countdown', 
          title: 'Countdown', 
          isOpen: false, 
          isMinimized: false, 
          zIndex: 0, 
          icon: <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center text-gray-700"><Timer size={28}/></div>, 
          component: null,
          defaultWidth: 350,
          defaultHeight: 500
      },
      { 
          id: 'settings', 
          title: 'System Settings', 
          isOpen: false, 
          isMinimized: false, 
          zIndex: 0, 
          icon: <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center text-white"><Settings size={28}/></div>, 
          component: <div className="p-8 flex flex-col items-center justify-center h-full text-center text-gray-600 bg-[#f5f5f7]">
              <Monitor size={64} className="mb-6 text-gray-400"/>
              <h2 className="text-2xl font-bold text-gray-800">CloudOS v3.0 (Neon)</h2>
              <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                      <HardDrive size={16} className="text-blue-500"/>
                      <span>KV Drive: macos_drive_store_v2</span>
                  </div>
              </div>
              <p className="text-xs mt-8 text-gray-400">System is synced automatically.</p>
          </div>,
          defaultWidth: 500,
          defaultHeight: 400
      }
  ]);

  // --- Sync Logic ---
  useEffect(() => {
      const loadData = async () => {
          try {
              const res = await fetch('/api/sync');
              if (res.ok) {
                  const data = await res.json();
                  setSystemData(prev => ({
                      ...prev,
                      ...data,
                      music: data.music || prev.music,
                      settings: { ...prev.settings, ...data.settings }
                  }));
              }
          } catch (e) {
              console.warn("Failed to load remote data, using local default.", e);
          } finally {
              setIsLoading(false);
          }
      };
      loadData();
  }, []);

  // Auto-save Data on Change
  useEffect(() => {
      if (isLoading) return;

      const timer = setTimeout(async () => {
          try {
              await fetch('/api/sync', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(systemData)
              });
          } catch (e) {
              console.error("Sync failed", e);
          }
      }, 2000);

      return () => clearTimeout(timer);
  }, [systemData, isLoading]);

  const handleUpdateData = (newData: Partial<AppData>) => {
      setSystemData(prev => ({ ...prev, ...newData }));
  };

  // --- Window Actions ---
  const bringToFront = (id: string) => {
      setWindows(prev => {
          const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
          return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      });
  };

  const openWindow = (id: string) => {
      setWindows(prev => {
          const target = prev.find(w => w.id === id);
          if (target?.isOpen && !target.isMinimized) {
              const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
              return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
          }
          const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
          return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
      });
  };

  const closeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const minimizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  // --- Inject Components ---
  const renderWindowContent = (id: string, defaultContent: React.ReactNode) => {
      switch (id) {
          case 'notes':
              return <NotesApp data={systemData} onUpdate={handleUpdateData} />;
          case 'countdown':
              return <CountdownApp data={systemData} onUpdate={handleUpdateData} />;
          case 'music':
              return <MusicApp data={systemData} onUpdate={handleUpdateData} />;
          default:
              return defaultContent;
      }
  };

  return (
    <div 
        className="relative w-full h-full overflow-hidden bg-cover bg-center transition-all duration-700 font-sans select-none fixed inset-0"
        style={{ backgroundImage: `url('${systemData.settings.wallpaper}')` }}
    >
        {/* Dark Overlay for Cyberpunk Vibe */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        <Menubar />
        
        {/* Desktop Area */}
        <div className="relative w-full h-full pt-8 pb-24 px-4 z-0">
            <AnimatePresence>
                {windows.filter(w => w.isOpen && !w.isMinimized).map(window => (
                    <WindowFrame
                        key={window.id}
                        window={window}
                        onClose={() => closeWindow(window.id)}
                        onMinimize={() => minimizeWindow(window.id)}
                        onFocus={() => bringToFront(window.id)}
                    >
                        {renderWindowContent(window.id, window.component)}
                    </WindowFrame>
                ))}
            </AnimatePresence>
        </div>

        <Dock windows={windows} onOpen={openWindow} />
    </div>
  );
};

export default App;
