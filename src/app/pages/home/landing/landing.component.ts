import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '../../../app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ═══════════════════════════════════════════ NAVBAR ═══ -->
    <nav class="navbar" [class.navbar--scrolled]="scrolled">
      <div class="nav-inner">
        <a class="nav-logo" routerLink="/">
          <span class="logo-mark">P</span>
          <span class="logo-text">{{ appName }}</span>
        </a>
        <ul class="nav-links">
          <li><a href="#features">Fonctionnalités</a></li>
          <!-- <li><a href="#testimonials">Témoignages</a></li> -->
          <li><a href="#pricing">Tarifs</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div class="nav-cta">
          <a routerLink="/login" class="btn btn-primary">Connexion</a>
        </div>
      </div>
    </nav>

    <!-- ═══════════════════════════════════════════ HERO ══════ -->
    <section class="hero">
      <div class="hero-grid-bg"></div>
      <div class="hero-inner">
        <div class="hero-eyebrow reveal">
          <span class="badge">✦ Nouveau</span>
          <span>500+ portfolios créés ce mois-ci</span>
        </div>
        <h1 class="hero-title reveal reveal--delay-1">
          Le portfolio<br>
          <em>qui ouvre des portes</em>
        </h1>
        <p class="hero-sub reveal reveal--delay-2">
          Construisez un site personnel élégant en moins de 5&nbsp;minutes.<br>
          Aucune compétence technique requise.
        </p>
        <div class="hero-actions reveal reveal--delay-3">
          <a routerLink="/login" class="btn btn-primary btn-lg">
            Créer mon portfolio gratuit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a href="#features" class="btn btn-ghost btn-lg">Voir comment ça marche</a>
        </div>
        <div class="hero-stats reveal reveal--delay-4">
          <div class="stat">
            <strong>500+</strong>
            <span>Portfolios publiés</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <strong>5 min</strong>
            <span>Temps moyen</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <strong>100%</strong>
            <span>Satisfaction</span>
          </div>
        </div>
      </div>

      <!-- Floating portfolio mockup -->
      <div class="hero-mockup reveal reveal--delay-3">
        <div class="mockup-window">
          <div class="mockup-bar">
            <span class="dot dot--red"></span>
            <span class="dot dot--yellow"></span>
            <span class="dot dot--green"></span>
            <div class="mockup-url">Ploo</div>
          </div>
          <div class="mockup-body">
            <div class="mock-nav">
              <div class="mock-logo-pill"></div>
              <div class="mock-nav-links">
                <div class="mock-line w-8"></div>
                <div class="mock-line w-10"></div>
                <div class="mock-line w-8"></div>
              </div>
              <div class="mock-btn-pill"></div>
            </div>
            <div class="mock-hero-area">
              <div class="mock-avatar"></div>
              <div class="mock-text-group">
                <div class="mock-line mock-title w-36"></div>
                <div class="mock-line w-28 opacity-60"></div>
                <div class="mock-line w-20 opacity-40"></div>
              </div>
            </div>
            <div class="mock-cards">
              <div class="mock-card">
                <div class="mock-card-img"></div>
                <div class="mock-line w-16 mt-2"></div>
                <div class="mock-line w-12 opacity-50"></div>
              </div>
              <div class="mock-card">
                <div class="mock-card-img bg-accent"></div>
                <div class="mock-line w-14 mt-2"></div>
                <div class="mock-line w-10 opacity-50"></div>
              </div>
              <div class="mock-card">
                <div class="mock-card-img bg-muted"></div>
                <div class="mock-line w-16 mt-2"></div>
                <div class="mock-line w-8 opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ LOGOS / SOCIAL PROOF ═══ -->
    <div class="trust-bar">
      <p class="trust-label">Utilisé par des professionnels </p>
      
    </div>

    <!-- ═══════════════════════════════════════════ FEATURES ══════ -->
    <section id="features" class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Fonctionnalités</p>
          <h2 class="section-title">Tout ce dont vous avez besoin,<br>rien de superflu</h2>
        </div>

        <div class="features-grid">
          <div class="feature-card feature-card--large">
            <div class="feature-icon">⚡</div>
            <h3>Ultra rapide</h3>
            <p>Votre portfolio en ligne en moins de 10 minutes. Remplissez votre profil, choisissez un template, publiez.</p>
            <div class="feature-tag">10 min max</div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Design moderne</h3>
            <p>10+ templates épurés pensés pour impressionner les recruteurs dès le premier regard.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Parfait sur mobile, tablette et desktop. Testé sur 20+ appareils.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Sécurisé & GDPR</h3>
            <p>Chiffrement end-to-end. Vous gardez le contrôle total sur vos données.</p>
          </div>

          <div class="feature-card feature-card--large">
            <div class="feature-icon">💸</div>
            <h3>Mode gratuit complet</h3>
            <p>Les fonctionnalités essentielles sont accessibles gratuitement, sans carte bancaire. Passez Pro quand vous êtes prêt.</p>
            <div class="feature-tag">0 € pour commencer</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ HOW IT WORKS ══════ -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">En 3 étapes</p>
          <h2 class="section-title">Simple comme bonjour</h2>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">01</div>
            <h3>Connectez vous via e-mail</h3>
            <p>Connexion rapide, aucune carte requise.</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">02</div>
            <h3>Remplissez votre profil</h3>
            <p>Bio, compétences, projets — notre éditeur guidé vous accompagne.</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">03</div>
            <h3>Publiez & partagez</h3>
            <p>Votre URL personnelle, prête à envoyer aux recruteurs.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ TESTIMONIALS ══════ -->
    <!-- <section id="testimonials" class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Témoignages</p>
          <h2 class="section-title">Ils ont décroché le poste</h2>
        </div>
        <div class="testimonials-grid">
          <blockquote class="testimonial testimonial--featured">
            <p class="testimonial-text">
              "En 48h après avoir publié mon portfolio, j'avais deux messages de recruteurs LinkedIn. Le design professionnel fait vraiment la différence."
            </p>
            <footer>
              <div class="testimonial-avatar" style="background:#1a56db">A</div>
              <div>
                <strong>Alex M.</strong>
                <span>Développeur Frontend · Paris</span>
              </div>
            </footer>
          </blockquote>

          <blockquote class="testimonial">
            <p class="testimonial-text">
              "J'ai personnalisé mon portfolio sans toucher une seule ligne de code. Les recruteurs adorent."
            </p>
            <footer>
              <div class="testimonial-avatar" style="background:#0694a2">S</div>
              <div>
                <strong>Sarah L.</strong>
                <span>Designer UI/UX</span>
              </div>
            </footer>
          </blockquote>

          <blockquote class="testimonial">
            <p class="testimonial-text">
              "Outil gratuit et puissant. J'ai multiplié mes opportunités grâce à un portfolio vraiment pro."
            </p>
            <footer>
              <div class="testimonial-avatar" style="background:#7e3af2">M</div>
              <div>
                <strong>Marc T.</strong>
                <span>Product Manager</span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section> -->

    <!-- ═══════════════════════════════════════════ PRICING ═══════ -->
    <section id="pricing" class="section section--alt">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Tarification</p>
          <h2 class="section-title">Transparent et sans surprise</h2>
          <p class="section-desc">Commencez gratuitement. Passez Pro quand vous êtes prêt.</p>
        </div>

        <div class="pricing-grid">
          <!-- FREE -->
          <div class="pricing-card">
            <div class="pricing-header">
              <p class="plan-name">Gratuit</p>
              <div class="plan-price">
                <strong>0 €</strong>
                <span>/mois</span>
              </div>
              <p class="plan-desc">Pour démarrer sans risque</p>
            </div>
            <ul class="plan-features">
              <li class="yes">1 portfolio publié</li>
              <li class="yes">Templates basiques</li>
              <li class="yes">Export HTML</li>
              <li class="yes">URL personnalisée</li>
              <li class="no">Thèmes premium</li>
              <li class="no">Export PDF / Word</li>
              <li class="no">Support prioritaire</li>
            </ul>
            <a routerLink="/register" class="btn btn-outline btn-block">Commencer gratuitement</a>
          </div>

          <!-- PRO MONTHLY -->
          <div class="pricing-card pricing-card--featured">
            <div class="pricing-badge">Recommandé</div>
            <div class="pricing-header">
              <p class="plan-name">Pro</p>
              <div class="plan-price">
                <strong>9 €</strong>
                <span>/mois</span>
              </div>
              <p class="plan-desc">Pour les professionnels exigeants</p>
            </div>
            <ul class="plan-features">
              <li class="yes">Portfolios illimités</li>
              <li class="yes">Tous les thèmes premium</li>
              <li class="yes">Export PDF & Word</li>
              <li class="yes">URL personnalisée</li>
              <li class="yes">Statistiques de visites</li>
              <li class="yes">Support prioritaire</li>
              <li class="yes">Nouvelles fonctionnalités en avant-première</li>
            </ul>
            <a href="https://buy.stripe.com/test_fZufZha107uY6uWeGR0ZW01" target="_blank" class="btn btn-primary btn-block">
              Passer Pro maintenant
            </a>
          </div>

          <!-- PRO YEARLY -->
          <div class="pricing-card">
            <div class="pricing-header">
              <p class="plan-name">Pro Annuel</p>
              <div class="plan-price">
                <strong>90 €</strong>
                <span>/an</span>
              </div>
              <p class="plan-desc">Économisez 18 € — 2 mois offerts</p>
            </div>
            <ul class="plan-features">
              <li class="yes">Tout ce que Pro mensuel inclut</li>
              <li class="yes">Accès prioritaire aux nouvelles fonctionnalités</li>
              <li class="yes">Badge « Pro Annuel » sur votre portfolio</li>
              <li class="yes">Économisez 18 € par rapport au mensuel</li>
            </ul>
            <a href="https://buy.stripe.com/test_14A6oHa10aHaaLc6al0ZW00" target="_blank" class="btn btn-outline btn-block">
              Passer Pro Annuel
            </a>
            <p class="plan-note">Paiement sécurisé · Stripe · Annulation à tout moment</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ FAQ ════════════ -->
    <section id="faq" class="section">
      <div class="container container--narrow">
        <div class="section-header">
          <p class="section-eyebrow">FAQ</p>
          <h2 class="section-title">Questions fréquentes</h2>
        </div>
        <div class="faq-list">
          <details class="faq-item" *ngFor="let item of faqs" [open]="item.open">
            <summary class="faq-question">
              {{ item.q }}
              <span class="faq-chevron">↓</span>
            </summary>
            <p class="faq-answer">{{ item.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ FINAL CTA ═════ -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-inner">
          <h2>Prêt à booster votre carrière ?</h2>
          <p>Rejoignez des milliers de professionnels qui ont trouvé leur prochain poste grâce à un portfolio exceptionnel.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg">
            Créer mon portfolio — c'est gratuit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ FOOTER ════════ -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <span class="logo-mark">P</span>
            <span class="logo-text">{{ appName }}</span>
          </div>
          <nav class="footer-nav">
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
            <a href="#faq">FAQ</a>
            <!-- <a routerLink="/login">Connexion</a> -->
          </nav>
          <div class="footer-social">
            <a href="https://x.com" target="_blank" aria-label="X / Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com" target="_blank" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="https://discord.gg" target="_blank" aria-label="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3853-.3969-.8748-.6083-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8851 1.515.0699.0699 0 00-.032.0277C.5336 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0105c.1202.099.246.1981.372.2914a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914a.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6061 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© {{ currentYear }} {{ appName }} — Tous droits réservés</p>
          <div class="footer-legal">
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* ═══════════════════ TOKENS ══════════════════ */
    :host {
      --c-bg:        #f8f9fc;
      --c-bg-alt:    #ffffff;
      --c-surface:   #ffffff;
      --c-border:    #e5e7ef;
      --c-text:      #111827;
      --c-text-muted:#6b7280;
      --c-primary:   #1a56db;
      --c-primary-dk:#1447c0;
      --c-accent:    #0694a2;
      --c-mark:      #f0f4ff;
      --r-sm:        8px;
      --r-md:        12px;
      --r-lg:        20px;
      --shadow-sm:   0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
      --shadow-md:   0 4px 16px rgba(0,0,0,.08);
      --shadow-lg:   0 12px 40px rgba(0,0,0,.12);
      --font-display:'Georgia', 'Times New Roman', serif;
      --font-body:   'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      background: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
    }

    /* ═══════════════════ RESET HELPERS ═══════════ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { color: inherit; text-decoration: none; }
    ul { list-style: none; }

    /* ═══════════════════ REVEAL ANIMATIONS ════════ */
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      animation: revealUp .7s cubic-bezier(.22,1,.36,1) forwards;
    }
    .reveal--delay-1 { animation-delay: .12s; }
    .reveal--delay-2 { animation-delay: .24s; }
    .reveal--delay-3 { animation-delay: .36s; }
    .reveal--delay-4 { animation-delay: .52s; }

    @keyframes revealUp {
      to { opacity: 1; transform: translateY(0); }
    }

    /* ═══════════════════ LAYOUT ══════════════════ */
    .container {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0 24px;
    }
    .container--narrow { max-width: 760px; }

    .section { padding: 96px 0; }
    .section--alt { background: var(--c-bg-alt); }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }
    .section-eyebrow {
      font-size: .75rem;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--c-primary);
      margin-bottom: 12px;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 700;
      line-height: 1.2;
      color: var(--c-text);
      margin-bottom: 16px;
    }
    .section-desc {
      font-size: 1.1rem;
      color: var(--c-text-muted);
    }

    /* ═══════════════════ BUTTONS ═════════════════ */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--r-sm);
      font-size: .9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s ease;
      border: 1.5px solid transparent;
      white-space: nowrap;
    }
    .btn-lg { padding: 14px 28px; font-size: 1rem; border-radius: var(--r-md); }
    .btn-block { display: flex; width: 100%; justify-content: center; }

    .btn-primary {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }
    .btn-primary:hover {
      background: var(--c-primary-dk);
      border-color: var(--c-primary-dk);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(26,86,219,.3);
    }

    .btn-ghost {
      background: transparent;
      color: var(--c-text-muted);
      border-color: var(--c-border);
    }
    .btn-ghost:hover {
      background: var(--c-mark);
      color: var(--c-text);
      border-color: var(--c-primary);
    }

    .btn-outline {
      background: transparent;
      color: var(--c-primary);
      border-color: var(--c-primary);
    }
    .btn-outline:hover {
      background: var(--c-mark);
      transform: translateY(-1px);
    }

    /* ═══════════════════ NAVBAR ══════════════════ */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 0 24px;
      transition: background .3s, box-shadow .3s;
    }
    .navbar--scrolled {
      background: rgba(248,249,252,.95);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 var(--c-border);
    }
    .nav-inner {
      max-width: 1120px;
      margin: 0 auto;
      height: 68px;
      display: flex;
      align-items: center;
      gap: 40px;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .logo-mark {
      width: 34px; height: 34px;
      border-radius: var(--r-sm);
      background: var(--c-primary);
      color: #fff;
      font-weight: 800;
      font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-text {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--c-text);
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
      flex: 1;
    }
    .nav-links a {
      font-size: .9rem;
      font-weight: 500;
      color: var(--c-text-muted);
      transition: color .2s;
    }
    .nav-links a:hover { color: var(--c-primary); }
    .nav-cta { display: flex; align-items: center; gap: 10px; margin-left: auto; }

    /* ═══════════════════ HERO ════════════════════ */
    .hero {
      min-height: 100vh;
      padding: 140px 24px 80px;
      background: var(--c-bg-alt);
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 64px;
      max-width: 1120px;
      margin: 0 auto;
    }
    .hero-grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(var(--c-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--c-border) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: .4;
      pointer-events: none;
    }
    .hero-inner { position: relative; z-index: 1; }

    .hero-eyebrow {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
      font-size: .85rem;
      color: var(--c-text-muted);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 100px;
      background: var(--c-mark);
      color: var(--c-primary);
      font-weight: 700;
      font-size: .78rem;
      border: 1px solid rgba(26,86,219,.15);
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 5vw, 3.6rem);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -.02em;
      color: var(--c-text);
      margin-bottom: 24px;
    }
    .hero-title em {
      font-style: italic;
      color: var(--c-primary);
    }

    .hero-sub {
      font-size: 1.1rem;
      color: var(--c-text-muted);
      margin-bottom: 36px;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--c-border);
    }
    .stat strong {
      display: block;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--c-text);
      line-height: 1;
    }
    .stat span {
      font-size: .8rem;
      color: var(--c-text-muted);
      margin-top: 2px;
      display: block;
    }
    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--c-border);
    }

    /* ═══════════════════ MOCKUP ══════════════════ */
    .hero-mockup {
      position: relative;
      z-index: 1;
    }
    .mockup-window {
      background: #fff;
      border-radius: var(--r-lg);
      box-shadow: var(--shadow-lg), 0 0 0 1px var(--c-border);
      overflow: hidden;
      transform: perspective(1000px) rotateY(-4deg) rotateX(2deg);
      transition: transform .4s ease;
    }
    .mockup-window:hover {
      transform: perspective(1000px) rotateY(-1deg) rotateX(1deg);
    }
    .mockup-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      background: #f3f4f6;
      border-bottom: 1px solid var(--c-border);
    }
    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .dot--red    { background: #ef4444; }
    .dot--yellow { background: #f59e0b; }
    .dot--green  { background: #10b981; }
    .mockup-url {
      margin-left: 8px;
      font-size: .72rem;
      color: var(--c-text-muted);
      background: #fff;
      border: 1px solid var(--c-border);
      border-radius: 4px;
      padding: 3px 10px;
      flex: 1;
    }
    .mockup-body { padding: 20px; }

    /* Mini UI inside mockup */
    .mock-nav {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .mock-logo-pill {
      width: 28px; height: 10px;
      border-radius: 4px;
      background: var(--c-primary);
    }
    .mock-nav-links { display: flex; gap: 8px; flex: 1; }
    .mock-btn-pill {
      width: 48px; height: 10px;
      border-radius: 4px;
      background: var(--c-primary);
      opacity: .6;
    }
    .mock-hero-area {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--c-bg);
      border-radius: var(--r-sm);
      margin-bottom: 16px;
    }
    .mock-avatar {
      width: 44px; height: 44px;
      border-radius: 50%;
      background: var(--c-primary);
      flex-shrink: 0;
    }
    .mock-text-group { display: flex; flex-direction: column; gap: 6px; }
    .mock-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .mock-card {
      background: var(--c-bg);
      border: 1px solid var(--c-border);
      border-radius: var(--r-sm);
      padding: 10px;
    }
    .mock-card-img {
      height: 48px;
      border-radius: 4px;
      background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-accent) 100%);
      margin-bottom: 8px;
    }
    .mock-card-img.bg-accent { background: linear-gradient(135deg, var(--c-accent), #065f6b); }
    .mock-card-img.bg-muted  { background: #e5e7ef; }
    .mock-line {
      height: 6px;
      border-radius: 3px;
      background: var(--c-border);
      margin-top: 4px;
    }
    .mock-title { height: 9px; background: var(--c-text); opacity: .7; }
    .w-8  { width: 32px; }
    .w-10 { width: 40px; }
    .w-12 { width: 48px; }
    .w-14 { width: 56px; }
    .w-16 { width: 64px; }
    .w-20 { width: 80px; }
    .w-28 { width: 112px; }
    .w-36 { width: 144px; }
    .mt-2 { margin-top: 8px; }
    .opacity-40 { opacity: .4; }
    .opacity-50 { opacity: .5; }
    .opacity-60 { opacity: .6; }

    /* ═══════════════════ TRUST BAR ══════════════ */
    .trust-bar {
      background: var(--c-bg-alt);
      border-top: 1px solid var(--c-border);
      border-bottom: 1px solid var(--c-border);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .trust-label {
      font-size: .8rem;
      color: var(--c-text-muted);
      font-weight: 500;
    }
    .trust-logos { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .trust-co {
      font-size: .85rem;
      font-weight: 700;
      color: var(--c-text-muted);
      letter-spacing: .03em;
      opacity: .6;
    }
    .trust-dot { color: var(--c-border); }

    /* ═══════════════════ FEATURES ════════════════ */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      gap: 20px;
    }
    .feature-card {
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 32px;
      transition: border-color .2s, box-shadow .2s, transform .2s;
    }
    .feature-card:hover {
      border-color: var(--c-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .feature-card--large { grid-column: span 2; }
    .feature-icon {
      font-size: 2rem;
      margin-bottom: 16px;
    }
    .feature-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .feature-card p {
      font-size: .9rem;
      color: var(--c-text-muted);
      line-height: 1.6;
    }
    .feature-tag {
      display: inline-block;
      margin-top: 16px;
      padding: 4px 12px;
      border-radius: 100px;
      background: var(--c-mark);
      color: var(--c-primary);
      font-size: .78rem;
      font-weight: 700;
      border: 1px solid rgba(26,86,219,.15);
    }

    /* ═══════════════════ STEPS ═══════════════════ */
    .steps {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .step {
      flex: 1;
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 32px;
      text-align: center;
    }
    .step-number {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--c-primary);
      opacity: .25;
      line-height: 1;
      margin-bottom: 16px;
    }
    .step h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .step p {
      font-size: .88rem;
      color: var(--c-text-muted);
    }
    .step-arrow {
      font-size: 1.5rem;
      color: var(--c-border);
      flex-shrink: 0;
    }

    /* ═══════════════════ TESTIMONIALS ════════════ */
    .testimonials-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 20px;
    }
    .testimonial {
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 32px;
    }
    .testimonial--featured {
      grid-row: span 2;
      background: var(--c-mark);
      border-color: rgba(26,86,219,.2);
    }
    .testimonial-text {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--c-text);
      margin-bottom: 24px;
      font-style: italic;
    }
    .testimonial footer {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .testimonial-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-weight: 700;
      flex-shrink: 0;
    }
    .testimonial footer strong { display: block; font-size: .9rem; }
    .testimonial footer span { font-size: .8rem; color: var(--c-text-muted); }

    /* ═══════════════════ PRICING ═════════════════ */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      align-items: start;
    }
    .pricing-card {
      background: var(--c-surface);
      border: 1.5px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 32px;
      position: relative;
      transition: box-shadow .2s;
    }
    .pricing-card:hover { box-shadow: var(--shadow-md); }
    .pricing-card--featured {
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px rgba(26,86,219,.1);
    }
    .pricing-badge {
      position: absolute;
      top: -13px; left: 50%;
      transform: translateX(-50%);
      background: var(--c-primary);
      color: #fff;
      font-size: .75rem;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 100px;
    }
    .pricing-header { margin-bottom: 28px; }
    .plan-name {
      font-size: .8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--c-text-muted);
      margin-bottom: 12px;
    }
    .plan-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 8px;
    }
    .plan-price strong {
      font-size: 2.4rem;
      font-weight: 800;
      color: var(--c-text);
    }
    .plan-price span {
      font-size: .9rem;
      color: var(--c-text-muted);
    }
    .plan-desc {
      font-size: .85rem;
      color: var(--c-text-muted);
    }

    .plan-features {
      margin-bottom: 28px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .plan-features li {
      font-size: .88rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .plan-features li::before {
      content: '';
      display: block;
      width: 16px; height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .plan-features li.yes {
      color: var(--c-text);
    }
    .plan-features li.yes::before {
      background: #dcfce7;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='%2316a34a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
    }
    .plan-features li.no {
      color: var(--c-text-muted);
      opacity: .5;
    }
    .plan-features li.no::before {
      background: #f3f4f6;
      background-image: url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l6 6M7 1L1 7' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
    }

    .plan-note {
      margin-top: 16px;
      font-size: .75rem;
      color: var(--c-text-muted);
      text-align: center;
    }

    /* ═══════════════════ FAQ ═════════════════════ */
    .faq-list { display: flex; flex-direction: column; gap: 2px; }
    .faq-item {
      border: 1px solid var(--c-border);
      border-radius: var(--r-sm);
      background: var(--c-surface);
      overflow: hidden;
      transition: border-color .2s;
    }
    .faq-item[open] { border-color: var(--c-primary); }
    .faq-question {
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      cursor: pointer;
      font-weight: 600;
      font-size: .95rem;
      user-select: none;
    }
    .faq-question::-webkit-details-marker { display: none; }
    .faq-chevron {
      font-size: 1rem;
      color: var(--c-text-muted);
      transition: transform .3s;
    }
    .faq-item[open] .faq-chevron { transform: rotate(180deg); }
    .faq-answer {
      padding: 0 24px 20px;
      font-size: .9rem;
      color: var(--c-text-muted);
      line-height: 1.7;
    }

    /* ═══════════════════ CTA SECTION ════════════ */
    .cta-section {
      background: var(--c-primary);
      padding: 80px 24px;
    }
    .cta-inner {
      max-width: 640px;
      margin: 0 auto;
      text-align: center;
    }
    .cta-inner h2 {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3.5vw, 2.4rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 16px;
    }
    .cta-inner p {
      color: rgba(255,255,255,.75);
      margin-bottom: 36px;
      font-size: 1.05rem;
    }
    .cta-section .btn-primary {
      background: #fff;
      color: var(--c-primary);
      border-color: #fff;
    }
    .cta-section .btn-primary:hover {
      background: rgba(255,255,255,.9);
      box-shadow: 0 8px 24px rgba(0,0,0,.2);
    }

    /* ═══════════════════ FOOTER ══════════════════ */
    .footer {
      background: var(--c-text);
      padding: 48px 24px 32px;
      color: rgba(255,255,255,.6);
    }
    .footer .container { max-width: 1120px; margin: 0 auto; }
    .footer-top {
      display: flex;
      align-items: center;
      gap: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255,255,255,.1);
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
    }
    .footer-brand .logo-mark { background: var(--c-primary); }
    .footer-brand .logo-text { color: #fff; }
    .footer-nav {
      display: flex;
      gap: 24px;
      flex: 1;
    }
    .footer-nav a {
      font-size: .85rem;
      color: rgba(255,255,255,.5);
      transition: color .2s;
    }
    .footer-nav a:hover { color: #fff; }
    .footer-social {
      display: flex;
      gap: 16px;
      margin-left: auto;
    }
    .footer-social a {
      color: rgba(255,255,255,.4);
      transition: color .2s;
    }
    .footer-social a:hover { color: #fff; }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .8rem;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-legal {
      display: flex;
      gap: 20px;
    }
    .footer-legal a {
      color: rgba(255,255,255,.4);
      transition: color .2s;
    }
    .footer-legal a:hover { color: rgba(255,255,255,.8); }

    /* ═══════════════════ RESPONSIVE ═════════════ */
    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        padding-top: 110px;
      }
      .hero-actions { justify-content: center; }
      .hero-stats { justify-content: center; }
      .hero-mockup { display: none; }
      .features-grid { grid-template-columns: 1fr 1fr; }
      .feature-card--large { grid-column: span 2; }
      .pricing-grid { grid-template-columns: 1fr; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .testimonial--featured { grid-row: auto; }
      .steps { flex-direction: column; }
      .step-arrow { transform: rotate(90deg); }
      .nav-links { display: none; }
    }

    @media (max-width: 600px) {
      .features-grid { grid-template-columns: 1fr; }
      .feature-card--large { grid-column: span 1; }
      .hero-title { font-size: 2rem; }
    }
  `]
})
export class LandingComponent {
  currentYear = new Date().getFullYear();
  appName = APP_NAME;
  scrolled = false;

  faqs = [
    {
      q: 'Comment créer mon portfolio ?',
      a: 'Inscrivez-vous, remplissez votre profil et ajoutez vos projets. Notre éditeur guidé génère automatiquement votre portfolio en quelques minutes.',
      open: true
    },
    {
      q: 'Est-ce vraiment gratuit ?',
      a: 'Oui. Les fonctionnalités essentielles sont totalement gratuites, sans carte bancaire. Les options premium (thèmes, exports avancés) sont disponibles en plan Pro.',
      open: false
    },
    {
      q: 'Puis-je exporter mon portfolio ?',
      a: 'Oui, exportez en HTML (gratuit), ou en PDF et Word avec le plan Pro. Vous pouvez aussi intégrer votre portfolio sur votre propre site.',
      open: false
    },
    {
      q: 'Mes données sont-elles sécurisées ?',
      a: 'Absolument. Chiffrement end-to-end, conformité RGPD, et vous gardez le contrôle total sur vos données à tout moment.',
      open: false
    },
    {
      q: 'Puis-je annuler mon abonnement Pro à tout moment ?',
      a: 'Oui, sans frais ni préavis. Vous pouvez annuler depuis votre tableau de bord et votre plan repasse en Gratuit à la fin de la période.',
      open: false
    }
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }
}