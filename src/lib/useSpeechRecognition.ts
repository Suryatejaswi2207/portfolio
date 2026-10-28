import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for Web Speech API
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

export function formatVoiceCommands(text: string): string {
  let formatted = text;
  
  // Format voice punctuation and formatting keywords
  formatted = formatted.replace(/\b(new paragraph|next paragraph)\b/gi, '\n\n');
  formatted = formatted.replace(/\b(new line|next line)\b/gi, '\n');
  formatted = formatted.replace(/\s+\bperiod\b/gi, '.');
  formatted = formatted.replace(/\bperiod\b/gi, '.');
  formatted = formatted.replace(/\s+\bcomma\b/gi, ',');
  formatted = formatted.replace(/\bcomma\b/gi, ',');
  formatted = formatted.replace(/\s+\bquestion mark\b/gi, '?');
  formatted = formatted.replace(/\bquestion mark\b/gi, '?');
  formatted = formatted.replace(/\s+\bexclamation (mark|point)\b/gi, '!');
  formatted = formatted.replace(/\bexclamation (mark|point)\b/gi, '!');
  formatted = formatted.replace(/\s+\bcolon\b/gi, ':');
  formatted = formatted.replace(/\s+\bsemicolon\b/gi, ';');
  
  // Fix spacing after punctuation
  formatted = formatted.replace(/([.?!])\s*([a-z])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`);

  return formatted;
}

export function useSpeechRecognition({
  onTranscriptChange,
  lang = 'en-US'
}: {
  onTranscriptChange?: (text: string, isFinal: boolean) => void;
  lang?: string;
} = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<string>(lang);
  
  const recognitionRef = useRef<any>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const shouldRestartRef = useRef<boolean>(false);

  // Check support on mount
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Request native microphone hardware permission explicitly
  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    setErrorMessage(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // If getUserMedia is not directly available, rely on recognition.start()
      setHasMicPermission(true);
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;
      setHasMicPermission(true);
      // We don't hold the stream open permanently, close the test tracks
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      console.warn('Microphone permission request result:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setHasMicPermission(false);
        setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser address bar to dictate.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setHasMicPermission(false);
        setErrorMessage('No microphone device was detected on your system. Please connect a microphone and try again.');
      } else {
        setErrorMessage(err.message || 'Unable to access microphone.');
      }
      return false;
    }
  }, []);

  // Stop listening helper
  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore if already stopped
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Start listening
  const startListening = useCallback(async (customLang?: string) => {
    setErrorMessage(null);
    setInterimTranscript('');

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage('Speech Recognition is not supported by your current browser. Please try Google Chrome or Microsoft Edge.');
      return;
    }

    // Attempt permission request
    const permitted = await requestMicPermission();
    if (!permitted) {
      return;
    }

    try {
      // Stop any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = customLang || activeLang;
      shouldRestartRef.current = true;

      recognition.onstart = () => {
        setIsListening(true);
        setHasMicPermission(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0].transcript;

          if (item.isFinal) {
            finalChunk += text + ' ';
          } else {
            interim += text;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
          if (onTranscriptChange) {
            onTranscriptChange(interim, false);
          }
        }

        if (finalChunk) {
          const formatted = formatVoiceCommands(finalChunk);
          setInterimTranscript('');
          if (onTranscriptChange) {
            onTranscriptChange(formatted, true);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setHasMicPermission(false);
          setErrorMessage('Microphone access was denied. Please click the site settings icon next to the URL and allow microphone access.');
          setIsListening(false);
          shouldRestartRef.current = false;
        } else if (event.error === 'no-speech') {
          // Normal timeout if user was quiet, don't show red error
        } else if (event.error === 'network') {
          setErrorMessage('Network connection lost to speech recognition service.');
          setIsListening(false);
          shouldRestartRef.current = false;
        } else if (event.error !== 'aborted') {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // If user hasn't explicitly stopped and we should be listening, attempt soft restart
        if (shouldRestartRef.current) {
          try {
            recognition.start();
            return;
          } catch (e) {
            // Already started or terminated
          }
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to initiate speech recognition:', err);
      setErrorMessage(err.message || 'Could not start microphone speech recognition.');
      setIsListening(false);
    }
  }, [activeLang, onTranscriptChange, requestMicPermission]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    hasMicPermission,
    interimTranscript,
    errorMessage,
    setErrorMessage,
    startListening,
    stopListening,
    requestMicPermission,
    activeLang,
    setActiveLang
  };
}
