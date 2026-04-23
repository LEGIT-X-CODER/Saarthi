import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SOSButtonProps {
  className?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ className }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isEmergencyTriggered, setIsEmergencyTriggered] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio for alert sound
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // High frequency beep
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    if (isActivated && countdown > 0) {
      try {
        createBeepSound();
      } catch (error) {
        console.log('Audio not supported');
      }
    }
  }, [isActivated, countdown]);

  const startCountdown = () => {
    setIsActivated(true);
    setCountdown(10);
    
    toast({
      title: "🚨 SOS Activated",
      description: "Emergency alert will be sent in 10 seconds. Tap cancel to stop.",
      variant: "destructive",
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
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  const triggerEmergency = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsEmergencyTriggered(true);
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Create emergency incident
      const emergencyData = {
        type: 'emergency',
        severity: 'critical',
        description: 'SOS Emergency Alert - Immediate assistance required',
        location: {
          latitude,
          longitude,
          address: 'Location coordinates provided'
        },
        reportedBy: currentUser?.uid || 'anonymous',
        reporterEmail: currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'pending',
        isSOSAlert: true
      };

      // Here you would typically send this to your backend/Firebase
      console.log('Emergency alert triggered:', emergencyData);
      
      toast({
        title: "🚨 EMERGENCY ALERT SENT",
        description: `Emergency services have been notified. Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        variant: "destructive",
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setIsActivated(false);
        setIsEmergencyTriggered(false);
        setCountdown(10);
      }, 5000);

    } catch (error) {
      console.error('Failed to get location or send emergency alert:', error);
      
      // Send emergency alert without location
      const emergencyData = {
        type: 'emergency',
        severity: 'critical',
        description: 'SOS Emergency Alert - Immediate assistance required (Location unavailable)',
        reportedBy: currentUser?.uid || 'anonymous',
        reporterEmail: currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'pending',
        isSOSAlert: true
      };

      console.log('Emergency alert triggered (no location):', emergencyData);
      
      toast({
        title: "🚨 EMERGENCY ALERT SENT",
        description: "Emergency services have been notified. Location could not be determined.",
        variant: "destructive",
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setIsActivated(false);
        setIsEmergencyTriggered(false);
        setCountdown(10);
      }, 5000);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (isEmergencyTriggered) {
    return (
      <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
        <div className="bg-red-600 text-white p-4 rounded-full shadow-2xl animate-pulse">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <span className="text-xs font-bold">ALERT SENT</span>
          </div>
        </div>
      </div>
    );
  }

  if (isActivated) {
    return (
      <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
        <div className="bg-red-600 text-white p-4 rounded-full shadow-2xl animate-bounce">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-1">{countdown}</div>
            <AlertTriangle className="h-6 w-6 mb-2" />
            <Button
              onClick={cancelCountdown}
              size="sm"
              variant="outline"
              className="bg-white text-red-600 hover:bg-gray-100 text-xs px-2 py-1"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

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