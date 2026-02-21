import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { Infos } from '../../../core/models/infos.model';
import { Project } from '../../../core/models/project.model';
import { Timestamp } from '@angular/fire/firestore';
import { ProjectListComponent } from "../projects/project-list/project-list.component";

@Component({
  selector: 'app-folio',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    AsyncPipe,
    DatePipe,
    ProjectListComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      <!-- Fond animé subtil -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#8b5cf6_0%,transparent_50%)] animate-pulse-slow"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#22d3ee_0%,transparent_50%)] animate-pulse-slow delay-1000"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6 py-12 md:py-20">
        <!-- Hero avec animation à la place de l'avatar -->
        <section class="text-center py-20 md:py-32 relative">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <!-- Canvas d'animation néon/particules -->
            <canvas #particlesCanvas class="w-full h-full max-w-[600px] max-h-[600px]"></canvas>
          </div>

          <div class="relative z-10">
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse-slow">
              Portfolio
            </h1>

            <p class="mt-6 text-3xl md:text-5xl font-medium text-white/90">
              {{ (profile$ | async)?.prenom || 'Prénom' }} {{ (profile$ | async)?.nom || 'Nom' }}
            </p>

            <p class="mt-4 text-2xl md:text-3xl text-cyan-300 font-light">
              {{ (profile$ | async)?.titre || 'Créateur · Développeur · Visionnaire' }}
            </p>

            <div class="mt-10 inline-flex items-center gap-4">
              <div class="px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-cyan-500/30 text-cyan-300 font-medium shadow-lg">
                {{ (profile$ | async)?.bio ? 'Passionné & Créatif' : 'En construction' }}
              </div>
            </div>
          </div>
        </section>

        <!-- Bio -->
        @if ((profile$ | async)?.bio) {
          <section class="max-w-5xl mx-auto mb-20">
            <div class="glass rounded-3xl p-8 md:p-12 border border-slate-700/40 shadow-2xl shadow-violet-900/20">
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center gap-4">
                <mat-icon class="text-5xl text-cyan-400 animate-pulse">auto_awesome</mat-icon>
                À propos de moi
              </h2>
              <p class="text-slate-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {{ (profile$ | async)?.bio }}
              </p>
            </div>
          </section>
        }

        <!-- Projets -->
        <section>
          <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Mes Réalisations
          </h2>

          <app-project-list />
        </section>

        <!-- Bouton Télécharger -->
        <div class="text-center mt-24">
          <button 
            mat-flat-button 
            class="group relative px-12 py-6 bg-gradient-to-r from-violet-600 via-cyan-600 to-violet-600 text-white font-bold text-xl rounded-full overflow-hidden shadow-2xl hover:shadow-[0_0_60px_-10px] hover:shadow-violet-600/70 transition-all duration-500 transform hover:scale-110"
          >
            <span class="relative z-10 flex items-center gap-4">
              <mat-icon class="text-3xl group-hover:rotate-12 transition-transform">download</mat-icon>
              Télécharger mon portfolio complet (HTML)
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-violet-500/40 to-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

        <!-- Footer -->
        <footer class="text-center py-16 mt-20 text-slate-600 border-t border-slate-800/50">
          © {{ currentYear }} • {{ (profile$ | async)?.prenom }} {{ (profile$ | async)?.nom }} • 
          {{ (profile$ | async)?.titre || 'Portfolio personnel' }}
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .glass {
      background: rgba(15, 23, 42, 0.75);
    }
    .animate-pulse-slow {
      animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
  `]
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('particlesCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private auth = inject(AuthService);
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);

  profile$ = this.auth.user.pipe(
    switchMap(user => user ? this.fs.getUserProfile(user.uid) : of(null))
  );

  projects$ = this.auth.user.pipe(
    switchMap(user => user ? this.fs.getUserProjects(user.uid) : of([]))
  );

  currentYear = new Date().getFullYear();

  ngAfterViewInit() {
    this.initParticlesAnimation();
  }

  private initParticlesAnimation() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });

    const particles: { x: number; y: number; radius: number; vx: number; vy: number; color: string }[] = [];
    const colors = ['#8b5cf6', '#22d3ee', '#a78bfa', '#06b6d4'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Lignes de connexion
        particles.forEach(other => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.sqrt(dx*dx + dy*dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (120 - distance) / 120 * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  // ... le reste de ton code (generateAndDownloadHTML, buildPortfolioHTML, downloadHTML, formateDate) reste identique
}