import { Howl } from 'howler';

// Synthesized audio buffers using Web Audio API / Howler fallbacks
class SoundManager {
  constructor() {
    this.muted = false;
    this.sounds = {
      click: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
        volume: 0.3
      }),
      correct: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'],
        volume: 0.5
      }),
      wrong: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'],
        volume: 0.4
      }),
      levelup: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'],
        volume: 0.6
      }),
      victory: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'],
        volume: 0.6
      })
    };
  }

  play(soundName) {
    if (this.muted) return;
    try {
      if (this.sounds[soundName]) {
        this.sounds[soundName].play();
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    Object.values(this.sounds).forEach(sound => sound.mute(this.muted));
    return this.muted;
  }
}

export const soundFx = new SoundManager();
