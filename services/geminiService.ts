import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData, bufferToWave } from '../utils/audioUtils';

const buildPrompt = (
  text: string,
  emotion: string,
  intensity: string,
  environment: string,
  reverb: string,
  echo: string,
  noiseGate: boolean,
  backgroundMusic: string,
  musicVolume: number
): string => {
  let prompt = `As a world-class audio engineer and voice actor, produce a natural-sounding audio production of the following text: "${text}"\n\n`;
  prompt += `Apply the following production notes meticulously:\n`;

  // --- Voice Performance ---
  prompt += '— Voice Talent: A deep, professional male voice with a rich, warm timbre and exceptionally clear articulation.\n';
  let performanceStyle = 'The delivery should feel authentic and human, with natural pacing and cadence. It should be';
  switch (intensity) {
    case 'Low': performanceStyle += ' subtly'; break;
    case 'High': performanceStyle += ' strongly'; break;
    default: // Medium
  }
  switch (emotion) {
    case 'Calm & Reflective':
      performanceStyle += ' calm, spiritually uplifting, and reflective. The delivery should be slow and clear, conveying a deep sense of peace.';
      break;
    case 'Excited & Energetic':
      performanceStyle += ' excited, energetic, and enthusiastic. The delivery should be bright and dynamic, conveying authentic passion.';
      break;
    case 'Sad & Somber':
      performanceStyle += ' sad, somber, and melancholic. The delivery should be slow and gentle, conveying genuine, deep emotion.';
      break;
    default: // Confident & Courageous
      performanceStyle += ' emotional, courageous, and confident. The voice should convey strength and conviction, suitable for a powerful motivational speech.';
      break;
  }
  prompt += `— Performance Direction: ${performanceStyle}\n`;

  // --- Audio Engineering & Post-Processing ---
  let engineeringNotes = [];
  switch (environment) {
    case 'Large Hall': engineeringNotes.push('place the voice in a space with the acoustics of a large hall with natural echo'); break;
    case 'Intimate Room': engineeringNotes.push('place the voice in a small, intimate space for a warm, close, and personal sound'); break;
    default: engineeringNotes.push('the voice should have a clean, dry sound as if recorded in a professional, acoustically-treated studio'); break;
  }
  switch (reverb) {
    case 'Subtle': engineeringNotes.push('apply a subtle reverb effect'); break;
    case 'Room': engineeringNotes.push('apply a clear room reverb'); break;
    case 'Hall': engineeringNotes.push('apply a concert hall reverb'); break;
    case 'Cathedral': engineeringNotes.push('apply a vast, cathedral-like reverb'); break;
  }
  switch (echo) {
    case 'Short Delay': engineeringNotes.push('add a short, tight echo delay'); break;
    case 'Slapback': engineeringNotes.push('add a classic slapback echo effect'); break;
    case 'Long Delay': engineeringNotes.push('add a long, trailing echo effect'); break;
  }
  if (noiseGate) {
    engineeringNotes.push('apply a noise gate to eliminate any low-level background noise between words for an ultra-clean recording');
  }
  if (engineeringNotes.length > 0) {
      prompt += `— Audio Mix: The effects should be blended seamlessly to enhance the performance, not distract from it. Specifically: ${engineeringNotes.join(', ')}.\n`;
  }

  // --- Background Music ---
  if (backgroundMusic !== 'None') {
    let musicStyleDescription = '';
    switch(backgroundMusic) {
        case 'Uplifting Cinematic': musicStyleDescription = 'an uplifting and inspiring cinematic score'; break;
        case 'Reflective Piano': musicStyleDescription = 'a gentle and reflective piano melody'; break;
        case 'Ambient Pad': musicStyleDescription = 'a calm and atmospheric ambient pad'; break;
        case 'Gentle Acoustic': musicStyleDescription = 'a warm and hopeful acoustic guitar track'; break;
        default: musicStyleDescription = backgroundMusic.toLowerCase();
    }
    let musicNote = `Add a copyright-free background music track in the style of ${musicStyleDescription}. The music should be expertly mixed to complement the voice, creating a cohesive and immersive soundscape.`;
    if (musicVolume < 0.25) {
        musicNote += ' The music should be mixed very subtly in the background.';
    } else if (musicVolume < 0.6) {
        musicNote += ' The music should be present but not distracting, mixed clearly behind the voice.';
    } else {
        musicNote += ' The music should be prominent, creating a strong emotional atmosphere alongside the voice.';
    }
    prompt += `— Background Music: ${musicNote}\n`;
  }
  
  prompt += '\nCrucially, the final output must sound completely natural and human, as if recorded by a top-tier voice actor in a professional studio. Avoid any hint of a synthetic or robotic tone. The final audio output should be a complete production, with the voice mixed with any specified effects and music. Do not add any extra spoken words, introductions, or commentary.'

  return prompt;
}

export const generateVoiceover = async (
  text: string,
  emotion: string,
  intensity: string,
  environment: string,
  reverb: string,
  echo: string,
  noiseGate: boolean,
  backgroundMusic: string,
  musicVolume: number
): Promise<{ audioUrl: string, base64Audio: string }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fullPrompt = buildPrompt(text, emotion, intensity, environment, reverb, echo, noiseGate, backgroundMusic, musicVolume);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Fenrir is a deep male voice suitable for this.
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the API.");
    }
    
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const decodedBytes = decode(base64Audio);
    const audioBuffer = await decodeAudioData(decodedBytes, outputAudioContext, 24000, 1);
    
    const wavBlob = bufferToWave(audioBuffer);
    const audioUrl = URL.createObjectURL(wavBlob);
    
    return { audioUrl, base64Audio };

  } catch (error) {
    console.error("Error generating voiceover:", error);
    if (error instanceof Error) {
        throw new Error(error.message || 'Failed to communicate with Gemini API.');
    }
    throw new Error('An unknown error occurred during voiceover generation.');
  }
};