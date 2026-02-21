// src/app/components/app-achived.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-achived',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="focus-app">
      <div class="focus-card">
        <h1 class="title">Mode Focus</h1>

        <div class="time-input-container">
          <label for="focusTime">Temps de concentration (minutes)</label>
          <input 
            id="focusTime"
            type="number"
            min="5"
            max="90"
            [(ngModel)]="focusMinutes"
            class="time-input"
            placeholder="25"
            (input)="validateTime()" />
          <span class="error" *ngIf="timeError">{{ timeError }}</span>
        </div>

        <div class="timer-display">
          <span class="minutes">{{ minutes }}</span>
          <span class="separator">:</span>
          <span class="seconds">{{ seconds }}</span>
        </div>

        <div class="controls">
          @if(!isRunning){
            <button 
            class="btn primary" 
            (click)="toggleTimer()"
            [disabled]="!canStart">
            {{  'Démarrer' }}
          </button>
          }

          <button 
            class="btn secondary" 
            (click)="resetTimer()"
            [disabled]="!isRunning">
            Réinitialiser
          </button>
        </div>

        <div class="stats">
          <div class="points">
            <span class="label">Points</span>
            <span class="value">{{ points }}</span>
          </div>

          <div class="badges" *ngIf="badges.length">
            <span *ngFor="let badge of badges" class="badge">
              {{ badge }}
            </span>
          </div>
        </div>

        <div class="quote" *ngIf="currentQuote">
          <blockquote>“{{ currentQuote }}”</blockquote>
        </div>
      </div>
    </main>
  `,
  styles: `
    .focus-app {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1d212eff 0%, #20202bff 100%);
      color: #e2e8f0;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 1.5rem;
    }

    .focus-card {
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      text-align: center;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .title {
      font-size: 2.4rem;
      font-weight: 700;
      color: #c7d2fe;
      margin-bottom: 2rem;
    }

    .time-input-container {
      margin-bottom: 2rem;
      text-align: left;
    }

    .time-input-container label {
      display: block;
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }

    .time-input {
      width: 100%;
      max-width: 120px;
      padding: 0.8rem;
      font-size: 1.3rem;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      color: #e2e8f0;
      text-align: center;
    }

    .error {
      color: #ef4444;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      display: block;
    }

    .timer-display {
      font-size: 5.5rem;
      font-weight: 300;
      color: #c7d2fe;
      margin: 1.5rem 0 2rem;
      letter-spacing: 0.15rem;
    }

    .minutes, .seconds {
      display: inline-block;
      min-width: 4.5rem;
    }

    .separator {
      margin: 0 0.2rem;
      opacity: 0.6;
    }

    .controls {
      display: flex;
      gap: 1.2rem;
      justify-content: center;
      margin-bottom: 2.5rem;
    }

    .btn {
      padding: 0.9rem 2rem;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .primary {
      background: #6366f1;
      color: white;
    }

    .primary:hover {
      background: #4f46e5;
      transform: translateY(-2px);
    }

    .primary.active {
      background: #ef4444;
    }

    .secondary {
      background: rgba(255,255,255,0.1);
      color: #c7d2fe;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .secondary:hover {
      background: rgba(255,255,255,0.15);
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 2rem 0;
    }

    .points, .badges {
      background: rgba(255,255,255,0.08);
      padding: 1rem 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .label {
      display: block;
      font-size: 0.95rem;
      color: #94a3b8;
      margin-bottom: 0.3rem;
    }

    .value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #c7d2fe;
    }

    .badge {
      background: rgba(99,102,241,0.15);
      color: #c7d2fe;
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.9rem;
      margin: 0.3rem;
      border: 1px solid rgba(99,102,241,0.3);
    }

    .quote {
      margin: 2.5rem 0;
      font-size: 1.15rem;
      color: #94a3b8;
      font-style: italic;
      line-height: 1.6;
      padding: 1.5rem;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      border-left: 4px solid #6366f1;
    }
  `
})
export default class AchivedComponent {
  // Temps par défaut : 25 min
  defaultDuration = 25 * 60;
  focusMinutes = 25; // Temps choisi par l'utilisateur
  timer = this.defaultDuration;
  intervalId: any;
  isRunning = false;
  points = 0;
  badges: string[] = [];
  quotes: string[] = [
    "Le succès est la somme de petits efforts répétés jour après jour.",
    "Fais de ton mieux, c'est tout ce qui compte.",
    "La discipline est le pont entre les objectifs et la réussite.",
    "Chaque tâche accomplie te rapproche de ton rêve.",
    "La persévérance finit toujours par payer."
  ];
  currentQuote = '';

  timeError = '';

  get minutes() {
    return Math.floor(this.timer / 60).toString().padStart(2, '0');
  }

  get seconds() {
    return (this.timer % 60).toString().padStart(2, '0');
  }

  get canStart() {
    return this.focusMinutes >= 5 && this.focusMinutes <= 90 && !this.isRunning;
  }

  validateTime() {
    if (this.focusMinutes < 5) {
      this.timeError = 'Minimum 5 minutes';
    } else if (this.focusMinutes > 90) {
      this.timeError = 'Maximum 90 minutes';
    } else {
      this.timeError = '';
      this.timer = this.focusMinutes * 60;
    }
  }

  toggleTimer() {
    if (!this.canStart && !this.isRunning) return;

    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.completePomodoro();
        }
      }, 1000);
    } else {
      this.isRunning = false;
      clearInterval(this.intervalId);
    }
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.timer = this.focusMinutes * 60;
    this.isRunning = false;
  }

  completePomodoro() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.timer = this.focusMinutes * 60;
    this.points += 10;

    if (this.points % 30 === 0) {
      const badge = `Cycle x${this.points / 10}`;
      this.badges.push(badge);
    }

    this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }
}