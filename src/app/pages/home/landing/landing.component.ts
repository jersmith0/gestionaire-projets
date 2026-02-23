import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '../../../app.constants';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <span class="text-xl font-semibold text-white">
            {{ appName }}
          </span>
        </div>

        <!-- Liens centraux -->
        <div class="hidden md:flex items-center gap-10">
          <a href="#features" class="text-slate-300 hover:text-violet-400 transition-colors">Fonctionnalités</a>
          <a href="#testimonials" class="text-slate-300 hover:text-violet-400 transition-colors">Témoignages</a>
          <a href="#pricing" class="text-slate-300 hover:text-violet-400 transition-colors">Tarifs</a>
          <a href="#faq" class="text-slate-300 hover:text-violet-400 transition-colors">FAQ</a>
        </div>

        <!-- CTA -->
        <button class="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:shadow-[0_0_25px_-5px] hover:shadow-violet-600/40 transition-all duration-300 transform hover:scale-105" routerLink="/login">
          Connexion
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-screen pt-32 pb-20 px-6 flex items-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div class="max-w-5xl mx-auto text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Le portfolio qui fait<br>la différence en entretien
        </h1>

        <p class="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
          Démarquez-vous avec un site web personnel élégant et moderne. Aucune compétence en code requise.
        </p>

        <div class="flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <button class="px-8 py-4 rounded-xl bg-violet-600 text-white font-semibold text-lg hover:shadow-[0_0_25px_-5px] hover:shadow-violet-600/40 transition-all duration-300" routerLink="/login">
            Créer mon portfolio
          </button>
          <button class="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800/50 hover:border-violet-500/50 transition-all duration-300">
            Voir des exemples
          </button>
        </div>

        <!-- Stats rapides pour plus d'infos -->
      <div class="flex flex-row flex-wrap justify-center gap-6 md:gap-8">
  <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800 min-w-[140px] text-center flex-1 md:flex-none">
    <h3 class="text-3xl md:text-4xl font-bold text-violet-400 mb-2">500+</h3>
    <p class="text-slate-400 text-sm md:text-base">Portfolios créés</p>
  </div>

  <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800 min-w-[140px] text-center flex-1 md:flex-none">
    <h3 class="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">5 min</h3>
    <p class="text-slate-400 text-sm md:text-base">Temps moyen de création</p>
  </div>

  <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800 min-w-[140px] text-center flex-1 md:flex-none">
    <h3 class="text-3xl md:text-4xl font-bold text-violet-400 mb-2">100%</h3>
    <p class="text-slate-400 text-sm md:text-base">Satisfaction</p>
  </div>
</div>
      </div>
    </section>

    <!-- Features / Pourquoi nous choisir ? -->
    <section id="features" class="py-24 px-6 bg-slate-950">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Pourquoi nous choisir ?
        </h2>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <!-- Ultra Rapide -->
          <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-violet-600/50 hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
              <mat-icon class="text-violet-400 text-4xl">bolt</mat-icon>
            </div>
            <h3 class="text-2xl font-semibold mb-3 text-white">Ultra Rapide</h3>
            <p class="text-slate-400 leading-relaxed">
              Générez votre site en moins de 10 minutes chrono.
            </p>
          </div>

          <!-- 100% Gratuit -->
          <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-violet-600/50 hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
              <mat-icon class="text-cyan-400 text-4xl">paid</mat-icon>
            </div>
            <h3 class="text-2xl font-semibold mb-3 text-white">Mode Gratuit</h3>
            <p class="text-slate-400 leading-relaxed">
              Toutes les fonctionnalités de base sont gratuites, sans carte bancaire. Des options premium pour les besoins avancés.
            </p>
          </div>

          <!-- Design Moderne -->
          <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-violet-600/50 hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
              <mat-icon class="text-violet-400 text-4xl">brush</mat-icon>
            </div>
            <h3 class="text-2xl font-semibold mb-3 text-white">Design Moderne</h3>
            <p class="text-slate-400 leading-relaxed">
              Des templates épurés et professionnels qui impressionnent les recruteurs. Choisissez parmi 10+ designs optimisés pour le recrutement.
            </p>
          </div>

          <!-- Responsive -->
          <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-violet-600/50 hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
              <mat-icon class="text-cyan-400 text-4xl">devices</mat-icon>
            </div>
            <h3 class="text-2xl font-semibold mb-3 text-white">Responsive</h3>
            <p class="text-slate-400 leading-relaxed">
              Votre portfolio s'adapte parfaitement à tous les écrans (mobile, tablette, desktop). Testé sur 20+ appareils.
            </p>
          </div>

          <!-- Facile à utiliser -->
          <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-violet-600/50 hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
              <mat-icon class="text-violet-400 text-4xl">touch_app</mat-icon>
            </div>
            <h3 class="text-2xl font-semibold mb-3 text-white">Facile à utiliser</h3>
            <p class="text-slate-400 leading-relaxed">
              Interface intuitive, pas besoin de connaissances techniques.
            </p>
          </div>

          <!-- Sécurisé -->
          <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-violet-600/50 hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
              <mat-icon class="text-cyan-400 text-4xl">shield</mat-icon>
            </div>
            <h3 class="text-2xl font-semibold mb-3 text-white">Sécurisé</h3>
            <p class="text-slate-400 leading-relaxed">
              Vos données sont protégées avec chiffrement end-to-end et vous gardez le contrôle total. Conformité GDPR.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mockup / Preuve visuelle -->
    <section class="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Votre futur portfolio en un coup d’œil
        </h2>

        <div class="aspect-[16/9] bg-slate-900 flex items-center justify-center p-12 rounded-2xl border border-slate-800 shadow-xl mb-16">
          <svg class="w-full max-w-4xl opacity-90" viewBox="0 0 800 450" fill="none">
            <rect width="800" height="450" rx="20" fill="#0f172a"/>
            <rect x="40" y="80" width="200" height="300" rx="12" fill="#1e293b"/>
            <rect x="260" y="80" width="500" height="140" rx="12" fill="#334155"/>
            <rect x="260" y="240" width="240" height="140" rx="12" fill="#475569"/>
            <rect x="520" y="240" width="240" height="140" rx="12" fill="#64748b"/>
            <circle cx="100" cy="140" r="30" fill="#8b5cf6"/>
            <rect x="80" y="180" width="40" height="8" rx="4" fill="#64748b"/>
            <text x="400" y="60" fill="#94a3b8" font-size="24" font-weight="bold" text-anchor="middle">Portfolio Dashboard</text>
          </svg>
        </div>

        <p class="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
          Visualisez comment votre portfolio pourrait apparaître. Simple, élégant et efficace pour capter l'attention des recruteurs.
        </p>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-24 px-6 bg-slate-950">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Ce que disent nos utilisateurs
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <mat-card class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h4 class="text-lg font-semibold text-white">Alex M.</h4>
                <p class="text-slate-500">Développeur Frontend</p>
              </div>
            </div>
            <p class="text-slate-400 leading-relaxed">
              "Grâce à ce tool, j'ai décroché un entretien en 48h. Le design est impeccable et l'utilisation ultra-simple !"
            </p>
          </mat-card>

          <mat-card class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div>
                <h4 class="text-lg font-semibold text-white">Sarah L.</h4>
                <p class="text-slate-500">Designer UI/UX</p>
              </div>
            </div>
            <p class="text-slate-400 leading-relaxed">
              "J'ai pu personnaliser mon portfolio sans coder. Les templates sont magnifiques et les recruteurs adorent."
            </p>
          </mat-card>

          <mat-card class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div>
                <h4 class="text-lg font-semibold text-white">Marc T.</h4>
                <p class="text-slate-500">Product Manager</p>
              </div>
            </div>
            <p class="text-slate-400 leading-relaxed">
              "Outil gratuit et puissant. J'ai multiplié mes opportunités d'emploi grâce à un portfolio pro."
            </p>
          </mat-card>
        </div>
      </div>
    </section>

   <!-- Tarification -->
<section id="pricing" class="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
  <div class="max-w-6xl mx-auto text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
      Tarification 
    </h2>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Gratuit -->
      <mat-card class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative">
        <h3 class="text-2xl font-semibold mb-2 text-white">Gratuit</h3>
        <p class="text-4xl font-bold mb-6 text-violet-400">0 € /mois</p>
        <ul class="space-y-4 text-slate-400 mb-8 text-left">
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            1 portfolio
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Templates basiques
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Export HTML
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-red-400 text-sm">close</mat-icon>
            Thèmes premium
          </li>
        </ul>
        <button mat-stroked-button class="w-full py-3 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800/50" disabled>
          Plan actuel
        </button>
      </mat-card>

      <!-- Pro Mensuel -->
      <mat-card class="bg-slate-900/50 border border-violet-600 p-8 rounded-2xl scale-105 relative z-10 shadow-xl">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Meilleur valeur
        </div>
        <h3 class="text-2xl font-semibold mb-2 text-white">Pro</h3>
        <p class="text-4xl font-bold mb-2 text-cyan-400">9 €</p>
        <p class="text-sm text-cyan-400/80 mb-6">par mois</p>
        <ul class="space-y-4 text-slate-400 mb-8 text-left">
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Portfolios illimités
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Thèmes premium
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Export PDF/Word
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Support prioritaire
          </li>
        </ul>
        <a 
          href="https://buy.stripe.com/test_fZufZha107uY6uWeGR0ZW01"  

          target="_blank"
          mat-flat-button 
          color="primary"
          class="w-full py-3 rounded-xl"
        >
          Passer Pro maintenant
        </a>
      </mat-card>

      <!-- Pro Annuel -->
      <mat-card class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
        <h3 class="text-2xl font-semibold mb-2 text-white">Pro Annuel</h3>
        <p class="text-4xl font-bold mb-2 text-violet-400">90 €</p>
        <p class="text-sm text-violet-400/80 mb-6">par an · -20 %</p>
        <ul class="space-y-4 text-slate-400 mb-8 text-left">
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Tout du Pro mensuel
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Économisez 18 € par an
          </li>
          <li class="flex items-center gap-3">
            <mat-icon class="text-green-400 text-sm">check</mat-icon>
            Priorité sur les nouvelles fonctionnalités
          </li>
        </ul>
        <a 
          href="https://buy.stripe.com/test_14A6oHa10aHaaLc6al0ZW00"  

          target="_blank"
          mat-flat-button 
          color="accent"
          class="w-full py-3 rounded-xl"
        >
          Passer Pro Annuel
        </a>
      </mat-card>
    </div>

    <!-- Texte rassurant sous les cartes -->
    <p class="text-center text-slate-400 mt-12 text-sm">
      Paiement sécurisé par Stripe • Annulation à tout moment </p>
  </div>
</section>

    <!-- FAQ -->
    <section id="faq" class="py-24 px-6 bg-slate-950">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Questions fréquentes
        </h2>

        <mat-divider class="mb-8" />

        <div class="space-y-6">
          <div class="group">
            <div class="flex justify-between items-center cursor-pointer p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all">
              <h3 class="text-xl font-semibold text-white">Comment créer mon portfolio ?</h3>
              <mat-icon class="text-slate-400 group-hover:text-violet-400">expand_more</mat-icon>
            </div>
            <p class="p-4 text-slate-400 leading-relaxed">
              Inscrivez-vous, remplissez vos informations et ajoutez vos projets. Nous génèrons automatiquement votre portfolio.
            </p>
          </div>

          <mat-divider />

          <div class="group">
            <div class="flex justify-between items-center cursor-pointer p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all">
              <h3 class="text-xl font-semibold text-white">Est-ce vraiment gratuit ?</h3>
              <mat-icon class="text-slate-400 group-hover:text-violet-400">expand_more</mat-icon>
            </div>
            <p class="p-4 text-slate-400 leading-relaxed">
              Oui, les fonctionnalités de base sont gratuites. Les options premium sont disponibles pour plus de personnalisation.
            </p>
          </div>

          <mat-divider />

          <div class="group">
            <div class="flex justify-between items-center cursor-pointer p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all">
              <h3 class="text-xl font-semibold text-white">Puis-je exporter mon portfolio ?</h3>
              <mat-icon class="text-slate-400 group-hover:text-violet-400">expand_more</mat-icon>
            </div>
            <p class="p-4 text-slate-400 leading-relaxed">
              Oui, exportez en HTML, PDF ou intégrez-le directement sur votre site personnel.
            </p>
          </div>

          <mat-divider />

          <div class="group">
            <div class="flex justify-between items-center cursor-pointer p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all">
              <h3 class="text-xl font-semibold text-white">Mes données sont-elles sécurisées ?</h3>
              <mat-icon class="text-slate-400 group-hover:text-violet-400">expand_more</mat-icon>
            </div>
            <p class="p-4 text-slate-400 leading-relaxed">
              Absolument. Nous utilisons un chiffrement avancé et respectons les normes GDPR.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <!-- <section class="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Prêt à booster votre carrière ?
        </h2>
        <p class="text-xl text-slate-300 mb-12">
          Rejoignez des milliers de professionnels qui ont trouvé leur prochain job grâce à un portfolio exceptionnel.
        </p>
        <button class="px-10 py-5 rounded-xl bg-violet-600 text-white font-semibold text-lg hover:shadow-[0_0_30px_-5px] hover:shadow-violet-600/40 transition-all duration-300 transform hover:scale-105">
          Commencer maintenant
        </button>
      </div>
    </section> -->

    <!-- Footer -->
    <footer class="py-12 px-6 bg-slate-950 border-t border-slate-800">
      <div class="max-w-6xl mx-auto text-center text-slate-500">
        <div class="flex justify-center gap-12 md:gap-16 mb-6">
          <!-- X (Twitter) -->
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          <!-- GitHub -->
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>

          <!-- Discord -->
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3853-.3969-.8748-.6083-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8851 1.515.0699.0699 0 00-.032.0277C.5336 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0105c.1202.099.246.1981.372.2914a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914a.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6061 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>
        </div>
        <p>© {{ currentYear }} – Tous droits réservés. Politique de confidentialité | Conditions d'utilisation</p>
      </div>
    </footer>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 1s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LandingComponent {
  currentYear = new Date().getFullYear();
  appName = APP_NAME;
}