
import React, { useState, useRef, useEffect } from 'react';
import { AppProps, Note, CountdownEvent, MusicTrack } from '../types';
import { Plus, Trash2, Calendar, Clock, Music, Disc, Play, Pause, SkipForward, SkipBack, Mic2, Link, X, Image as ImageIcon, Volume2 } from 'lucide-react';

// --- Music App ---
export const MusicApp: React.FC<AppProps> = ({ data, onUpdate }) => {
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [newTrack, setNewTrack] = useState<Partial<MusicTrack>>({ title: '', artist: '', type: 'netease', source: '', coverUrl: '' });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentTrack = data.music.find(t => t.id === currentTrackId);

    // Audio Effects
    useEffect(() => {
        if (currentTrack?.type === 'direct' && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Autoplay blocked", e);
                    setIsPlaying(false);
                });
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
            coverUrl: newTrack.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500',
            type: newTrack.type as 'netease' | 'direct',
            source: newTrack.source,
            addedAt: Date.now()
        };
        onUpdate({ music: [track, ...data.music] }); // Add to top
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
        <div className="flex h-full w-full bg-[#0f0f11] text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
            {/* Sidebar - Glassmorphism Dark */}
            <div className="w-48 bg-[#18181b]/80 backdrop-blur-md flex flex-col border-r border-white/5 pt-6">
                <div className="px-4 mb-6">
                    <div className="flex items-center gap-2 text-pink-500 font-bold text-lg mb-1 tracking-tight">
                        <Music size={20} />
                        <span>NEON MUSIC</span>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Cloud Library</div>
                </div>

                <div className="flex-1 px-2 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-pink-500/20 to-transparent text-pink-400 border-l-2 border-pink-500 rounded-r-lg text-sm font-bold cursor-pointer">
                        <Disc size={16} /> 全部歌曲
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors cursor-pointer">
                        <Mic2 size={16} /> 艺术家
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg text-xs font-bold transition-all shadow-lg shadow-pink-900/20 active:scale-95"
                    >
                        <Plus size={14} /> 添加音乐
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative bg-gradient-to-br from-[#0f0f11] to-[#1a1a2e]">
                
                {/* Ambient Background Glow */}
                {currentTrack && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img src={currentTrack.coverUrl} className="w-full h-full object-cover opacity-10 blur-[100px] scale-150" />
                    </div>
                )}

                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f0f11]/50 backdrop-blur-xl z-10">
                    <div>
                        <h2 className="text-lg font-bold text-white">Library Tracks</h2>
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{data.music.length} ITEMS • SYNCED</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse delay-75"></div>
                    </div>
                </div>

                {/* Track List */}
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative z-0">
                    {data.music.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600">
                            <Music size={64} className="mb-4 opacity-20" />
                            <p className="text-sm font-mono">NO SIGNAL FOUND</p>
                            <button onClick={() => setIsAdding(true)} className="mt-4 text-pink-500 hover:underline text-xs">Import Track</button>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-2 pl-4 font-bold w-12">#</th>
                                    <th className="pb-2 font-bold">Title</th>
                                    <th className="pb-2 font-bold">Artist</th>
                                    <th className="pb-2 font-bold">Format</th>
                                    <th className="pb-2 font-bold text-right pr-4">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.music.map((track, idx) => (
                                    <tr 
                                        key={track.id} 
                                        onDoubleClick={() => playTrack(track)}
                                        className={`group hover:bg-white/5 transition-colors text-sm cursor-default border-b border-white/[0.02] ${currentTrackId === track.id ? 'bg-white/[0.03]' : ''}`}
                                    >
                                        <td className="py-3 pl-4 text-gray-500 group-hover:text-white">
                                            {currentTrackId === track.id && isPlaying ? (
                                                <Volume2 size={14} className="text-cyan-400 animate-pulse" />
                                            ) : (
                                                <span className="font-mono text-xs">{idx + 1}</span>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded overflow-hidden relative shrink-0 shadow-lg">
                                                    <img src={track.coverUrl} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => playTrack(track)}>
                                                        <Play size={16} fill="white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={`font-bold ${currentTrackId === track.id ? 'text-cyan-400' : 'text-white'}`}>{track.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-gray-400 font-medium">{track.artist}</td>
                                        <td className="py-3">
                                            {track.type === 'netease' ? 
                                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">NETEASE</span> : 
                                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">MP3</span>
                                            }
                                        </td>
                                        <td className="py-3 text-right pr-4">
                                            <button onClick={() => handleDelete(track.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Player Control Bar */}
                <div className="h-24 bg-[#121214] border-t border-white/10 px-6 flex items-center justify-between shrink-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative">
                    {currentTrack ? (
                        <>
                            {/* Current Track Info */}
                            <div className="flex items-center gap-4 w-1/3">
                                <div className={`w-14 h-14 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-white/10 ${isPlaying ? 'animate-[pulse_4s_infinite]' : ''}`}>
                                    <img src={currentTrack.coverUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-sm text-white truncate">{currentTrack.title}</div>
                                    <div className="text-xs text-gray-400 truncate">{currentTrack.artist}</div>
                                </div>
                            </div>

                            {/* Center Controls */}
                            <div className="flex flex-col items-center w-1/3">
                                <div className="flex items-center gap-6 mb-3">
                                    <SkipBack size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                                    <button 
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-300 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                    >
                                        {isPlaying ? <Pause size={18} fill="black"/> : <Play size={18} fill="black" className="ml-0.5"/>}
                                    </button>
                                    <SkipForward size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                                </div>
                                
                                {/* Progress Bar (Visual for Netease, Functional for Direct) */}
                                {currentTrack.type === 'direct' && (
                                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 w-1/2 rounded-full animate-[pulse_2s_infinite]"></div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side / Embed */}
                            <div className="w-1/3 flex justify-end items-center">
                                {currentTrack.type === 'netease' ? (
                                   <div className="relative w-[260px] h-[66px] overflow-hidden rounded-lg opacity-80 hover:opacity-100 transition-opacity border border-white/10 bg-black">
                                        {/* Overlay to block generic clicks if needed, but let's allow interaction */}
                                       <iframe 
                                           key={currentTrack.id}
                                           frameBorder="no" 
                                           marginWidth={0} 
                                           marginHeight={0} 
                                           width={280} 
                                           height={86} 
                                           src={`//music.163.com/outchain/player?type=2&id=${currentTrack.source}&auto=${isPlaying ? 1 : 0}&height=66`} 
                                           className="-ml-[10px] -mt-[10px]"
                                       />
                                   </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <audio ref={audioRef} src={currentTrack.source} onEnded={() => setIsPlaying(false)} />
                                        <div className="px-2 py-1 rounded border border-cyan-500/30 bg-cyan-900/20 text-cyan-400 text-[10px] font-bold font-mono">
                                            DIRECT AUDIO
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-xs font-mono text-gray-600 mx-auto tracking-widest">PLAYER IDLE</div>
                    )}
                </div>

                {/* Add Track Modal */}
                {isAdding && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                        <div className="bg-[#18181b] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-cyan-500"></div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-white">Add to Library</h3>
                                <button onClick={() => setIsAdding(false)}><X size={20} className="text-gray-500 hover:text-white"/></button>
                            </div>
                            
                            <div className="space-y-4">
                                {/* Type Selector */}
                                <div className="grid grid-cols-2 gap-3 p-1 bg-black/40 rounded-lg">
                                    <button 
                                        onClick={() => setNewTrack({...newTrack, type: 'netease'})}
                                        className={`py-2 rounded-md text-xs font-bold transition-all ${newTrack.type === 'netease' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Netease Cloud
                                    </button>
                                    <button 
                                        onClick={() => setNewTrack({...newTrack, type: 'direct'})}
                                        className={`py-2 rounded-md text-xs font-bold transition-all ${newTrack.type === 'direct' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Direct Link (MP3)
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <input className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-pink-500 outline-none placeholder:text-gray-600" value={newTrack.title} onChange={e => setNewTrack({...newTrack, title: e.target.value})} placeholder="Track Title" />
                                    
                                    <input className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-pink-500 outline-none placeholder:text-gray-600" value={newTrack.artist} onChange={e => setNewTrack({...newTrack, artist: e.target.value})} placeholder="Artist" />
                                    
                                    <div className="flex gap-2">
                                        <input className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-pink-500 outline-none placeholder:text-gray-600" value={newTrack.coverUrl} onChange={e => setNewTrack({...newTrack, coverUrl: e.target.value})} placeholder="Cover Image URL" />
                                        <div className="w-11 h-11 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {newTrack.coverUrl ? <img src={newTrack.coverUrl} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-gray-700"/>}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">
                                            {newTrack.type === 'netease' ? 'Song ID (e.g. 186016)' : 'Audio URL (e.g. .mp3)'}
                                        </label>
                                        <input 
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-cyan-400 font-mono focus:border-cyan-500 outline-none" 
                                            value={newTrack.source} 
                                            onChange={e => setNewTrack({...newTrack, source: e.target.value})} 
                                            placeholder={newTrack.type === 'netease' ? '186016' : 'https://...'} 
                                        />
                                    </div>
                                </div>

                                <button onClick={handleAddTrack} className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-lg mt-4 transition-all shadow-lg shadow-pink-900/20">
                                    Save Track
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Notes App (Polished) ---
export const NotesApp: React.FC<AppProps> = ({ data, onUpdate }) => {
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const activeNote = data.notes.find(n => n.id === activeNoteId) || null;

    const createNote = () => {
        const newNote: Note = { id: Date.now().toString(), title: 'New Idea', content: '', updatedAt: Date.now() };
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
        <div className="flex h-full w-full rounded-bl-xl rounded-br-xl overflow-hidden font-sans bg-white">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-xs text-gray-400 uppercase tracking-wider">All Notes</span>
                    <button onClick={createNote} className="p-1.5 bg-yellow-400 hover:bg-yellow-300 rounded-md text-yellow-900 transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {data.notes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`px-3 py-3 rounded-lg cursor-pointer transition-all border border-transparent ${activeNoteId === note.id ? 'bg-yellow-100 border-yellow-200 shadow-sm' : 'hover:bg-white hover:shadow-sm hover:border-gray-100'}`}
                        >
                            <div className="font-bold text-sm text-gray-800 truncate">{note.title || 'Untitled'}</div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                                <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="text-gray-300 hover:text-red-500"><Trash2 size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Editor */}
            <div className="flex-1 bg-white flex flex-col relative">
                {activeNote ? (
                    <div className="p-6 flex-1 flex flex-col">
                         <input 
                            className="w-full text-2xl font-black border-none outline-none bg-transparent text-gray-900 placeholder:text-gray-300 mb-4 font-display tracking-tight"
                            placeholder="Title"
                            value={activeNote.title}
                            onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                        />
                        <textarea 
                            className="flex-1 w-full resize-none border-none outline-none bg-transparent text-base leading-relaxed text-gray-600 placeholder:text-gray-200 font-mono"
                            placeholder="Write something..."
                            value={activeNote.content}
                            onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center opacity-10">
                        <div className="w-24 h-2 bg-black rotate-45"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Countdown App (Polished) ---
export const CountdownApp: React.FC<AppProps> = ({ data, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<CountdownEvent>>({ title: '', targetDate: '', color: 'bg-blue-500' });
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];

    const addEvent = () => {
        if (!newEvent.title || !newEvent.targetDate) return;
        onUpdate({ events: [...data.events, {
            id: Date.now().toString(),
            title: newEvent.title,
            targetDate: newEvent.targetDate,
            color: newEvent.color || 'bg-blue-500'
        }] });
        setIsAdding(false);
        setNewEvent({ title: '', targetDate: '', color: 'bg-blue-500' });
    };

    const calculateDays = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="h-full w-full bg-[#f8f9fa] p-4 overflow-y-auto rounded-bl-xl rounded-br-xl font-sans">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Important Dates</h2>
                <button onClick={() => setIsAdding(true)} className="p-1.5 bg-black text-white rounded-md hover:scale-105 transition-transform shadow-lg"><Plus size={14}/></button>
            </div>

            {isAdding && (
                <div className="bg-white rounded-xl p-4 mb-4 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <input className="w-full mb-2 p-2 bg-gray-50 rounded text-sm font-bold outline-none" placeholder="Event Name" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                    <input type="date" className="w-full mb-3 p-2 bg-gray-50 rounded text-sm outline-none" value={newEvent.targetDate} onChange={e => setNewEvent({...newEvent, targetDate: e.target.value})} />
                    <div className="flex gap-2 mb-3 justify-center">
                        {colors.map(c => (
                            <button key={c} onClick={() => setNewEvent({...newEvent, color: c})} className={`w-5 h-5 rounded-full ${c} ${newEvent.color === c ? 'ring-2 ring-black ring-offset-1' : ''}`}/>
                        ))}
                    </div>
                    <button onClick={addEvent} className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg">Save</button>
                </div>
            )}

            <div className="space-y-3">
                {data.events.map(event => {
                    const days = calculateDays(event.targetDate);
                    return (
                        <div key={event.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group">
                             <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${event.color}`}></div>
                             <div className="flex justify-between items-end relative z-10">
                                 <div>
                                     <h3 className="font-black text-gray-800 text-lg leading-none">{event.title}</h3>
                                     <div className="text-xs text-gray-400 mt-1 font-mono">{event.targetDate}</div>
                                 </div>
                                 <div className="text-right">
                                     <span className={`text-3xl font-black tracking-tighter ${days < 0 ? 'text-gray-300' : 'text-black'}`}>{Math.abs(days)}</span>
                                     <span className="text-[10px] font-bold text-gray-400 block uppercase">{days < 0 ? 'AGO' : 'DAYS'}</span>
                                 </div>
                             </div>
                             <button onClick={() => onUpdate({ events: data.events.filter(e => e.id !== event.id) })} className="absolute top-2 right-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 size={14} />
                             </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
