import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, provideFirestore } from '@angular/fire/firestore';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
export const appConfig: ApplicationConfig = {
  providers: [
       { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes,
       withComponentInputBinding(),
       withViewTransitions(),
       withPreloading(PreloadAllModules)), 
       provideFirebaseApp(() => initializeApp({ projectId: "ngproject-14f76",
         appId: "1:258483867463:web:f362701d9c2cd84c868662", 
         storageBucket: "ngproject-14f76.firebasestorage.app", 
         apiKey: "AIzaSyAVIRDrmmhym8ahlannLD1GMwS0NRrHp6w", 
         authDomain: "ngproject-14f76.firebaseapp.com",
          messagingSenderId: "258483867463" })),
           provideAuth(() => getAuth()),
            provideFirestore(() =>  initializeFirestore(getApp(), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      }),
          
          )]
};
