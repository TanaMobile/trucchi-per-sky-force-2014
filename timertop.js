// timer.js
// Timer e countdown con callback e possibilità di pausa e reset

class Timer {
  constructor(durationMs, onTick = null, onComplete = null) {
    this.duration = durationMs;
    this.onTick = typeof onTick === 'function' ? onTick : () => {};
    this.onComplete = typeof onComplete === 'function' ? onComplete : () => {};
    this.remaining = durationMs;
    this._timerId = null;
    this._startTime = null;
    this._paused = false;
  }

  start() {
    if (this._timerId) return; // già avviato
    this._paused = false;
    this._startTime = Date.now();
    this._tick();
  }

  _tick() {
    this._timerId = requestAnimationFrame(() => {
      if (this._paused) return;

      const elapsed = Date.now() - this._startTime;
      this.remaining = Math.max(this.duration - elapsed, 0);
      this.onTick(this.remaining);

      if (this.remaining > 0) {
        this._tick();
      } else {
        this.onComplete();
        this._timerId = null;
      }
    });
  }

  pause() {
    if (this._paused || !this._timerId) return;
    this._paused = true;
    cancelAnimationFrame(this._timerId);
    this._timerId = null;
    this.duration = this.remaining;
  }

  reset(newDurationMs) {
    this.pause();
    this.duration = newDurationMs !== undefined ? newDurationMs : this.duration;
    this.remaining = this.duration;
  }
}

// Uso esempio:
// const timer = new Timer(5000, rem => console.log(`Rimangono ${rem} ms`), () => console.log('Finito!'));
// timer.start();

export default Timer;
