import { Component, inject, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { DataService } from '../../../core/service/firebase/data.service';
import { BreakTextPipe } from '../../../pipe/break-text.pipe';
import { ToolInfo, TOOLS } from '../../../tools.constants';
import { SimpleListComponent } from '../projects/project-list/simple-list.component';

type PublishState = 'idle' | 'loading' | 'done' | 'error';

@Component({
  selector: 'app-folio',
  standalone: true,
  imports: [AsyncPipe, RouterLink, BreakTextPipe, SimpleListComponent],
  template: `
    <div class="folio-root">

      <!-- ══ Preview bar ══ -->
      <div class="preview-bar">
        <a routerLink="/home/profil" class="preview-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retour
        </a>

        <span class="preview-label">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M6 4v2l1.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          Mode Prévisualisation
        </span>

        <!-- Publish button states -->
        @if (publishState() === 'idle' || publishState() === 'error') {
          <button class="btn-publish" (click)="onPublish()"
            [class.btn-publish--error]="publishState() === 'error'">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 9V1M3 5.5l3.5-4.5 3.5 4.5M1.5 11h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ publishState() === 'error' ? 'Réessayer' : 'Télécharger mon portfolio' }}
          </button>
        }

        @if (publishState() === 'loading') {
          <button class="btn-publish btn-publish--loading" disabled>
            <span class="spinner"></span>
            Génération…
          </button>
        }

        @if (publishState() === 'done') {
          <div class="done-badge">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5l3.5 3.5 5.5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Téléchargé !
          </div>
          <button class="btn-publish btn-publish--ghost" (click)="onPublish()">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 6A4 4 0 112 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              <path d="M10 3v3H7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Regénérer
          </button>
        }
      </div>

      <!-- ══ Toast ══ -->
      @if (toast()) {
        <div class="toast" [class.toast--error]="toastType() === 'error'">
          @if (toastType() === 'success') {
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="6.5" fill="#dcfce7"/>
              <path d="M4.5 7.5l2.5 2.5 4-4" stroke="#16a34a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          } @else {
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="6.5" fill="#fee2e2"/>
              <path d="M7.5 5v3M7.5 10h.01" stroke="#dc2626" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          }
          {{ toast() }}
        </div>
      }

      <!-- ══ Main content ══ -->
      <div class="folio-content">

        <!-- Hero -->
        <header class="hero-section reveal">
          <div class="hero-text">
            <p class="hero-eyebrow">Portfolio</p>
            <h1 class="hero-name">
              {{ data.Donneenom() }} <em>{{ data.Donneeprenom() }}</em>
            </h1>
            <div class="hero-title-badge">
              <span class="title-dot"></span>
              {{ data.Donneetitre() || 'Titre professionnel non défini' }}
            </div>
            @if (data.Donneebio()) {
              <p class="hero-bio">{{ data.Donneebio() | breakText:80 }}</p>
            }
            @if (data.Donneeskills()) {
              <div class="hero-skills">
                @let info = getToolInfo(data.Donneeskills());
                <span class="tool-badge">{{ info.displayName || data.Donneeskills() }}</span>
              </div>
            }
            <div class="hero-actions">
              <a [href]="'mailto:'" class="btn btn-primary">Me contacter</a>
              @if (data.Donneeurl()) {
                <a [href]="'https://github.com/' + data.Donneeurl()" target="_blank" rel="noopener noreferrer" class="btn-icon" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              }
            </div>
          </div>

          <div class="hero-canvas-wrap">
            <div class="canvas-ring canvas-ring--1"></div>
            <div class="canvas-ring canvas-ring--2"></div>
            <canvas #particlesCanvas class="particles-canvas"></canvas>
          </div>
        </header>

        <!-- Projects -->
        <section id="projects" class="folio-section reveal reveal--delay">
          <p class="section-eyebrow" style="margin-bottom:32px">Réalisations</p>
          <app-simple-list />
        </section>

        <!-- Contact -->
        <section class="contact-section reveal reveal--delay-2">
          <div class="contact-inner">
            <p class="section-eyebrow">Contact</p>
            <h2 class="contact-title">Travaillons ensemble</h2>
            <p class="contact-sub">Disponible pour des projets freelance. Une idée en tête ? Discutons-en.</p>
            <a href="mailto:" class="btn btn-primary btn-lg">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M1 4.5l6.5 5 6.5-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              Envoyer un message
            </a>
          </div>
        </section>
      </div>

      <footer class="folio-footer">
        <p>{{ data.Donneeprenom() }} {{ data.Donneenom() }} · Propulsé par <strong>Ploo</strong></p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      --c-bg:#f8f9fc;--c-surface:#ffffff;--c-border:#e5e7ef;
      --c-text:#111827;--c-text-muted:#6b7280;
      --c-primary:#1a56db;--c-primary-dk:#1447c0;
      --c-mark:#f0f4ff;--c-error:#dc2626;
      --r-md:10px;--r-lg:16px;--r-xl:24px;
      --shadow-sm:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
      --shadow-md:0 4px 16px rgba(0,0,0,.08);
      --font-display:'Georgia','Times New Roman',serif;
      --font-body:'system-ui',-apple-system,'Segoe UI',sans-serif;
      display:block;font-family:var(--font-body);font-size:16px;line-height:1.6;color:var(--c-text);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    a{text-decoration:none;color:inherit}
    .folio-root{background:var(--c-bg);min-height:100vh;display:flex;flex-direction:column}

    .reveal{opacity:0;transform:translateY(20px);animation:revealUp .7s cubic-bezier(.22,1,.36,1) forwards}
    .reveal--delay{animation-delay:.2s}.reveal--delay-2{animation-delay:.4s}
    @keyframes revealUp{to{opacity:1;transform:none}}

    /* ── Preview bar ── */
    .preview-bar{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:52px;background:var(--c-text);border-bottom:1px solid rgba(255,255,255,.08);gap:12px}
    .preview-back{display:flex;align-items:center;gap:6px;font-size:.8rem;font-weight:500;color:rgba(255,255,255,.55);transition:color .2s;flex-shrink:0}
    .preview-back:hover{color:#fff}
    .preview-label{display:flex;align-items:center;gap:6px;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.3);flex:1;justify-content:center}

    /* Publish btn */
    .btn-publish{display:inline-flex;align-items:center;gap:7px;padding:6px 15px;border-radius:var(--r-md);background:var(--c-primary);color:#fff;border:none;font-size:.8rem;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0;transition:background .2s,box-shadow .2s,opacity .2s;white-space:nowrap}
    .btn-publish:hover{background:var(--c-primary-dk);box-shadow:0 4px 12px rgba(26,86,219,.35)}
    .btn-publish--loading{opacity:.7;cursor:not-allowed}
    .btn-publish--error{background:var(--c-error)}
    .btn-publish--error:hover{background:#b91c1c}
    .btn-publish--ghost{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2)}
    .btn-publish--ghost:hover{background:rgba(255,255,255,.18);box-shadow:none}
    .done-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--r-md);background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3);color:#4ade80;font-size:.8rem;font-weight:700;flex-shrink:0}
    .spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
    @keyframes spin{to{transform:rotate(360deg)}}

    /* Toast */
    .toast{position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:200;display:flex;align-items:center;gap:8px;padding:10px 18px;background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-md);box-shadow:var(--shadow-md);font-size:.85rem;font-weight:500;color:var(--c-text);white-space:nowrap;animation:toastIn .25s cubic-bezier(.22,1,.36,1),toastOut .3s ease 2.5s forwards}
    .toast--error{border-color:#fca5a5;background:#fff1f2;color:var(--c-error)}
    @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes toastOut{from{opacity:1}to{opacity:0}}

    /* Content */
    .folio-content{flex:1;max-width:1040px;width:100%;margin:0 auto;padding:88px 24px 64px}
    .hero-section{display:grid;grid-template-columns:1fr auto;align-items:center;gap:64px;padding:64px 0 72px;border-bottom:1px solid var(--c-border)}
    .hero-eyebrow{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--c-primary);margin-bottom:14px}
    .hero-name{font-family:var(--font-display);font-size:clamp(2.4rem,5vw,3.8rem);font-weight:700;line-height:1.1;letter-spacing:-.02em;color:var(--c-text);margin-bottom:20px}
    .hero-name em{font-style:italic;color:var(--c-primary)}
    .hero-title-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-lg);font-size:.95rem;font-weight:600;color:var(--c-text);margin-bottom:24px;box-shadow:var(--shadow-sm)}
    .title-dot{width:8px;height:8px;border-radius:50%;background:var(--c-primary);flex-shrink:0}
    .hero-bio{font-size:1rem;color:var(--c-text-muted);line-height:1.75;max-width:540px;margin-bottom:20px;white-space:pre-wrap}
    .hero-skills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
    .tool-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:var(--c-mark);border:1px solid rgba(26,86,219,.12);border-radius:100px;font-size:.78rem;font-weight:600;color:var(--c-primary)}
    .hero-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:var(--r-md);font-size:.9rem;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:all .2s;white-space:nowrap}
    .btn-lg{padding:13px 26px;font-size:.95rem}
    .btn-primary{background:var(--c-primary);color:#fff;border-color:var(--c-primary)}
    .btn-primary:hover{background:var(--c-primary-dk);transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,86,219,.28)}
    .btn-icon{width:40px;height:40px;border-radius:var(--r-md);border:1.5px solid var(--c-border);background:var(--c-surface);color:var(--c-text-muted);display:flex;align-items:center;justify-content:center;transition:border-color .2s,color .2s}
    .btn-icon:hover{border-color:var(--c-primary);color:var(--c-primary)}
    .hero-canvas-wrap{position:relative;width:260px;height:260px;flex-shrink:0}
    .canvas-ring{position:absolute;border-radius:50%;border:1px solid var(--c-border)}
    .canvas-ring--1{inset:0}.canvas-ring--2{inset:20px;border-color:rgba(26,86,219,.12)}
    .particles-canvas{width:100%;height:100%;border-radius:50%;background:var(--c-mark)}
    .folio-section{padding:64px 0;border-bottom:1px solid var(--c-border)}
    .section-eyebrow{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--c-primary)}
    .contact-section{padding:64px 0 24px}
    .contact-inner{background:var(--c-text);border-radius:var(--r-xl);padding:56px 48px;text-align:center;position:relative;overflow:hidden}
    .contact-inner::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;pointer-events:none}
    .contact-inner .section-eyebrow{position:relative;color:rgba(255,255,255,.4)}
    .contact-title{font-family:var(--font-display);font-size:2rem;font-weight:700;color:#fff;margin-bottom:12px;position:relative}
    .contact-sub{color:rgba(255,255,255,.55);font-size:.95rem;max-width:400px;margin:0 auto 28px;line-height:1.7;position:relative}
    .contact-inner .btn-primary{position:relative;background:#fff;color:var(--c-primary);border-color:#fff}
    .contact-inner .btn-primary:hover{background:rgba(255,255,255,.9);box-shadow:0 8px 24px rgba(0,0,0,.2)}
    .folio-footer{background:var(--c-surface);border-top:1px solid var(--c-border);padding:20px 24px;text-align:center;font-size:.78rem;color:var(--c-text-muted)}
    .folio-footer strong{color:var(--c-primary)}
    @media(max-width:768px){
      .hero-section{grid-template-columns:1fr;text-align:center;gap:40px}
      .hero-canvas-wrap{width:180px;height:180px;margin:0 auto}
      .hero-actions,.hero-skills{justify-content:center}
      .preview-label{display:none}
      .contact-inner{padding:40px 24px}
    }
  `]
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('particlesCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  data   = inject(DataService);
  private auth = inject(AuthService);
  private fs   = inject(FirestoreService);

  user$ = this.auth.user;

  publishState = signal<PublishState>('idle');
  toast        = signal('');
  toastType    = signal<'success' | 'error'>('success');
  private toastTimer: any;

  // ────────────────────────────────────────────────────────
  //  PUBLISH → génère et télécharge le HTML statique
  // ────────────────────────────────────────────────────────
  async onPublish() {
    this.publishState.set('loading');

    try {
      const user = await this.user$.pipe(take(1)).toPromise();

      // Récupérer les projets depuis Firestore
      const projects = user
        ? await this.fs.getProjectsOnce(user)   // méthode à implémenter (voir note)
        : [];

      // Construire le HTML
      const html = this.buildPortfolioHtml(projects);

      // Déclencher le téléchargement
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      const slug = `${this.data.Donneeprenom()}-${this.data.Donneenom()}`
                     .toLowerCase()
                     .replace(/\s+/g, '-')
                     .replace(/[^a-z0-9-]/g, '');
      a.href     = url;
      a.download = `portfolio-${slug}.html`;
      a.click();
      URL.revokeObjectURL(url);

      this.publishState.set('done');
      this.showToast('Fichier HTML téléchargé avec succès !', 'success');

    } catch (err) {
      console.error('[Export]', err);
      this.publishState.set('error');
      this.showToast('Erreur lors de la génération. Réessayez.', 'error');
    }
  }

  // ────────────────────────────────────────────────────────
  //  GÉNÉRATION DU HTML STATIQUE AUTONOME
  // ────────────────────────────────────────────────────────
  private buildPortfolioHtml(projects: any[]): string {
    const nom    = this.data.Donneenom()    || '';
    const prenom = this.data.Donneeprenom() || '';
    const titre  = this.data.Donneetitre()  || '';
    const bio    = this.data.Donneebio()    || '';
    const github = this.data.Donneeurl()    || '';
    const skills = this.data.Donneeskills() || '';

    const projectsHtml = projects.length
      ? projects.map(p => `
          <article class="project-card">
            <div class="card-body">
              <h3 class="card-title">${this.esc(p.title)}</h3>
              <p class="card-desc">${this.esc(p.description || '')}</p>
              ${p.contributors?.length
                ? `<div class="card-tools">${p.contributors.map((t: string) =>
                    `<span class="tool-badge">${this.esc(t)}</span>`).join('')}</div>`
                : ''}
            </div>
          </article>`).join('')
      : `<p style="color:#6b7280;font-style:italic">Aucun projet pour l'instant.</p>`;

    const githubBtn = github
      ? `<a href="https://github.com/${this.esc(github)}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="GitHub">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
           </svg>
         </a>`
      : '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Portfolio — ${this.esc(prenom)} ${this.esc(nom)}</title>
  <meta name="description" content="${this.esc(titre)}"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{font-family:'system-ui',-apple-system,'Segoe UI',sans-serif;font-size:16px;line-height:1.6;color:#111827;background:#f8f9fc}
    a{text-decoration:none;color:inherit}
    body{min-height:100vh;display:flex;flex-direction:column}

    /* Nav */
    nav{position:sticky;top:0;z-index:50;background:rgba(248,249,252,.95);backdrop-filter:blur(12px);border-bottom:1px solid #e5e7ef;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
    .nav-logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:1rem}
    .logo-mark{width:30px;height:30px;border-radius:7px;background:#1a56db;color:#fff;font-weight:800;font-size:.95rem;display:flex;align-items:center;justify-content:center}
    .nav-contact{padding:7px 16px;border-radius:8px;background:#1a56db;color:#fff;font-size:.82rem;font-weight:600;transition:background .2s}
    .nav-contact:hover{background:#1447c0}

    /* Hero */
    .hero{max-width:1040px;margin:0 auto;padding:80px 24px 72px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:64px;border-bottom:1px solid #e5e7ef}
    .hero-eyebrow{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#1a56db;margin-bottom:14px}
    .hero-name{font-family:'Georgia','Times New Roman',serif;font-size:clamp(2.2rem,5vw,3.6rem);font-weight:700;line-height:1.1;letter-spacing:-.02em;color:#111827;margin-bottom:20px}
    .hero-name em{font-style:italic;color:#1a56db}
    .hero-title-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;background:#fff;border:1px solid #e5e7ef;border-radius:12px;font-size:.95rem;font-weight:600;color:#111827;margin-bottom:22px;box-shadow:0 1px 3px rgba(0,0,0,.07)}
    .title-dot{width:8px;height:8px;border-radius:50%;background:#1a56db;flex-shrink:0}
    .hero-bio{font-size:1rem;color:#6b7280;line-height:1.75;max-width:520px;margin-bottom:20px;white-space:pre-wrap}
    .hero-skills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
    .tool-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;background:#f0f4ff;border:1px solid rgba(26,86,219,.12);border-radius:100px;font-size:.78rem;font-weight:600;color:#1a56db}
    .hero-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:10px;font-size:.9rem;font-weight:600;border:1.5px solid transparent;cursor:pointer;transition:all .2s;white-space:nowrap}
    .btn-primary{background:#1a56db;color:#fff;border-color:#1a56db}
    .btn-primary:hover{background:#1447c0;transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,86,219,.28)}
    .btn-icon{width:40px;height:40px;border-radius:10px;border:1.5px solid #e5e7ef;background:#fff;color:#6b7280;display:flex;align-items:center;justify-content:center;transition:border-color .2s,color .2s}
    .btn-icon:hover{border-color:#1a56db;color:#1a56db}

    /* Avatar canvas */
    .avatar-wrap{position:relative;width:260px;height:260px;flex-shrink:0}
    .avatar-ring{position:absolute;border-radius:50%;border:1px solid #e5e7ef}
    .avatar-ring-1{inset:0}.avatar-ring-2{inset:20px;border-color:rgba(26,86,219,.12)}
    canvas{width:100%;height:100%;border-radius:50%;background:#f0f4ff;display:block}

    /* Projects */
    .section{max-width:1040px;margin:0 auto;padding:64px 24px;border-bottom:1px solid #e5e7ef}
    .section-eyebrow{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#1a56db;margin-bottom:32px}
    .projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
    .project-card{background:#fff;border:1px solid #e5e7ef;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:border-color .2s,box-shadow .2s,transform .2s}
    .project-card:hover{border-color:#1a56db;box-shadow:0 4px 16px rgba(0,0,0,.08);transform:translateY(-2px)}
    .card-body{padding:22px 22px 16px;display:flex;flex-direction:column;gap:12px}
    .card-title{font-family:'Georgia','Times New Roman',serif;font-size:1rem;font-weight:700;color:#111827;line-height:1.3}
    .card-desc{font-size:.82rem;color:#6b7280;line-height:1.6}
    .card-tools{display:flex;flex-wrap:wrap;gap:6px}

    /* Contact */
    .contact-wrap{max-width:1040px;margin:0 auto;padding:64px 24px 40px}
    .contact-inner{background:#111827;border-radius:24px;padding:56px 48px;text-align:center;position:relative;overflow:hidden}
    .contact-inner::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;pointer-events:none}
    .contact-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.4);margin-bottom:12px;position:relative}
    .contact-title{font-family:'Georgia','Times New Roman',serif;font-size:2rem;font-weight:700;color:#fff;margin-bottom:12px;position:relative}
    .contact-sub{color:rgba(255,255,255,.55);font-size:.95rem;max-width:400px;margin:0 auto 28px;line-height:1.7;position:relative}
    .contact-btn{position:relative;display:inline-flex;align-items:center;gap:7px;padding:13px 26px;border-radius:10px;background:#fff;color:#1a56db;border:none;font-size:.95rem;font-weight:600;cursor:pointer;transition:background .2s,box-shadow .2s;text-decoration:none}
    .contact-btn:hover{background:rgba(255,255,255,.9);box-shadow:0 8px 24px rgba(0,0,0,.2)}

    /* Footer */
    footer{background:#fff;border-top:1px solid #e5e7ef;padding:20px 24px;text-align:center;font-size:.78rem;color:#6b7280;margin-top:auto}
    footer strong{color:#1a56db}

    /* Responsive */
    @media(max-width:768px){
      .hero{grid-template-columns:1fr;text-align:center;gap:40px;padding:60px 20px 48px}
      .avatar-wrap{width:160px;height:160px;margin:0 auto}
      .hero-actions,.hero-skills{justify-content:center}
      .contact-inner{padding:40px 20px}
    }
  </style>
</head>
<body>

  <!-- Nav -->
  <nav>
    <div class="nav-logo">
      <div class="logo-mark">P</div>
      Portfolify
    </div>
    <a href="mailto:" class="nav-contact">Me contacter</a>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div>
      <p class="hero-eyebrow">Portfolio</p>
      <h1 class="hero-name">${this.esc(nom)} <em>${this.esc(prenom)}</em></h1>
      ${titre ? `<div class="hero-title-badge"><span class="title-dot"></span>${this.esc(titre)}</div>` : ''}
      ${bio    ? `<p class="hero-bio">${this.esc(bio)}</p>` : ''}
      ${skills ? `<div class="hero-skills"><span class="tool-badge">${this.esc(skills)}</span></div>` : ''}
      <div class="hero-actions">
        <a href="mailto:" class="btn btn-primary">Me contacter</a>
        ${githubBtn}
      </div>
    </div>
    <div class="avatar-wrap">
      <div class="avatar-ring avatar-ring-1"></div>
      <div class="avatar-ring avatar-ring-2"></div>
      <canvas id="c" width="260" height="260"></canvas>
    </div>
  </section>

  <!-- Projects -->
  <section class="section">
    <p class="section-eyebrow">Réalisations</p>
    <div class="projects-grid">
      ${projectsHtml}
    </div>
  </section>

  <!-- Contact -->
  <div class="contact-wrap">
    <div class="contact-inner">
      <p class="contact-label">Contact</p>
      <h2 class="contact-title">Travaillons ensemble</h2>
      <p class="contact-sub">Disponible pour des projets freelance. Une idée en tête ? Discutons-en.</p>
      <a href="mailto:" class="contact-btn">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M1 4.5l6.5 5 6.5-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        Envoyer un message
      </a>
    </div>
  </div>

  <footer>
    <p>${this.esc(prenom)} ${this.esc(nom)} · Propulsé par <strong>Portfolify</strong></p>
  </footer>

  <!-- Particles canvas -->
  <script>
    (function(){
      var c=document.getElementById('c'),ctx=c.getContext('2d');
      c.width=c.offsetWidth;c.height=c.offsetHeight;
      var colors=['#1a56db','#0694a2','#60a5fa','#93c5fd','#e5e7ef'];
      var pts=Array.from({length:40},function(){return{
        x:Math.random()*c.width,y:Math.random()*c.height,
        r:Math.random()*2.5+1,
        vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,
        col:colors[Math.floor(Math.random()*colors.length)]
      }});
      function draw(){
        ctx.clearRect(0,0,c.width,c.height);
        pts.forEach(function(p){
          p.x+=p.vx;p.y+=p.vy;
          if(p.x<0||p.x>c.width)p.vx*=-1;
          if(p.y<0||p.y>c.height)p.vy*=-1;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle=p.col;ctx.globalAlpha=.6;ctx.fill();
          pts.forEach(function(o){
            var dx=p.x-o.x,dy=p.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<90){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(o.x,o.y);
              ctx.strokeStyle=p.col;ctx.globalAlpha=(90-d)/90*.18;ctx.lineWidth=.7;ctx.stroke();}
          });
        });
        requestAnimationFrame(draw);
      }
      draw();
    })();
  </script>
</body>
</html>`;
  }

  // Échappe les caractères HTML pour éviter les injections
  private esc(s: string): string {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  private showToast(message: string, type: 'success' | 'error') {
    clearTimeout(this.toastTimer);
    this.toast.set('');
    setTimeout(() => {
      this.toast.set(message);
      this.toastType.set(type);
      this.toastTimer = setTimeout(() => this.toast.set(''), 2900);
    }, 20);
  }

  // ── Particles (preview) ──
  ngAfterViewInit() { this.initParticles(); }

  private initParticles() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#1a56db','#0694a2','#60a5fa','#93c5fd','#e5e7ef'];
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = 0.6; ctx.fill();
        for (const o of particles) {
          const dx = p.x - o.x, dy = p.y - o.y, d = Math.sqrt(dx*dx + dy*dy);
          if (d < 90) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(o.x, o.y); ctx.strokeStyle = p.color; ctx.globalAlpha = (90-d)/90*.18; ctx.lineWidth = .7; ctx.stroke(); }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  getToolInfo(toolName: string): ToolInfo {
    const lower = toolName.toLowerCase().trim();
    return TOOLS.find(t => lower.includes(t.name)) ?? { name: lower, displayName: toolName, icon: 'build', color: 'text-primary' };
  }
}