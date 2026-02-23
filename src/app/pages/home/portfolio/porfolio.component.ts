import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { Observable, of, switchMap } from 'rxjs';
import { DataService } from '../../../core/service/firebase/data.service';
import { BreakTextPipe } from "../../../pipe/break-text.pipe";
import { ToolInfo, TOOLS } from '../../../tools.constants';
import { Infos } from '../../../core/models/infos.model';
import { SimpleListComponent } from "../projects/project-list/simple-list.component";

@Component({
  selector: 'app-folio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    AsyncPipe,
    BreakTextPipe,
    SimpleListComponent
],
  template: `
    <div class="bg-background min-h-screen font-sans text-foreground relative overflow-hidden">
      <!-- Header fixe (Preview Mode) -->
      <div class="fixed top-0 left-0 right-0 bg-primary/95 text-primary-foreground backdrop-blur p-4 z-50 flex justify-between items-center shadow-lg">
        <div class="flex items-center gap-2">
          <a routerLink="/home/profil">
            <button mat-button class="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
              <mat-icon class="mr-2" fontSet="material-icons">arrow_back</mat-icon>
              Retour
            </button>
          </a>
        </div>

        <div class="text-sm font-mono bg-black/20 px-3 py-1 rounded hidden md:block">
          Mode Prévisualisation
        </div>

        <button mat-raised-button color="info" class="font-semibold">
          Publier maintenant
        </button>
      </div>

      <!-- Contenu principal -->
      <div class="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <!-- Hero Section -->
        <header class="mb-24 flex flex-col-reverse md:flex-row items-center gap-12 animate-fade-in">
          <div class="flex-1 space-y-6 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Bonjour, je suis <span class="text-primary">{{ data.Donneenom() }} {{ data.Donneeprenom() }}</span>.
            </h1>
           <!-- Titre professionnel mis en avant -->
<div class="relative mb-10 md:mb-12 text-center md:text-left">

  <div class="inline-flex items-center gap-4 px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl border border-violet-500/30 shadow-lg shadow-violet-900/20">
    <!-- Icône principale -->
    <div class="p-3 bg-cyan-600 rounded-lg shadow-md">
      <mat-icon class="text-white text-3xl md:text-4xl">work</mat-icon>
    </div>

    <!-- Texte du titre -->
    <div class="space-y-1">
      <p class="text-sm md:text-base text-violet-300/90 font-medium uppercase tracking-wider">
        Titre professionnel
      </p>
      <h3 class="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-violet-400 to-white-400 bg-clip-text text-transparent">
        {{ data.Donneetitre() || 'Non défini' }}
      </h3>
    </div>
  </div>
</div>

      @let profile = profile$ | async;

                <div class="mt-4">
                  <h4 class="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span class="material-icons text-violet-400 text-base">build</span>
                    Outils maitrisés
                  </h4>

                  <div class="flex flex-wrap gap-2">
                      <!-- {{data.Donneeskills()}} -->
                      @let toolInfo = getToolInfo(data.Donneeskills());
                      <span 
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-slate-800/70 border border-slate-700/50 text-slate-200 hover:bg-slate-700/70 hover:border-violet-600/50 transition-all duration-200 group">
                        <span class="material-icons text-base" [ngClass]="toolInfo.color">
                          {{ toolInfo.icon }}
                        </span>
                        {{ toolInfo.displayName || data.Donneeskills() }}
                      </span>
                  </div>
                </div>
             

          <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0 whitespace-pre-wrap">
  {{ data.Donneebio() | breakText:80 }}
</p>
            <div class="flex justify-center md:justify-start gap-4 pt-4">
              <button mat-raised-button color="primary" class="rounded-full px-8">Me contacter</button>
              <button mat-stroked-button class="rounded-full px-8">Voir mes projets</button>
            </div>
            <div class="flex justify-center md:justify-start gap-6 pt-8 text-muted-foreground">
              <mat-icon class="w-6 h-6 hover:text-foreground cursor-pointer transition-colors">code</mat-icon>
              <mat-icon class="w-6 h-6 hover:text-[#0077b5] cursor-pointer transition-colors">business</mat-icon>
              <mat-icon class="w-6 h-6 hover:text-destructive cursor-pointer transition-colors">email</mat-icon>
                   <a [href]="data.Donneeurl()" target="_blank" rel="noopener noreferrer"
     class="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  </a>
            </div>
          </div>

          <!-- Animation à la place de la photo -->
          <div class="w-48 h-48 md:w-80 md:h-80 relative shrink-0">
            <div class="absolute inset-0 bg-primary/20 rounded-full translate-x-4 translate-y-4"></div>
            <canvas #particlesCanvas class="w-full h-full"></canvas>
          </div>
        </header>

        <!-- Projects Section -->
        <section class="mb-24 animate-fade-in-slow">
          <div class="flex items-end justify-between mb-12 border-b pb-4">
            <h2 class="text-3xl font-bold">Projets Récents</h2>
            <a routerLink="/projects" class="text-primary hover:underline font-medium flex items-center">
              Voir tout <mat-icon class="ml-1">arrow_forward</mat-icon>
            </a>
          </div>

          <app-simple-list />
        </section>

        <!-- Contact Section -->
        <section class="bg-secondary/30 rounded-2xl p-12 text-center animate-fade-in-slow">
          <h2 class="text-3xl font-bold mb-6">Travaillons ensemble</h2>
          <p class="text-muted-foreground max-w-xl mx-auto mb-8">
            Je suis actuellement disponible pour des projets freelance. Si vous avez une idée, n'hésitez pas à me contacter.
          </p>
          <button mat-raised-button color="primary" class="px-8">Me contacter</button>
        </section>
      </div>

      <!-- Footer -->
      <!-- <footer class="bg-background border-t py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 {{ (profile$ | async)?.prenom }} {{ (profile$ | async)?.nom }}. Propulsé par Portfolify.</p>
      </footer> -->

      <!-- Animation canvas (remplace la photo) -->
      <div class="hidden">
        <canvas #particlesCanvas class="w-full h-full"></canvas>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-fade-in-slow {
      animation: fadeIn 1.2s ease-out forwards;
    }
  `]
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('particlesCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  data = inject(DataService)
  private auth = inject(AuthService);
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  profile$?: Observable<Infos[]>;

  user$ = this.auth.user;

  // profile$ = this.user$.pipe(
  //   switchMap(user => user ? this.fs.getUserProfile(user.uid) : of(null))
  // );

  projects$ = this.user$.pipe(
    switchMap(user => user ? this.fs.getUserProjects(user.uid) : of([]))
  );

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
    const colors = ['#a855f7', '#06b6d4', '#c084fc', '#22d3ee']; // couleurs shadcn primary / accent

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
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
        ctx.globalAlpha = 0.7;
        ctx.fill();

        // Connexions légères
        particles.forEach(other => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.sqrt(dx*dx + dy*dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.25;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

   getToolInfo (toolName: string): ToolInfo {
      const lowerName = toolName.toLowerCase().trim();
      return (
        TOOLS.find(t => lowerName.includes(t.name)) || {
          name: lowerName,
          displayName: toolName,
          icon: 'build',
          color: 'text-violet-400',
        }
      );
    }
}