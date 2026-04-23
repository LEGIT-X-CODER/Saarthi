import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SOSButtonProps {
  className?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ className }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isEmergencyTriggered, setIsEmergencyTriggered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Beep sound using Web Audio API
  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch {
      // audio not supported, silently skip
    }
  };

  useEffect(() => {
    if (isActivated && countdown > 0) {
      playBeep();
    }
  }, [isActivated, countdown]);

  const startCountdown = () => {
    setIsActivated(true);
    setCountdown(10);
    toast({
      title: '🚨 SOS Activated',
      description: 'Emergency alert will be sent in 10 seconds. Tap Cancel to stop.',
      variant: 'destructive',
    });
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActivated(false);
    setCountdown(10);
    toast({
      title: 'SOS Cancelled',
      description: 'Emergency alert has been cancelled.',
    });
  };

  // Reverse-geocode lat/lng → human readable address via OpenStreetMap Nominatim (free, no key needed)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const triggerEmergency = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsEmergencyTriggered(true);
    setIsSaving(true);

    let latitude = 26.4499;   // default fallback coords (Kanpur)
    let longitude = 80.331902;
    let address = 'Location unavailable';
    let locationObtained = false;

    // --- 1. Try to get real GPS location ---
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        })
      );
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      locationObtained = true;
      address = await reverseGeocode(latitude, longitude);
    } catch {
      // GPS denied or timed out; use fallback coords but still save
      address = await reverseGeocode(latitude, longitude);
    }

    // --- 2. Build the Firestore document ---
    const sosDoc = {
      // Who triggered it
      userId: currentUser?.uid || 'anonymous',
      userEmail: currentUser?.email || 'unknown',
      userName: currentUser?.displayName || 'Unknown User',

      // Location
      latitude,
      longitude,
      address,
      locationObtained,      // false if we fell back to default coords

      // Metadata
      status: 'active',       // authorities can update to 'resolved'
      severity: 'critical',
      alertType: 'SOS',
      message: 'SOS Emergency Alert — Immediate assistance required',

      // Always use Firestore server time so all dashboards agree on timezone
      triggeredAt: serverTimestamp(),
    };

    // --- 3. Save to Firestore ---
    let savedDocId: string | null = null;
    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'sos_alerts'), sosDoc);
        savedDocId = docRef.id;
        console.log('✅ SOS saved to Firestore. Doc ID:', savedDocId);
      }
    } catch (err) {
      console.error('❌ Firestore write failed:', err);
    } finally {
      setIsSaving(false);
    }

    // --- 4. Show user feedback ---
    toast({
      title: '🚨 EMERGENCY ALERT SENT',
      description: locationObtained
        ? `Your location has been shared: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        : 'Alert sent. Live GPS was unavailable — default location used.',
      variant: 'destructive',
    });

    // --- 5. Reset UI after 6 s ---
    setTimeout(() => {
      setIsActivated(false);
      setIsEmergencyTriggered(false);
      setCountdown(10);
    }, 6000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── TRIGGERED STATE ──────────────────────────────────────────────────────
  if (isEmergencyTriggered) {
    return (
      <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
        <div className="bg-red-600 text-white p-4 rounded-full shadow-2xl animate-pulse flex flex-col items-center gap-1">
          <AlertTriangle className="h-8 w-8" />
          <span className="text-xs font-bold">{isSaving ? 'SENDING...' : 'ALERT SENT'}</span>
          {!isSaving && <MapPin className="h-4 w-4 opacity-80" />}
        </div>
      </div>
    );
  }

  // ─── COUNTDOWN STATE ──────────────────────────────────────────────────────
  if (isActivated) {
    return (
      <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
        <div className="bg-red-600 text-white p-4 rounded-full shadow-2xl animate-bounce flex flex-col items-center gap-1">
          <div className="text-2xl font-bold leading-none">{countdown}</div>
          <AlertTriangle className="h-5 w-5" />
          <Button
            onClick={cancelCountdown}
            size="sm"
            variant="outline"
            className="bg-white text-red-600 hover:bg-gray-100 text-xs px-2 py-1 mt-1"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ─── IDLE STATE ───────────────────────────────────────────────────────────
  return (
    <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
      <Button
        onClick={startCountdown}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
        size="lg"
      >
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-6 w-6 mb-1" />
          <span className="text-xs font-bold">SOS</span>
        </div>
      </Button>
    </div>
  );
};

export default SOSButton;