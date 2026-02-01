"use client";

import { useState, useEffect } from "react";
import { AlarmClock, Image as ImageIcon, Upload, CheckCircle, AlertCircle, Bell, Smile } from "lucide-react";
import { saveAlarm, loadAlarm, savePhotos, loadPhotos, clearAlarm } from "./lib/storage";

export default function Home() {
  const [alarmTime, setAlarmTime] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showPenalty, setShowPenalty] = useState(false);
  const [penaltyCountdown, setPenaltyCountdown] = useState<number>(10);

  // Load saved data on mount
  useEffect(() => {
    const savedAlarm = loadAlarm();
    const savedPhotos = loadPhotos();
    if (savedAlarm) {
      setAlarmTime(savedAlarm.time);
      setPhotos(savedAlarm.photos || []);
      setIsAlarmSet(true);
    }
    if (savedPhotos) {
      setPhotos(savedPhotos);
    }
  }, []);

  // Timer for alarm countdown
  useEffect(() => {
    if (!isAlarmSet || !alarmTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = alarmTime.split(":").map(Number);
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);

      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const diff = alarmDate.getTime() - now.getTime();
      setTimeRemaining(Math.max(0, Math.floor(diff / 1000)));

      if (diff <= 0) {
        triggerAlarm();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAlarmSet, alarmTime]);

  const triggerAlarm = () => {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    setSelectedPhoto(randomPhoto);
    setShowPenalty(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: string[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newPhotos.push(result);
        if (newPhotos.length === files.length) {
          setPhotos(prev => [...prev, ...newPhotos]);
          savePhotos([...photos, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetAlarm = () => {
    if (alarmTime && photos.length > 0) {
      saveAlarm({ time: alarmTime, photos });
      setIsAlarmSet(true);
      setShowPenalty(false);
      setSelectedPhoto(null);
    }
  };

  const handleWakeUp = () => {
    clearAlarm();
    setIsAlarmSet(false);
    setShowPenalty(false);
    setSelectedPhoto(null);
  };

  const handleCancelPenalty = () => {
    setShowPenalty(false);
    setSelectedPhoto(null);
    setTimeRemaining(0);
  };

  // Penalty countdown
  useEffect(() => {
    if (showPenalty && penaltyCountdown > 0) {
      const interval = setInterval(() => {
        setPenaltyCountdown(prev => {
          if (prev <= 1) {
            // In Phase 2, this would send the photo
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showPenalty, penaltyCountdown]);

  return (
    <main className="min-h-screen bg-dark text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Bell className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            Wake-Up Gallery Alarm
          </h1>
          <p className="text-gray-400 text-lg">
            Wake up, or your friends see a random photo!
          </p>
        </div>

        {!showPenalty ? (
          <>
            {/* Alarm Setup */}
            <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 mb-6 backdrop-blur">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <AlarmClock className="w-6 h-6" />
                Set Your Alarm
              </h2>

              <div className="mb-8">
                <label className="block text-gray-300 mb-2 text-lg">
                  Alarm Time:
                </label>
                <input
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  className="w-full bg-gray-700 text-white text-2xl p-4 rounded-xl border-2 border-gray-600 focus:border-primary focus:outline-none transition-all"
                  disabled={isAlarmSet}
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-gray-300 mb-2 text-lg">
                  <Upload className="inline w-5 h-5 mr-2" />
                  Add Embarrassing Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={isAlarmSet}
                />
                <label
                  htmlFor="photo-upload"
                  className={`flex items-center justify-center gap-2 w-full p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    photos.length > 0
                      ? "border-success bg-success/10"
                      : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
                  } ${isAlarmSet ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-lg">
                    {photos.length > 0
                      ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} selected`
                      : "Click to add photos"}
                  </span>
                </label>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="mb-8">
                  <label className="block text-gray-300 mb-3 text-lg">
                    👀 Preview - Random photo will be sent:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-lg overflow-hidden ${
                          selectedPhoto === photo ? "ring-4 ring-primary" : ""
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Set Alarm Button */}
              {!isAlarmSet ? (
                <button
                  onClick={handleSetAlarm}
                  disabled={!alarmTime || photos.length === 0}
                  className={`w-full py-4 text-xl font-bold rounded-xl transition-all ${
                    !alarmTime || photos.length === 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-primary hover:bg-red-500 hover:scale-105"
                  }`}
                >
                  <Bell className="inline w-6 h-6 mr-2" />
                  Set Alarm
                </button>
              ) : (
                <div className="bg-success/20 border-2 border-success rounded-xl p-4 text-center">
                  <CheckCircle className="inline w-8 h-8 text-success mb-2" />
                  <p className="text-success text-lg font-semibold">
                    Alarm is set for {alarmTime}!
                  </p>
                </div>
              )}

              {/* Countdown */}
              {isAlarmSet && timeRemaining > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-lg mb-2">
                    Time remaining:
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {Math.floor(timeRemaining / 3600)}h{" "}
                    {Math.floor((timeRemaining % 3600) / 60)}m{" "}
                    {timeRemaining % 60}s
                  </p>
                </div>
              )}

              {/* Wake Up Button */}
              {isAlarmSet && (
                <div className="mt-6">
                  <button
                    onClick={handleWakeUp}
                    className="w-full py-5 text-2xl font-bold bg-success hover:bg-green-400 rounded-xl transition-all hover:scale-105"
                  >
                    <Smile className="inline w-7 h-7 mr-2" />
                    I WOKE UP!
                  </button>
                  <p className="text-center text-gray-400 mt-3 text-sm">
                    Click this to stop the photo from being sent!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Penalty Screen */
          <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 backdrop-blur text-center">
            <div className="mb-6">
              <AlertCircle className="w-20 h-20 text-primary mx-auto animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-primary">
              TIME'S UP!
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              You didn't wake up on time... here's what's happening:
            </p>

            {/* Penalty Photo */}
            {selectedPhoto && (
              <div className="relative mb-6">
                <img
                  src={selectedPhoto}
                  alt="Penalty photo"
                  className="w-full max-w-md mx-auto rounded-xl"
                />
                {penaltyCountdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <p className="text-6xl font-bold text-primary">
                      {penaltyCountdown}
                    </p>
                  </div>
                )}
              </div>
            )}

            {penaltyCountdown > 0 ? (
              <p className="text-2xl text-gray-300 mb-6">
                Photo will be sent to your group chat in{" "}
                <span className="text-primary font-bold">{penaltyCountdown}</span> seconds!
              </p>
            ) : (
              <div className="mb-6">
                <p className="text-2xl text-success font-semibold mb-4">
                  📸 Photo sent!
                </p>
                <p className="text-gray-300">
                  (In Phase 2, this will actually send to WhatsApp)
                </p>
              </div>
            )}

            {penaltyCountdown > 0 && (
              <button
                onClick={handleCancelPenalty}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
              >
                Cancel (You woke up!)
              </button>
            )}

            <button
              onClick={() => setShowPenalty(false)}
              className="ml-4 px-8 py-3 bg-primary hover:bg-red-500 rounded-xl font-semibold transition-all"
            >
              Set New Alarm
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with ❤️ for better mornings</p>
        </div>
      </div>
    </main>
  );
}
