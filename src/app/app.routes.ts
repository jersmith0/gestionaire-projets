import { Routes } from '@angular/router';
import { APP_NAME } from './app.constants';

import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);


export const routes: Routes = [

    {
        path:'login',
        title: `Connexion - ${APP_NAME }`,
        loadComponent:() => import ('./pages/login/login.component'),
        // ...canActivate(redirectLoggedInToHome)
    }, 


    {
        path:'home',
        title: `${APP_NAME }`,
        loadComponent:() => import ('./pages/home/home.component'),
        // ...canActivate(redirectUnauthorizedToLogin),
        children:[
            {
                path:'profil',
                title: `profil- ${APP_NAME }`,
                loadComponent: () => import('./pages/home/infos/infos.component')
                 .then(m => m.InfosComponent),
            },
          
            {
                path:'Projets',
                title: `Projets - ${APP_NAME }`,
                loadComponent: () => import('./pages/home/projects/projects.component')
            },
            {
            path: 'goals',
            title: `Goals / OKRs - ${APP_NAME}`,
            loadComponent: () => import('./pages/home/goal/goal.component').then(m => m.GoalsComponent)
            },
             {
                path:'contributors',
                title: `Contributeurs - ${APP_NAME }`,
                loadComponent: () => import('./pages/home/contributors/contributors.component'),
                children:[
                    {
                        path:'active',
                        title: `Contributeurs actifs - ${APP_NAME }`,
                        loadComponent: () => import('./pages/home/contributors/active/active.component')
                    },
                    {
                        path:'achived',
                        title: `Contributeurs archives- ${APP_NAME }`,
                        loadComponent: () => import('./pages/home/contributors/achived/achived.component')
                    },
                    {
                       path:'',
                       redirectTo: 'active',
                       pathMatch: 'full'
                    }
                ],
            },
              {
                  path:'',
                  redirectTo: 'projects',
                  pathMatch:'full'
             },
        ],
    },

    

    {
        path:'project/:id',
        title: ` Chargement du projet... - ${APP_NAME }`,
        loadComponent:() => import ('./pages/project/project.component'),
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
                path:'visual',
                title: `visual- ${APP_NAME }`,
                loadComponent: () => import('./pages/home/portfolio/porfolio.component')
                 .then(m => m.PortfolioComponent),
            },

        {
                path:'',
                title: `landing- ${APP_NAME }`,
                loadComponent: () => import('./pages/home/landing/landing.component')
                 .then(m => m.LandingComponent),
            },

    {
        path:'**',
        redirectTo: 'projects',
    }
];
