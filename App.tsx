import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateVoiceover } from './services/geminiService';
import { base64ToAudioUrl } from './utils/audioUtils';
import Spinner from './components/Spinner';

const VoiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
);

const App: React.FC = () => {
  const [text, setText] = useState<string>(
    "The future belongs to those who believe in the beauty of their dreams."
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Voice Performance State
  const [emotion, setEmotion] = useState<string>('Confident & Courageous');
  const [intensity, setIntensity] = useState<string>('Medium');
  const [environment, setEnvironment] = useState<string>('Studio');
  
  // Studio Tune State
  const [reverb, setReverb] = useState<string>('None');
  const [echo, setEcho] = useState<string>('None');
  const [noiseGate, setNoiseGate] = useState<boolean>(false);

  // Background Music State
  const [backgroundMusic, setBackgroundMusic] = useState<string>('None');
  const [musicVolume, setMusicVolume] = useState<number>(0.3);


  // Player Controls State
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Effect to load persisted voice on mount
  useEffect(() => {
    const loadPersistedVoice = async () => {
      try {
        const persistedData = localStorage.getItem('voiceoverData');
        if (persistedData) {
          setIsLoading(true);
          const { 
            base64Audio, text, emotion, intensity, environment,
            reverb, echo, noiseGate, backgroundMusic, musicVolume 
          } = JSON.parse(persistedData);
          
          const url = await base64ToAudioUrl(base64Audio);
          setAudioUrl(url);
          setText(text || "The future belongs to those who believe in the beauty of their dreams.");
          setEmotion(emotion || 'Confident & Courageous');
          setIntensity(intensity || 'Medium');
          setEnvironment(environment || 'Studio');
          setReverb(reverb || 'None');
          setEcho(echo || 'None');
          setNoiseGate(noiseGate || false);
          setBackgroundMusic(backgroundMusic || 'None');
          setMusicVolume(musicVolume === undefined ? 0.3 : musicVolume);
        }
      } catch (err) {
        console.error("Failed to load persisted voice:", err);
        localStorage.removeItem('voiceoverData'); // Clear corrupted data
      } finally {
        setIsLoading(false);
      }
    };
    loadPersistedVoice();
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate a voiceover.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const { audioUrl: url, base64Audio } = await generateVoiceover(
        text, emotion, intensity, environment, reverb, echo, noiseGate, backgroundMusic, musicVolume
      );
      setAudioUrl(url);
      
      const voiceData = { 
        base64Audio, text, emotion, intensity, environment,
        reverb, echo, noiseGate, backgroundMusic, musicVolume
      };
      localStorage.setItem('voiceoverData', JSON.stringify(voiceData));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate voiceover: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [text, emotion, intensity, environment, reverb, echo, noiseGate, backgroundMusic, musicVolume]);

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const handleAudioLoaded = () => {
    if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.volume = volume;
    }
  };
  
  const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 p-4 rounded-lg border border-gray-700/50">
        <h3 className="text-amber-300 font-semibold tracking-wider uppercase text-xs mb-4">{title}</h3>
        {children}
    </div>
  );

  const ControlWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-400 mb-2">{title}</label>
      {children}
    </div>
  );

  const Select = ({ value, onChange, children, disabled }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode, disabled: boolean }) => (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-gray-800 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 focus:outline-none transition duration-300 appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem',
      }}
    >
      {children}
    </select>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200 flex flex-col items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-gray-900">
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 border border-gray-700/50">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-gray-900/50 rounded-full border border-gray-700">
            <VoiceIcon />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-400">
            Pro Voice Generator
          </h1>
          <p className="text-gray-400 mt-2 max-w-md">
            Craft the perfect voiceover with professional controls for performance and studio tuning.
          </p>
        </div>

        <div className="space-y-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter English text here..."
            className="w-full h-36 p-4 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 focus:outline-none transition duration-300 resize-none text-left text-lg leading-relaxed"
            disabled={isLoading}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ControlSection title="Voice Performance">
                <div className="space-y-4">
                    <ControlWrapper title="Emotional Tone">
                      <Select value={emotion} onChange={(e) => setEmotion(e.target.value)} disabled={isLoading}>
                        <option>Confident & Courageous</option>
                        <option>Calm & Reflective</option>
                        <option>Excited & Energetic</option>
                        <option>Sad & Somber</option>
                      </Select>
                    </ControlWrapper>
                     <ControlWrapper title="Vocal Intensity">
                        <Select value={intensity} onChange={(e) => setIntensity(e.target.value)} disabled={isLoading}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </Select>
                    </ControlWrapper>
                    <ControlWrapper title="Room Environment">
                      <Select value={environment} onChange={(e) => setEnvironment(e.target.value)} disabled={isLoading}>
                        <option>Studio</option>
                        <option>Large Hall</option>
                        <option>Intimate Room</option>
                      </Select>
                    </ControlWrapper>
                </div>
            </ControlSection>

            <ControlSection title="Studio Tune & Music">
                <div className="space-y-4">
                    <ControlWrapper title="Reverb">
                        <Select value={reverb} onChange={(e) => setReverb(e.target.value)} disabled={isLoading}>
                            <option>None</option><option>Subtle</option><option>Room</option><option>Hall</option><option>Cathedral</option>
                        </Select>
                    </ControlWrapper>
                     <ControlWrapper title="Echo">
                        <Select value={echo} onChange={(e) => setEcho(e.target.value)} disabled={isLoading}>
                            <option>None</option><option>Short Delay</option><option>Slapback</option><option>Long Delay</option>
                        </Select>
                    </ControlWrapper>
                    <ControlWrapper title="Music Style">
                        <Select value={backgroundMusic} onChange={(e) => setBackgroundMusic(e.target.value)} disabled={isLoading}>
                            <option>None</option><option>Uplifting Cinematic</option><option>Reflective Piano</option><option>Ambient Pad</option><option>Gentle Acoustic</option>
                        </Select>
                    </ControlWrapper>
                     <ControlWrapper title={`Music Volume: ${Math.round(musicVolume * 100)}%`}>
                       <input
                            type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                            disabled={isLoading || backgroundMusic === 'None'}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </ControlWrapper>
                     <div className="flex justify-between items-center bg-gray-800/50 p-2 rounded-md">
                        <label className="text-sm font-medium text-gray-400">Noise Gate</label>
                        <button 
                            onClick={() => setNoiseGate(!noiseGate)} disabled={isLoading} aria-pressed={noiseGate}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-400 ${noiseGate ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                           <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${noiseGate ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                </div>
            </ControlSection>
          </div>

          <button
            onClick={handleGenerate} disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 font-bold text-lg rounded-lg shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 transition-all duration-300 disabled:from-amber-700 disabled:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:scale-100"
          >
            {isLoading ? (<><Spinner /><span>Generating...</span></>) : 'Generate Voiceover'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="mt-6 p-4 bg-black/20 rounded-lg border border-gray-700/50">
            <audio ref={audioRef} controls autoPlay src={audioUrl} onLoadedData={handleAudioLoaded} className="w-full" aria-label="Generated voiceover audio player">
              Your browser does not support the audio element.
            </audio>
            <div className="flex items-center justify-between mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                 <span className="text-sm font-medium text-gray-400 hidden sm:inline">Speed:</span>
                 {[0.5, 1, 1.5, 2].map(rate => (
                    <button key={rate} onClick={() => handlePlaybackRateChange(rate)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${playbackRate === rate ? 'bg-amber-500 text-gray-900 font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
                        aria-pressed={playbackRate === rate}>
                        {rate}x
                    </button>
                 ))}
              </div>
              <div className="flex items-center space-x-2 flex-grow max-w-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500" aria-label="Volume control"/>
              </div>
            </div>

          </div>
        )}
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;