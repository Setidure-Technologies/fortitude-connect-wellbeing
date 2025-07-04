import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onTranscription, 
  disabled = false 
}) => {
  const { 
    state, 
    startRecording, 
    stopRecording, 
    cancelRecording, 
    formatDuration 
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const transcribedText = await stopRecording();
      if (transcribedText.trim()) {
        onTranscription(transcribedText);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleCancelRecording = () => {
    cancelRecording();
  };

  if (state.isRecording) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-red-700 dark:text-red-400">
            {formatDuration(state.duration)}
          </span>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={handleStopRecording}
          className="h-10 w-10"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancelRecording}
          className="h-10 w-10"
        >
          <MicOff className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (state.isProcessing) {
    return (
      <Button size="icon" variant="outline" disabled className="h-10 w-10">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <div className="flex flex-col">
      <Button
        size="icon"
        variant="outline"
        onClick={handleStartRecording}
        disabled={disabled}
        className="h-10 w-10"
        title="Record voice message"
      >
        <Mic className="h-4 w-4" />
      </Button>
      {state.error && (
        <span className="text-xs text-red-500 mt-1 max-w-32 truncate">
          {state.error}
        </span>
      )}
    </div>
  );
};