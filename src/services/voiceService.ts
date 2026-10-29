// Browser-Native Speech Recognition (STT) and Natural Speech Synthesis (TTS) Engine

export type SpeechRecognitionState =
  | 'idle'
  | 'requesting'
  | 'listening'
  | 'processing'
  | 'stopped'
  | 'denied'
  | 'no-speech'
  | 'error'
  | 'unsupported';

export interface VoiceServiceOptions {
  onStateChange?: (state: SpeechRecognitionState) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
}

class VoiceService {
  private recognition: any = null;
  private isListening = false;
  private state: SpeechRecognitionState = 'idle';
  private onStateChangeCb?: (state: SpeechRecognitionState) => void;
  private onTranscriptCb?: (transcript: string, isFinal: boolean) => void;
  private onErrorCb?: (errorMessage: string) => void;
  private isSpeaking = false;
  private selectedVoiceName: string | null = null;
  private speechRate: number = 0.95; // Natural human cadence
  private speechPitch: number = 1.0;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initRecognition();
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.cachedVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.state = 'unsupported';
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.setState('listening');
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const text = (finalTranscript || interimTranscript).trim();
        if (text && this.onTranscriptCb) {
          this.onTranscriptCb(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        const err = event.error;

        if (err === 'not-allowed' || err === 'permission-denied') {
          this.setState('denied');
          if (this.onErrorCb) {
            this.onErrorCb('Microphone access was denied. You can enable it in your browser settings or type your response.');
          }
        } else if (err === 'no-speech') {
          this.setState('no-speech');
        } else {
          this.setState('error');
          if (this.onErrorCb) {
            this.onErrorCb(`Speech recognition notice: ${err}`);
          }
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.state === 'listening' || this.state === 'requesting') {
          this.setState('stopped');
        }
      };
    } catch (e) {
      this.state = 'unsupported';
    }
  }

  public setCallbacks(options: VoiceServiceOptions) {
    this.onStateChangeCb = options.onStateChange;
    this.onTranscriptCb = options.onTranscript;
    this.onErrorCb = options.onError;
    if (this.onStateChangeCb) {
      this.onStateChangeCb(this.state);
    }
  }

  private setState(newState: SpeechRecognitionState) {
    this.state = newState;
    if (this.onStateChangeCb) {
      this.onStateChangeCb(newState);
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public isTtsSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public async startListening(): Promise<boolean> {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      this.setState('unsupported');
      if (this.onErrorCb) {
        this.onErrorCb('Speech recognition is not supported in this browser. Please use Chrome, Edge, or a compatible browser.');
      }
      return false;
    }

    if (this.isListening) {
      return true;
    }

    // Stop active speech synthesis when listening to prevent feedback loop
    this.stopSpeaking();

    try {
      this.setState('requesting');

      // Proactively request browser microphone permission if mediaDevices is supported
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Release temporary track immediately so SpeechRecognition has dedicated hardware access
          stream.getTracks().forEach((track) => track.stop());
        } catch (permErr: any) {
          if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
            this.setState('denied');
            if (this.onErrorCb) {
              this.onErrorCb('Microphone permission was denied. Please allow microphone access in your browser address bar or type your answer.');
            }
            return false;
          }
        }
      }

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Speech recognition start issue:', err);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
      this.setState('stopped');
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isTtsSupported()) return [];
    if (this.cachedVoices.length === 0) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
    return this.cachedVoices.filter((v) => v.lang.startsWith('en'));
  }

  public setSelectedVoice(voiceName: string) {
    this.selectedVoiceName = voiceName;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.7, Math.min(1.5, rate));
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  /**
   * Selects the most natural, non-robotic sounding voice available in browser
   */
  private pickBestVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    if (this.selectedVoiceName) {
      const selected = voices.find((v) => v.name === this.selectedVoiceName);
      if (selected) return selected;
    }

    // Priority: Natural / Neural > Google > Microsoft > Apple > Default
    const preferredOrder = [
      (v: SpeechSynthesisVoice) => v.name.includes('Natural') || v.name.includes('Online'),
      (v: SpeechSynthesisVoice) => v.name.includes('Google') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Jenny') || v.name.includes('Guy') || v.name.includes('Aria'),
      (v: SpeechSynthesisVoice) => v.name.includes('Samantha') || v.name.includes('Alex') || v.name.includes('Daniel'),
      (v: SpeechSynthesisVoice) => v.lang === 'en-US',
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
    ];

    for (const check of preferredOrder) {
      const match = voices.find(check);
      if (match) return match;
    }

    return voices[0] || null;
  }

  /**
   * Text-To-Speech (TTS) with natural cadence and punctuation pauses
   */
  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      rate?: number;
      pitch?: number;
      voiceName?: string;
    }
  ) {
    if (!this.isTtsSupported()) return;

    // Stop any active speech first to avoid overlapping voices
    this.stopSpeaking();

    // Clean markdown formatting before speaking (remove asterisks, hashes, backticks, urls)
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.rate = options?.rate ?? this.speechRate;
    utterance.pitch = options?.pitch ?? this.speechPitch;

    const bestVoice = this.pickBestVoice(synth);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options?.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (options?.onEnd) options.onEnd();
    };

    this.isSpeaking = true;
    synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.isTtsSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const voiceService = new VoiceService();
