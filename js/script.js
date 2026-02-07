/**
 * Jadoo - Alien Interface System
 */

class JadooSystem {
  constructor() {
    this.fullscreenActive = false;
    this.keySequence = ['B', 'C', 'F', 'E', 'B', 'C', 'E', 'D', 'B', 'C', 'F', 'E', 'D', 'E'];
    this.currentKeyIndex = 0;
    this.sequenceComplete = false;
    this.mathUpdateInterval = null;
    this.signalUpdateInterval = null;
    
    this.cacheElements();
    this.setupListeners();
  }

  cacheElements() {
    this.enterScreen = document.querySelector('.enter-screen');
    this.monitor = document.getElementById('monitor');
    this.quadrantContainer = document.querySelector('.quadrant-container');
    this.circlesContainer = document.querySelector('.circles-container');
    this.prompt = document.querySelector('.prompt');
    this.sending = document.querySelector('.sending');
    this.receiving = document.querySelector('.receiving');
    this.header = document.querySelector('.header');
    this.seaTopLeft = document.querySelector('.sea-top-left');
    this.seaTopRight = document.querySelector('.sea-top-right');
    this.seaTopLeftBlue = document.querySelector('.sea-top-left-blue');
    this.seaTopRightMagenta = document.querySelector('.sea-top-right-magenta');
    this.mathCalculations = document.querySelector('.math-calculations');
    this.signalInfo = document.querySelector('.signal-info');
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.toggleFullscreen();
      return;
    }

    if (e.keyCode >= 66 && e.keyCode <= 70) {
      if (!this.fullscreenActive || this.sequenceComplete) {
        return;
      }

      const keyChar = String.fromCharCode(e.keyCode);
      const expectedKey = this.keySequence[this.currentKeyIndex];

      if (keyChar === expectedKey) {
        e.preventDefault();
        this.playAudio(e.keyCode);
        this.showSignalFeedback();
        setTimeout(() => {
          this.moveToNextKey();
        }, 200);
      }
    }
  }

  moveToNextKey() {
    this.currentKeyIndex++;
    
    if (this.currentKeyIndex >= this.keySequence.length) {
      this.sequenceComplete = true;
      this.showReceivingSequence();
      return;
    }
    
    this.updatePromptDisplay();
  }

  updatePromptDisplay() {
    const promptKeys = document.querySelector('.prompt-keys');
    if (promptKeys) {
      promptKeys.textContent = this.keySequence[this.currentKeyIndex];
    }
  }

  showSignalFeedback() {
    if (!this.sending) return;
    
    // Hide receiving if it's showing
    if (this.receiving) this.receiving.classList.add('hidden');
    if (this.seaTopRightMagenta) this.seaTopRightMagenta.classList.add('hidden');
    if (this.seaTopRight) this.seaTopRight.classList.remove('hidden');
    
    // Show sending with ellipsis animation
    this.sending.classList.remove('hidden');
    this.sending.textContent = 'SENDING...';
    
    // Hide green left grid and show blue grid
    if (this.seaTopLeft) this.seaTopLeft.classList.add('hidden');
    if (this.seaTopLeftBlue) this.seaTopLeftBlue.classList.remove('hidden');
    
    // Show math calculations in bottom-right
    if (this.mathCalculations) {
      this.mathCalculations.classList.remove('hidden');
      if (this.signalInfo) this.signalInfo.classList.add('hidden');
      this.updateMathCalculations();
    }
  }

  showReceivingSequence() {
    if (!this.receiving) return;
    
    // Hide sending and blue grid
    if (this.sending) this.sending.classList.add('hidden');
    if (this.seaTopLeftBlue) this.seaTopLeftBlue.classList.add('hidden');
    if (this.seaTopLeft) this.seaTopLeft.classList.remove('hidden');
    if (this.mathCalculations) this.mathCalculations.classList.add('hidden');
    
    // Show receiving in magenta
    this.receiving.classList.remove('hidden');
    this.receiving.textContent = 'RECEIVING';
    
    // Hide green right grid and show magenta grid
    if (this.seaTopRight) this.seaTopRight.classList.add('hidden');
    if (this.seaTopRightMagenta) this.seaTopRightMagenta.classList.remove('hidden');
    
    // Show signal info
    if (this.signalInfo) this.signalInfo.classList.remove('hidden');
    
    const receivingAudio = document.getElementById('receivingAudio');
    if (receivingAudio) {
      receivingAudio.currentTime = 0;
      receivingAudio.play().catch(err => {
        console.log('Could not play receiving audio:', err);
      });
      
      // Wait for the audio to finish playing before hiding the text
      const hideTextWhenAudioEnds = () => {
        this.receiving.classList.add('hidden');
        if (this.seaTopRightMagenta) this.seaTopRightMagenta.classList.add('hidden');
        if (this.seaTopRight) this.seaTopRight.classList.remove('hidden');
        this.resetSequence();
        // Show signal info and math after receiving completes
        if (this.signalInfo) this.signalInfo.classList.remove('hidden');
        if (this.mathCalculations) this.mathCalculations.classList.add('hidden');
        receivingAudio.removeEventListener('ended', hideTextWhenAudioEnds);
      };
      
      receivingAudio.addEventListener('ended', hideTextWhenAudioEnds);
    }
  }

  resetSequence() {
    this.currentKeyIndex = 0;
    this.sequenceComplete = false;
    this.updatePromptDisplay();
  }

  updateMathCalculations() {
    if (!this.mathCalculations) return;
    
    const mathLines = this.mathCalculations.querySelectorAll('.math-line');
    
    const generateComplexMath = () => {
      const expressions = [
        // Frequency domain analysis
        `FFT[${Math.floor(Math.random() * 1000)}] = ${(Math.random() * 10).toFixed(4)}e^(i${(Math.random() * 360).toFixed(1)}°)`,
        // Quantum state calculations
        `|ψ⟩ = ${(Math.random()).toFixed(3)}|0⟩ + ${(Math.random()).toFixed(3)}|1⟩`,
        // Signal processing
        `H(z) = ${Math.floor(Math.random() * 999)}/z^${Math.floor(Math.random() * 20) + 1}`,
        // Matrix operations
        `det(M) = ${Math.floor(Math.random() * 999999 - 500000)} | tr(M) = ${Math.floor(Math.random() * 100)}`,
        // Fourier transforms
        `F(ω) = ∫[-∞,∞] f(t)e^(-iωt)dt = ${(Math.random() * 100).toFixed(2)}`,
        // Differential equations
        `d²x/dt² + ${Math.floor(Math.random() * 20)}dx/dt + ${Math.floor(Math.random() * 50)}x = ${Math.floor(Math.random() * 1000)}`,
        // Eigenvalue decomposition
        `λ${Math.floor(Math.random() * 10)} = ${(Math.random() * 100 - 50).toFixed(3)} | v = [${(Math.random()).toFixed(2)}, ${(Math.random()).toFixed(2)}, ${(Math.random()).toFixed(2)}]`,
        // Complex number operations
        `z = ${Math.floor(Math.random() * 100)} + ${Math.floor(Math.random() * 100)}i | |z| = ${(Math.sqrt(Math.random() * 20000)).toFixed(1)}`,
        // Convolution
        `(f*g)(t) = ∫ f(τ)g(t-τ)dτ = ${(Math.random() * 50).toFixed(3)}`,
        // Laplace transform
        `L{f(t)} = ∫[0,∞] f(t)e^(-st)dt = ${Math.floor(Math.random() * 10000)}/(s+${Math.floor(Math.random() * 100)})`,
        // Transfer function
        `G(s) = ${Math.floor(Math.random() * 1000)}s^2 / (s^3 + ${Math.floor(Math.random() * 100)}s^2 + ${Math.floor(Math.random() * 100)}s + 1)`,
        // Frequency response
        `|H(f)| = ${(Math.random() * 2).toFixed(3)} @ f = ${Math.floor(Math.random() * 2000)}Hz | ∠H(f) = ${(Math.random() * 360).toFixed(1)}°`,
        // Antenna array pattern
        `E_array = ∑[n=0,N] E_0 e^(jnkdsinθ) = ${(Math.random() * 100).toFixed(2)} @ θ=${(Math.random() * 180).toFixed(1)}°`,
        // Modulation index
        `m = ${(Math.random() * 2).toFixed(3)} | BW = 2(${Math.floor(Math.random() * 50)} + 1)f_m = ${Math.floor(Math.random() * 10000)}Hz`,
        // Signal-to-noise ratio
        `SNR = ${(10 * Math.log10(Math.random() * 1000)).toFixed(2)}dB | SINR = ${(10 * Math.log10(Math.random() * 500)).toFixed(2)}dB`,
        // Correlation coefficient
        `ρ(τ) = ${(Math.random() * 2 - 1).toFixed(4)} @ τ=${(Math.random() * 100).toFixed(2)}μs`,
      ];
      return expressions[Math.floor(Math.random() * expressions.length)];
    };
    
    // Initial population
    mathLines.forEach((line) => {
      line.textContent = generateComplexMath();
    });
    
    // Continuous update with very fast refresh
    this.mathUpdateInterval = setInterval(() => {
      if (!this.mathCalculations.classList.contains('hidden')) {
        const mathLines = this.mathCalculations.querySelectorAll('.math-line');
        mathLines.forEach((line, index) => {
          // Random updates - not all lines update at the same time
          if (Math.random() > 0.3) {
            line.textContent = generateComplexMath();
          }
        });
      }
    }, 800);
  }

  updateSignalValues() {
    if (!this.signalInfo) return;
    
    // Update various signal parameters periodically
    this.signalUpdateInterval = setInterval(() => {
      if (this.signalInfo && !this.signalInfo.classList.contains('hidden')) {
        const lines = this.signalInfo.querySelectorAll('.info-line .value');
        if (lines.length > 0) {
          // Update a random value
          const randomIndex = Math.floor(Math.random() * (lines.length - 1));
          lines[randomIndex].textContent = Math.floor(Math.random() * 360) + '°';
        }
      }
    }, 3000);
  }

  toggleFullscreen() {
    if (!this.fullscreenActive) {
      this.activateInterface();
    } else {
      this.deactivateInterface();
    }
  }

  activateInterface() {
    this.fullscreenActive = true;
    
    if (this.monitor) {
      this.monitor.style.backgroundColor = '#161913';
    }
    
    if (this.enterScreen) {
      this.enterScreen.classList.add('hidden');
    }
    
    this.showElements();
    
    // Keep sea elements hidden - sound waves now appear in quadrants
    if (this.seaLeft) this.seaLeft.classList.add('hidden');
    if (this.seaRight) this.seaRight.classList.add('hidden');
    
    // Show signal info by default
    if (this.signalInfo) this.signalInfo.classList.remove('hidden');
    if (this.mathCalculations) this.mathCalculations.classList.add('hidden');
    
    this.currentKeyIndex = 0;
    this.sequenceComplete = false;
    this.updatePromptDisplay();
    
    // Start continuous math calculations (but hidden for now)
    this.updateMathCalculations();
    this.updateSignalValues();
    
    this.requestFullscreen();
  }

  deactivateInterface() {
    this.fullscreenActive = false;
    this.exitFullscreen();
    
    // Clear intervals if they exist
    if (this.mathUpdateInterval) {
      clearInterval(this.mathUpdateInterval);
    }
    if (this.signalUpdateInterval) {
      clearInterval(this.signalUpdateInterval);
    }
    
    this.hideElements();
    
    if (this.enterScreen) {
      this.enterScreen.classList.remove('hidden');
    }
    
    if (this.monitor) {
      this.monitor.style.backgroundColor = 'transparent';
    }
  }

  showElements() {
    const elements = [
      this.circlesContainer, this.garbageRight,
      this.prompt, this.header,
      this.seaLeft, this.seaRight, this.quadrantContainer
    ];
    
    elements.forEach(el => {
      if (el) el.classList.remove('hidden');
    });
  }

  hideElements() {
    const elements = [
      this.circlesContainer, this.garbageRight,
      this.prompt, this.header,
      this.seaLeft, this.seaRight, this.quadrantContainer
    ];
    
    elements.forEach(el => {
      if (el) el.classList.add('hidden');
    });
  }

  playAudio(keyCode) {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log('Could not play audio:', err);
      });
    }
  }

  requestFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.log('Fullscreen request failed:', err);
      });
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jadooSystem = new JadooSystem();
});
