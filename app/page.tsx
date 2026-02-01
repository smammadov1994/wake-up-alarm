'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Plus, ImagePlus, Bell, Smile, X, RotateCw, Sun } from 'lucide-react';

interface PenaltyPhoto {
  id: string;
  dataUrl: string;
}

type AppState = 'setup' | 'preview' | 'countdown' | 'penalty' | 'success';

export default function Home() {
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [photos, setPhotos] = useState<PenaltyPhoto[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<PenaltyPhoto | null>(null);
  const [state, setState] = useState<AppState>('setup');
  const [timeLeft, setTimeLeft] = useState(0);
  const [penaltyCountdown, setPenaltyCountdown] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const alarmTriggeredRef = useRef(false);

  // Load saved data
  useEffect(() => {
    const savedTime = localStorage.getItem('alarmTime');
    const savedPhotos = localStorage.getItem('penaltyPhotos');
    
    if (savedTime) setAlarmTime(savedTime);
    if (savedPhotos) {
      const parsed = JSON.parse(savedPhotos);
      setPhotos(parsed);
      if (parsed.length > 0) {
        setCurrentPhoto(parsed[Math.floor(Math.random() * parsed.length)]);
        setState('preview');
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('alarmTime', alarmTime);
  }, [alarmTime]);

  useEffect(() => {
    localStorage.setItem('penaltyPhotos', JSON.stringify(photos));
  }, [photos]);

  // Countdown timer
  useEffect(() => {
    if (state !== 'countdown') return;

    const targetTime = new Date();
    const [hours, minutes] = alarmTime.split(':').map(Number);
    targetTime.setHours(hours, minutes, 0, 0);
    if (targetTime <= new Date()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(interval);
        setState('penalty');
        alarmTriggeredRef.current = false;
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state, alarmTime]);

  // Penalty countdown
  useEffect(() => {
    if (state !== 'penalty') return;

    const interval = setInterval(() => {
      setPenaltyCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state]);

  // Check for alarm time
  useEffect(() => {
    if (state === 'preview' || state === 'countdown' || state === 'penalty') return;

    const checkAlarm = () => {
      const now = new Date();
      const [hours, minutes] = alarmTime.split(':').map(Number);
      
      if (now.getHours() === hours && now.getMinutes() === minutes && !alarmTriggeredRef.current) {
        alarmTriggeredRef.current = true;
        setState('countdown');
      }
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [state, alarmTime]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newPhoto: PenaltyPhoto = {
          id: Date.now() + Math.random().toString(),
          dataUrl
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetAlarm = () => {
    if (photos.length > 0) {
      setCurrentPhoto(photos[Math.floor(Math.random() * photos.length)]);
      setState('preview');
    }
  };

  const handleWakeUp = () => {
    setState('success');
    setTimeout(() => {
      setState('preview');
      alarmTriggeredRef.current = false;
    }, 3000);
  };

  const handleAnotherRound = () => {
    setPenaltyCountdown(10);
    setCurrentPhoto(photos[Math.floor(Math.random() * photos.length)]);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl">
            <Bell className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Wake-Up Gallery
            </h1>
            <Sun className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-white/80 mt-3 text-lg">
            The alarm that keeps you honest 💥
          </p>
        </header>

        {state === 'setup' && (
          <div className="max-w-2xl mx-auto animate-in">
            {/* Time Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-400" />
                Set Your Alarm Time
              </h2>
              
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full bg-slate-800/50 border-2 border-white/10 rounded-xl px-6 py-4 text-2xl text-white 
                         placeholder="07:00 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:border-transparent transition-all cursor-pointer"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              
              <p className="text-white/60 mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Alarm will trigger at this exact time
              </p>
            </div>

            {/* Photo Upload */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <ImagePlus className="w-6 h-6 text-pink-400" />
                Upload Penalty Photos
              </h2>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group aspect-square bg-slate-800/50 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg hover:scale-105 hover:border-white/30 transition-all duration-200">
                    <img src={photo.dataUrl} alt="Penalty photo" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(prev => prev.filter(p => p.id !== photo.id))}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {Array.from({ length: Math.max(1, 4 - photos.length) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-slate-800/50 border-2 border-dashed border-white/20 rounded-xl 
                             flex items-center justify-center hover:bg-slate-800/80 hover:border-white/40 
                             transition-all duration-200 group"
                  >
                    <Plus className="w-8 h-8 text-white/40 group-hover:text-white/60 group-hover:scale-110 transition-all" />
                  </button>
                ))}
              </div>
              
              <p className="text-white/60 mt-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload multiple embarrassing photos (they'll only show if you don't wake up!)
              </p>

              {photos.length > 0 && (
                <button
                  onClick={handleSetAlarm}
                  className="w-full mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                           hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 
                           text-white font-semibold py-5 px-8 rounded-2xl shadow-xl 
                           hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200 text-lg flex items-center justify-center gap-3"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <Bell className="w-6 h-6 animate-swing" />
                  Set Alarm & Preview
                </button>
              )}
              
              {photos.length === 0 && (
                <div className="text-center mt-8 p-8 bg-slate-800/30 rounded-2xl border border-white/5">
                  <p className="text-white/70 text-lg mb-4">No photos yet!</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 
                             text-white px-6 py-3 rounded-xl border border-white/10 
                             hover:border-white/20 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Upload Your First Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {state === 'preview' && (
          <div className="max-w-3xl mx-auto animate-in">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                  <Bell className="w-8 h-8 text-yellow-400 animate-bounce" />
                  Alarm Preview
                  <Clock className="w-8 h-8 text-indigo-400" />
                </h2>
                <p className="text-white/70 text-lg">Your alarm is set for <span className="text-white font-mono text-xl mx-2">{alarmTime}</span></p>
                <p className="text-white/60">Here's what will happen if you don't wake up...</p>
              </div>

              {currentPhoto && (
                <div className="relative mb-8 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 
                               opacity-20 rounded-3xl blur-2xl group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-slate-800/50 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                    <img 
                      src={currentPhoto.dataUrl} 
                      alt="Potential penalty" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                        <Smile className="w-4 h-4" />
                        This could be shared! 😱
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-700/50 hover:bg-slate-700 text-white px-8 py-5 rounded-2xl 
                           border border-white/10 hover:border-white/20 transition-all duration-200 
                           flex items-center justify-center gap-3 font-semibold text-lg"
                >
                  <Plus className="w-6 h-6" />
                  Add More Photos
                </button>
                <button
                  onClick={() => {
                    setAlarmTime(alarmTime);
                    setState('preview');
                    alarmTriggeredRef.current = false;
                  }}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                           hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 
                           text-white px-8 py-5 rounded-2xl shadow-xl 
                           hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 
                           flex items-center justify-center gap-3 font-semibold text-lg"
                >
                  <Bell className="w-6 h-6" />
                  Confirm Alarm
                </button>
              </div>
            </div>
          </div>
        )}

        {state === 'countdown' && (
          <div className="max-w-2xl mx-auto animate-in">
            <div className="bg-gradient-to-br from-red-900/80 via-orange-900/80 to-yellow-900/80 
                         backdrop-blur-lg rounded-3xl p-12 border border-red-500/30 shadow-2xl">
              <div className="text-center">
                <Bell className="w-20 h-20 mx-auto text-red-400 animate-bounce mb-6" />
                <h2 className="text-4xl font-bold mb-4 text-white">WAKE UP!</h2>
                <p className="text-white/80 text-xl mb-8">The alarm is ringing! You have {timeLeft} seconds to cancel</p>
                
                <div className="text-8xl font-bold font-mono mb-8 bg-black/30 rounded-3xl py-8 
                               border-2 border-red-500/30 tracking-wider">
                  {formatTime(timeLeft)}
                </div>

                <button
                  onClick={handleWakeUp}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 
                           text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-xl 
                           hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200 flex items-center justify-center gap-4"
                >
                  <Smile className="w-10 h-10" />
                  I WOKE UP!
                </button>

                <p className="text-red-300/80 mt-6 text-sm">Or else...</p>
              </div>
            </div>
          </div>
        )}

        {state === 'penalty' && (
          <div className="max-w-4xl mx-auto animate-in">
            <div className="bg-slate-900/80 backdrop-blur-lg rounded-3xl overflow-hidden border-2 border-red-500/50 shadow-2xl">
              {/* Penalty Image */}
              {currentPhoto && (
                <div className="relative aspect-video w-full bg-black">
                  <img 
                    src={currentPhoto.dataUrl} 
                    alt="Oh no..." 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/40 to-transparent" />
                </div>
              )}

              {/* Countdown Overlay */}
              <div className="p-8 bg-gradient-to-r from-red-900 via-orange-900 to-yellow-900">
                <div className="text-center">
                  <div className="flex justify-center gap-2 mb-4">
                    <RotateCw className="w-8 h-8 text-yellow-300 animate-spin" />
                    <h2 className="text-4xl font-bold text-white">TOO LATE!</h2>
                  </div>
                  
                  <p className="text-white/90 text-xl mb-6">
                    Your penalty photo will be displayed in
                  </p>

                  <div className="text-9xl font-bold font-mono bg-black/40 rounded-3xl py-10 
                                 border-4 border-yellow-500/50 tracking-wider mb-8">
                    {penaltyCountdown}
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleAnotherRound}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl 
                               border-2 border-white/20 hover:border-white/30 transition-all duration-200 
                               flex items-center justify-center gap-2"
                    >
                      <RotateCw className="w-6 h-6" />
                      Next Round
                    </button>
                    
                    <button
                      onClick={() => {
                        setState('setup');
                        setPenaltyCountdown(10);
                        alarmTriggeredRef.current = false;
                      }}
                      className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-2xl 
                               border-2 border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="max-w-2xl mx-auto animate-in">
            <div className="bg-gradient-to-br from-green-900/80 via-emerald-900/80 to-teal-900/80 
                         backdrop-blur-lg rounded-3xl p-12 border border-green-500/30 shadow-2xl">
              <div className="text-center">
                <div className="w-32 h-32 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center 
                             shadow-2xl shadow-green-500/50 animate-bounce">
                  <Smile className="w-20 h-20 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold mb-4 text-white">SUCCESS!</h2>
                <p className="text-white/90 text-xl mb-8">You woke up and avoided the penalty!</p>
                
                <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
                  <p className="text-green-300 text-lg font-semibold">
                    ✓ Alarm cancelled
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    Your embarrassing photo remains a secret
                  </p>
                </div>

                <p className="text-white/60 animate-pulse">
                  Returning to preview mode...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        
        @keyframes swing {
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-swing {
          animation: swing 0.5s ease-in-out;
        }
        
        .animate-spin {
          animation: spin 3s linear infinite;
        }
        
        .animate-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
