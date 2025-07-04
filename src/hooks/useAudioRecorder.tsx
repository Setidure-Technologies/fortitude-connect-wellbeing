import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  error: string | null;
}

export const useAudioRecorder = () => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isProcessing: false,
    duration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms

      setState(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Start timer
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start recording. Please check microphone permissions.' 
      }));
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !streamRef.current) {
        reject(new Error('No active recording'));
        return;
      }

      setState(prev => ({ ...prev, isRecording: false, isProcessing: true }));

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const arrayBuffer = await audioBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const base64Audio = btoa(String.fromCharCode(...uint8Array));

          // Send to Supabase Edge Function for transcription
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio },
          });

          if (error) {
            throw new Error(error.message || 'Transcription failed');
          }

          setState(prev => ({ ...prev, isProcessing: false }));
          resolve(data.text || '');

        } catch (error) {
          console.error('Error processing audio:', error);
          setState(prev => ({ 
            ...prev, 
            isProcessing: false,
            error: 'Failed to transcribe audio. Please try again.' 
          }));
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setState({
        isRecording: false,
        isProcessing: false,
        duration: 0,
        error: null,
      });

      streamRef.current = null;
      mediaRecorderRef.current = null;
      chunksRef.current = [];
    }
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    cancelRecording,
    formatDuration,
  };
};