import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-achived',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="focus-mode">
      <h2 style="color:#000;font-weight:800">Mode Focus 💆</h2>
      <div class="timer-container">
        <div class="timer-display">{{ minutes }}:{{ seconds }}</div>
        <button (click)="toggleTimer()" [disabled]="isRunning" class="start-btn">Démarrer</button>
        <button (click)="resetTimer()" [disabled]="!isRunning" style="padding:0.8rem;color:white">Réinitialiser</button>
      </div>
      <div class="points-badges">
        <div class="points">Points : <b>{{ points }}</b></div>
        <div class="badges">
          <span *ngFor="let badge of badges" class="badge">🏅 {{ badge }}</span>
        </div>
      </div>
      <div class="quote" *ngIf="currentQuote">
        <em>“{{ currentQuote }}”</em>
      </div>
      <div *ngIf="showRoulette" class="roulette-overlay">
        <div class="roulette-modal">
          <h3>🎡 Roulette de Pause Créative</h3>
          <div class="roulette-wheel">
            <div class="activity">{{ selectedActivity ? selectedActivity.label : 'Clique sur "Lancer la roulette" !' }}</div>
          </div>
          <button (click)="spinRoulette()" [disabled]="spinning" class="spin-btn">Lancer la roulette</button>
          <button *ngIf="selectedActivity && selectedActivity.type === 'minigame'" (click)="startMiniGame()" class="minigame-btn">Jouer au mini-jeu</button>
          <div *ngIf="showMiniGame" class="minigame">
            <ng-container [ngSwitch]="miniGameType">
              <div *ngSwitchCase="'guessNumber'">
                <p>Devine le nombre entre 1 et 5 :</p>
                <input type="number" min="1" max="5" [(ngModel)]="guessInput" class="guess-input" />
                <button (click)="checkGuess()">Valider</button>
                <div *ngIf="guessResult" class="guess-result">{{ guessResult }}</div>
              </div>
            </ng-container>
          </div>
          <button (click)="closeRoulette()" class="close-btn">Fermer</button>
        </div>
      </div>
    </main>
  `,
  styles: `
    .roulette-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .roulette-modal {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 4px 24px #0002;
      padding: 2rem 1.5rem 1.5rem 1.5rem;
      min-width: 320px;
      text-align: center;
      position: relative;
      animation: popin 0.3s cubic-bezier(.68,-0.55,.27,1.55);
    }
    @keyframes popin {
      0% { transform: scale(0.7); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .roulette-wheel {
      margin: 1.2rem 0 1.5rem 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #6c63ff;
      min-height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .spin-btn, .close-btn, .minigame-btn {
      background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
      color: #222;
      border: none;
      border-radius: 1rem;
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      margin: 0.5rem 0.5rem 0 0.5rem;
      cursor: pointer;
      box-shadow: 0 2px 8px #38f9d733;
      transition: background 0.2s;
    }
    .spin-btn[disabled] {
      background: #e0e0e0;
      color: #aaa;
      cursor: not-allowed;
    }
    .minigame {
      margin: 1rem 0 0.5rem 0;
      background: #f3f0ff;
      border-radius: 1rem;
      padding: 1rem;
      color: #6c63ff;
      font-size: 1rem;
    }
    .guess-input {
      width: 3rem;
      text-align: center;
      margin: 0 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid #b3b3ff;
      padding: 0.2rem 0.5rem;
    }
    .guess-result {
      margin-top: 0.5rem;
      font-weight: 600;
      color: #43e97b;
    }
    .focus-mode {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
      border-radius: 1.5rem;
      box-shadow: 0 2px 16px #0001;
      text-align: center;
    }
    .timer-container {
      margin: 2rem 0 1rem 0;
    }
    .timer-display {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1rem;
      color: #6c63ff;
      letter-spacing: 2px;
      text-shadow: 0 2px 8px #b3b3ff44;
    }
    .start-btn {
      background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
      color: #222;
      border: none;
      border-radius: 1rem;
      padding: 0.7rem 2rem;
      font-size: 1.1rem;
      margin-right: 1rem;
      cursor: pointer;
      box-shadow: 0 2px 8px #38f9d733;
      transition: background 0.2s;
    }
    .start-btn[disabled] {
      background: #e0e0e0;
      color: #aaa;
      cursor: not-allowed;
    }
    .points-badges {
      margin: 1.5rem 0;
    }
    .points {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: #4f8cff;
      font-weight: 600;
    }
    .badges {
      margin-top: 0.5rem;
    }
    .badge {
      background: linear-gradient(90deg, #ffe082 0%, #ffd6e0 100%);
      color: #6c63ff;
      border-radius: 1rem;
      padding: 0.2rem 0.8rem;
      margin: 0 0.2rem;
      font-size: 1rem;
      display: inline-block;
      box-shadow: 0 1px 4px #ffd6e055;
    }
    .quote {
      margin-top: 2rem;
      font-size: 1.1rem;
      color: #6c63ff;
      background: #f3f0ff;
      border-radius: 1rem;
      padding: 0.7rem 1.2rem;
      display: inline-block;
      box-shadow: 0 1px 4px #b3b3ff22;
    }
  `
})
export default class AchivedComponent {
  pomodoroDuration = 60 * 60; // 25 minutes
  timer = this.pomodoroDuration;
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

  // Roulette de pause créative
  showRoulette = false;
  spinning = false;
  selectedActivity: any = null;
  activities = [
    { label: 'Étirement express : lève les bras et touche le ciel !', type: 'activity' },
    { label: 'Mini-jeu : devine le nombre secret !', type: 'minigame' },
    { label: 'Respiration : inspire 4s, expire 4s, répète 3 fois.', type: 'activity' },
    { label: 'Citation : “Le bonheur n’est réel que lorsqu’il est partagé.”', type: 'activity' },
    { label: 'Défi : souris à toi-même dans le miroir !', type: 'activity' },
    { label: 'Mini-jeu : devine le nombre secret !', type: 'minigame' },
    { label: 'Pause fun : invente une devinette en 30s.', type: 'activity' },
    { label: 'Micro-méditation : ferme les yeux 20s.', type: 'activity' }
  ];
  // Mini-jeu : devine le nombre
  showMiniGame = false;
  miniGameType = '';
  secretNumber = 0;
  guessInput: number | null = null;
  guessResult = '';

  get minutes() {
    return Math.floor(this.timer / 60);
  }
  get seconds() {
    return (this.timer % 60).toString().padStart(2, '0');
  }

  toggleTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.completePomodoro();
        }
      }, 1000);
    }
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.timer = this.pomodoroDuration;
    this.isRunning = false;
  }

  completePomodoro() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.timer = this.pomodoroDuration;
    this.points += 10;
    // Débloquer un badge tous les 3 cycles
    if (this.points % 30 === 0) {
      const badge = `Cycle x${this.points / 10}`;
      this.badges.push(badge);
    }
    // Afficher une citation aléatoire
    this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    // Afficher la roulette de pause créative
    this.showRoulette = true;
    this.selectedActivity = null;
    this.showMiniGame = false;
    this.guessInput = null;
    this.guessResult = '';
  }

  spinRoulette() {
    this.spinning = true;
    this.selectedActivity = null;
    this.showMiniGame = false;
    this.guessInput = null;
    this.guessResult = '';
    setTimeout(() => {
      const idx = Math.floor(Math.random() * this.activities.length);
      this.selectedActivity = this.activities[idx];
      this.spinning = false;
    }, 900);
  }

  closeRoulette() {
    this.showRoulette = false;
    this.selectedActivity = null;
    this.showMiniGame = false;
    this.guessInput = null;
    this.guessResult = '';
  }

  startMiniGame() {
    this.showMiniGame = true;
    this.miniGameType = 'guessNumber';
    this.secretNumber = Math.floor(Math.random() * 5) + 1;
    this.guessInput = null;
    this.guessResult = '';
  }

  checkGuess() {
    if (this.guessInput === this.secretNumber) {
      this.guessResult = 'Bravo ! Tu as trouvé le nombre secret 🎉';
    } else {
      this.guessResult = 'Raté ! Essaie encore...';
    }
  }
}