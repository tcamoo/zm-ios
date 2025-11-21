
import React, { useState, useRef, useEffect } from 'react';
import { AppProps, Note, CountdownEvent, MusicTrack } from '../types';
import { Plus, Trash2, Music, Disc, Play, Pause, SkipForward, SkipBack, Mic2, X, Image as ImageIcon, Volume2, BarChart3, Zap } from 'lucide-react';

// --- Visualizer Component (Mini) ---
const MiniVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
    return (
        <div className="flex items-end gap-[2px] h-4">
            {[...Array(6)].map((_, i) => (
                <div 
                    key={i} 
                    className={`w-1 bg-lime-400 rounded-t-sm transition-all duration-75 ease-in-out ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                    style={{ 
                        height: isPlaying ? `${Math.random() * 100}%` : '20%',
                        animationDelay: `${i * 0.1}s`,
                        backgroundColor: i % 2 === 0 ? '#D9F99D' : '#06B6D4'
                    }}
                />
            ))}
        </div>
    );
};

// --- Music App ---
export const MusicApp: React.FC<AppProps> = ({ data, onUpdate }) => {
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newTrack, setNewTrack] = useState<Partial<MusicTrack>>({ title: '', artist: '', type: 'netease', source: '', coverUrl: '' });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentTrack = data.music.find(t => t.id === currentTrackId);

    useEffect(() => {
        if (currentTrack?.type === 'direct' && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => { console.error("Autoplay blocked", e); setIsPlaying(false); });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackId]);

    const handleAddTrack = () => {
        if (!newTrack.title || !newTrack.source) return;
        const track: MusicTrack = {
            id: Date.now().toString(),
            title: newTrack.title,
            artist: newTrack.artist || 'Unknown Artist',
            coverUrl: newTrack.coverUrl || 'https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=500',
            type: newTrack.type as 'netease' | 'direct',
            source: newTrack.source,
            addedAt: Date.now()
        };
        onUpdate({ music: [track, ...data.music] });
        setIsAdding(false);
        setNewTrack({ title: '', artist: '', type: 'netease', source: '', coverUrl: '' });
    };

    const handleDelete = (id: string) => {
        if (currentTrackId === id) {
            setIsPlaying(false);
            setCurrentTrackId(null);
        }
        onUpdate({ music: data.music.filter(t => t.id !== id) });
    };

    const playTrack = (track: MusicTrack) => {
        if (currentTrackId === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrackId(track.id);
            setIsPlaying(true);
        }
    };

    return (
        <div className="flex h-full w-full bg-[#121212] text-white overflow-hidden font-sans relative">
            
            {/* Background Gradients */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#1a1a1a_50%,#000000_100%)] opacity-20 pointer-events-none animate-spin-slow duration-[20s]"></div>
            
            {/* Sidebar */}
            <div className="w-60 bg-black/40 backdrop-blur-2xl flex flex-col border-r border-white/10 z-10">
                <div className="px-6 pt-8 mb-8">
                    <h1 className="font-black text-3xl italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                        NEON<br/>PLAYER
                    </h1>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-lime-400 uppercase tracking-[0.2em] border border-lime-400/30 rounded-full px-2 py-0.5 w-fit">
                        <Zap size={10} /> V3.0 Online
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-2">
                    <div className="flex items-center gap-4 px-4 py-3 bg-white/10 text-white rounded-xl text-sm font-bold cursor-pointer border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <Disc size={18} className="text-pink-500" /> 全部歌曲
                    </div>
                    <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                        <Mic2 size={18} /> 艺术家
                    </div>
                    <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                        <BarChart3 size={18} /> 排行榜
                    </div>
                </div>

                <div className="p-6">
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95"
                    >
                        <Plus size={16} /> Import Media
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-0 bg-black/20">
                
                {/* Dynamic Header Background */}
                {currentTrack && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img src={currentTrack.coverUrl} className="w-full h-full object-cover opacity-20 blur-[80px]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/80 to-[#121212]"></div>
                    </div>
                )}

                {/* List Header */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 z-10">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-2xl font-bold text-white">Library</h2>
                        <span className="text-xs font-mono text-cyan-400">/// {data.music.length} TRACKS DETECTED</span>
                    </div>
                    <MiniVisualizer isPlaying={isPlaying} />
                </div>

                {/* Track List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10">
                    {data.music.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-4 animate-[spin_10s_linear_infinite]">
                                <Music size={40} />
                            </div>
                            <p className="font-mono text-xs tracking-widest">DATA STREAM EMPTY</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#121212]/90 backdrop-blur-md z-20">
                                <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/10">
                                    <th className="pb-4 pl-4 font-bold w-16">Status</th>
                                    <th className="pb-4 font-bold">Title</th>
                                    <th className="pb-4 font-bold">Artist</th>
                                    <th className="pb-4 font-bold">Source</th>
                                    <th className="pb-4 font-bold text-right pr-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data.music.map((track, idx) => (
                                    <tr 
                                        key={track.id} 
                                        onDoubleClick={() => playTrack(track)}
                                        className={`group hover:bg-white/5 transition-colors border-b border-white/5 cursor-default ${currentTrackId === track.id ? 'bg-white/[0.08]' : ''}`}
                                    >
                                        <td className="py-4 pl-4">
                                            {currentTrackId === track.id && isPlaying ? (
                                                <Volume2 size={16} className="text-lime-400 animate-pulse" />
                                            ) : (
                                                <span className="font-mono text-xs text-gray-600 group-hover:text-gray-400">{(idx + 1).toString().padStart(2, '0')}</span>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 shadow-lg group-hover:shadow-cyan-500/20 transition-all ring-1 ring-white/10">
                                                    <img src={track.coverUrl} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => playTrack(track)}>
                                                        <Play size={20} fill="white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-base ${currentTrackId === track.id ? 'text-cyan-400' : 'text-white'}`}>{track.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-400 font-medium tracking-wide">{track.artist}</td>
                                        <td className="py-4">
                                            {track.type === 'netease' ? 
                                                <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider bg-red-500 text-white">Cloud</span> : 
                                                <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider bg-blue-500 text-white">Local</span>
                                            }
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <button onClick={() => handleDelete(track.id)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Player Control Bar */}
                <div className="h-28 bg-[#0A0A0A] border-t border-white/10 px-8 flex items-center justify-between shrink-0 z-30 relative">
                    {/* Progress Bar Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-800">
                         <div className={`h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 ${isPlaying ? 'w-full animate-[shimmer_2s_linear_infinite]' : 'w-0'}`}></div>
                    </div>

                    {currentTrack ? (
                        <>
                            {/* Current Track Info */}
                            <div className="flex items-center gap-5 w-1/3">
                                <div className={`w-16 h-16 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-white/10 ${isPlaying ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black' : ''} transition-all duration-500`}>
                                    <img src={currentTrack.coverUrl} className={`w-full h-full object-cover ${isPlaying ? 'scale-110' : 'scale-100'} transition-transform duration-[10s]`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-black text-lg text-white truncate tracking-tight">{currentTrack.title}</div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate">{currentTrack.artist}</div>
                                </div>
                            </div>

                            {/* Center Controls */}
                            <div className="flex flex-col items-center w-1/3">
                                <div className="flex items-center gap-8">
                                    <SkipBack size={24} className="text-gray-500 hover:text-white cursor-pointer transition-colors hover:scale-110" />
                                    <button 
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                    >
                                        {isPlaying ? <Pause size={24} fill="black"/> : <Play size={24} fill="black" className="ml-1"/>}
                                    </button>
                                    <SkipForward size={24} className="text-gray-500 hover:text-white cursor-pointer transition-colors hover:scale-110" />
                                </div>
                            </div>

                            {/* Right Side / Embed */}
                            <div className="w-1/3 flex justify-end items-center">
                                {currentTrack.type === 'netease' ? (
                                   <div className="relative w-[300px] h-[66px] overflow-hidden rounded-lg opacity-80 hover:opacity-100 transition-all border border-white/10 bg-black shadow-inner">
                                       <iframe 
                                           key={currentTrack.id}
                                           frameBorder="no" 
                                           marginWidth={0} 
                                           marginHeight={0} 
                                           width={320} 
                                           height={86} 
                                           src={`//music.163.com/outchain/player?type=2&id=${currentTrack.source}&auto=${isPlaying ? 1 : 0}&height=66`} 
                                           className="-ml-[10px] -mt-[10px] grayscale hover:grayscale-0 transition-all duration-500"
                                       />
                                   </div>
                                ) : (
                                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <audio ref={audioRef} src={currentTrack.source} onEnded={() => setIsPlaying(false)} />
                                        <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
                                        <div className="text-lime-400 text-[10px] font-black font-mono tracking-widest">
                                            MP3 DECODER ACTIVE
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full text-center">
                            <span className="text-xs font-mono text-gray-700 uppercase tracking-[0.5em] animate-pulse">Waiting for Input...</span>
                        </div>
                    )}
                </div>

                {/* Add Track Modal (Pop-up) */}
                {isAdding && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-8 animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#1a1a1a] w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
                            
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-2xl text-white italic">ADD NEW<br/>SIGNAL</h3>
                                <button onClick={() => setIsAdding(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20} className="text-white"/></button>
                            </div>
                            
                            <div className="space-y-5">
                                {/* Type Selector */}
                                <div className="grid grid-cols-2 gap-3 p-1 bg-black rounded-xl border border-white/10">
                                    <button 
                                        onClick={() => setNewTrack({...newTrack, type: 'netease'})}
                                        className={`py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${newTrack.type === 'netease' ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Netease
                                    </button>
                                    <button 
                                        onClick={() => setNewTrack({...newTrack, type: 'direct'})}
                                        className={`py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${newTrack.type === 'direct' ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Direct MP3
                                    </button>
                                </div>

                                <input className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-pink-500 outline-none placeholder:text-gray-700 font-bold" value={newTrack.title} onChange={e => setNewTrack({...newTrack, title: e.target.value})} placeholder="TRACK TITLE" />
                                <input className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-700 font-bold" value={newTrack.artist} onChange={e => setNewTrack({...newTrack, artist: e.target.value})} placeholder="ARTIST NAME" />
                                
                                <div className="relative">
                                     <input className="w-full bg-black border border-white/10 rounded-xl p-4 pr-12 text-sm text-white focus:border-cyan-500 outline-none placeholder:text-gray-700 font-mono" value={newTrack.coverUrl} onChange={e => setNewTrack({...newTrack, coverUrl: e.target.value})} placeholder="COVER IMAGE URL" />
                                     <div className="absolute right-3 top-3 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                                         {newTrack.coverUrl ? <img src={newTrack.coverUrl} className="w-full h-full object-cover"/> : <ImageIcon size={14} className="text-gray-500"/>}
                                     </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-lime-400 uppercase mb-2 ml-1 flex justify-between">
                                        <span>{newTrack.type === 'netease' ? 'NETEASE SONG ID' : 'AUDIO FILE URL'}</span>
                                        <span className="opacity-50">{newTrack.type === 'netease' ? 'Example: 186016' : 'https://example.com/song.mp3'}</span>
                                    </label>
                                    <input 
                                        className="w-full bg-black border-2 border-white/10 rounded-xl p-4 text-sm text-lime-400 font-mono focus:border-lime-500 outline-none shadow-inner" 
                                        value={newTrack.source} 
                                        onChange={e => setNewTrack({...newTrack, source: e.target.value})} 
                                        placeholder="INPUT SOURCE..." 
                                    />
                                </div>

                                <button onClick={handleAddTrack} className="w-full py-4 bg-white text-black font-black rounded-xl mt-4 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Zap size={18} className="fill-black"/> Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Notes App ---
export const NotesApp: React.FC<AppProps> = ({ data, onUpdate }) => {
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const activeNote = data.notes.find(n => n.id === activeNoteId) || null;

    const createNote = () => {
        const newNote: Note = { id: Date.now().toString(), title: 'New Note', content: '', updatedAt: Date.now() };
        onUpdate({ notes: [newNote, ...data.notes] });
        setActiveNoteId(newNote.id);
    };

    const updateNote = (id: string, fields: Partial<Note>) => {
        onUpdate({ notes: data.notes.map(n => n.id === id ? { ...n, ...fields, updatedAt: Date.now() } : n) });
    };

    const deleteNote = (id: string) => {
        onUpdate({ notes: data.notes.filter(n => n.id !== id) });
        if (activeNoteId === id) setActiveNoteId(null);
    };

    return (
        <div className="flex h-full w-full bg-[#f5f5f7] font-sans text-gray-900">
            <div className="w-1/3 bg-[#e8e8e8] border-r border-gray-300 flex flex-col">
                <div className="p-3 border-b border-gray-300 flex justify-between items-center bg-[#e0e0e0]">
                    <span className="font-bold text-xs text-gray-500">NOTES</span>
                    <button onClick={createNote} className="hover:bg-black/10 p-1 rounded"><Plus size={16}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {data.notes.map(note => (
                        <div key={note.id} onClick={() => setActiveNoteId(note.id)} className={`p-3 rounded-md cursor-pointer ${activeNoteId === note.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
                            <div className="font-bold text-sm truncate">{note.title || 'New Note'}</div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-gray-500">{new Date(note.updatedAt).toLocaleDateString()}</span>
                                <button onClick={(e) => {e.stopPropagation(); deleteNote(note.id);}} className="text-gray-400 hover:text-red-500"><Trash2 size={12}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white flex flex-col">
                {activeNote ? (
                    <div className="p-6 flex-1 flex flex-col">
                         <input className="text-2xl font-bold border-none outline-none mb-4 bg-transparent" placeholder="Title" value={activeNote.title} onChange={(e) => updateNote(activeNote.id, { title: e.target.value })} />
                         <textarea className="flex-1 resize-none border-none outline-none bg-transparent text-base text-gray-600 leading-relaxed" placeholder="Type here..." value={activeNote.content} onChange={(e) => updateNote(activeNote.id, { content: e.target.value })} />
                    </div>
                ) : <div className="flex-1 flex items-center justify-center text-gray-300 font-bold">NO NOTE SELECTED</div>}
            </div>
        </div>
    );
};

// --- Countdown App ---
export const CountdownApp: React.FC<AppProps> = ({ data, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<CountdownEvent>>({ title: '', targetDate: '', color: 'bg-blue-500' });
    
    const addEvent = () => {
        if (!newEvent.title || !newEvent.targetDate) return;
        onUpdate({ events: [...data.events, { id: Date.now().toString(), title: newEvent.title!, targetDate: newEvent.targetDate!, color: newEvent.color || 'bg-blue-500' }] });
        setIsAdding(false); setNewEvent({ title: '', targetDate: '', color: 'bg-blue-500' });
    };

    const getDays = (date: string) => Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return (
        <div className="h-full w-full bg-[#1c1c1e] text-white p-4 font-sans overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-sm text-gray-500">UPCOMING</h2>
                <button onClick={() => setIsAdding(true)} className="bg-gray-700 p-1 rounded hover:bg-gray-600"><Plus size={16}/></button>
            </div>
            {isAdding && (
                <div className="bg-[#2c2c2e] p-4 rounded-xl mb-4 space-y-3">
                    <input className="w-full bg-black/20 p-2 rounded text-sm text-white border border-white/10" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                    <input type="date" className="w-full bg-black/20 p-2 rounded text-sm text-white border border-white/10" value={newEvent.targetDate} onChange={e => setNewEvent({...newEvent, targetDate: e.target.value})} />
                    <button onClick={addEvent} className="w-full bg-blue-500 py-2 rounded font-bold text-sm">Save</button>
                </div>
            )}
            <div className="space-y-3">
                {data.events.map(e => {
                    const days = getDays(e.targetDate);
                    return (
                        <div key={e.id} className="bg-[#2c2c2e] p-4 rounded-xl flex justify-between items-center relative overflow-hidden group">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${e.color}`}></div>
                            <div><div className="font-bold text-lg">{e.title}</div><div className="text-xs text-gray-500">{e.targetDate}</div></div>
                            <div className="text-right"><div className="text-2xl font-black">{Math.abs(days)}</div><div className="text-[9px] font-bold text-gray-500">{days < 0 ? 'AGO' : 'DAYS'}</div></div>
                            <button onClick={() => onUpdate({events: data.events.filter(ev => ev.id !== e.id)})} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
