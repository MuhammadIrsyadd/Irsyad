// Tiny synthesized UI sound engine — no audio files needed. Each sound is
// a short oscillator blip with a quick gain envelope, in the spirit of
// macOS's soft window/dock click sounds. All playback is gated by the
// caller checking Settings > UI Sound Effects first.

// Master volume multiplier (1 = the original very quiet level). Raise it
// for louder UI sounds; keep the result well under ~0.5 to avoid clipping.
const VOLUME = 4;

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function blip(
  freqStart: number,
  freqEnd: number,
  duration: number,
  gainPeak: number,
  type: OscillatorType = "sine"
) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.min(gainPeak * VOLUME, 0.6), now + duration * 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const sound = {
  open: () => blip(420, 900, 0.14, 0.06),
  close: () => blip(700, 260, 0.13, 0.05),
  minimize: () => blip(500, 320, 0.1, 0.045),
  maximize: () => blip(500, 760, 0.12, 0.05),
  click: () => blip(600, 640, 0.045, 0.035),
  toggle: () => blip(760, 900, 0.06, 0.04),
};
