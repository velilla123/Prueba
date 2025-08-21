import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth-guard';
import { provideHttpClient } from '@angular/common/http';
import { ProyectosResolver } from './pages/proyectos/proyectos.resolver';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        children: [
            {
                path: 'inicio',
                loadComponent: () => import('./pages/dashboard/dashboard-inicio').then(m => m.DashboardInicioComponent)
            },
            {
                path: 'proyectos',
                loadComponent: () => import('./pages/proyectos/proyectos').then(m => m.Proyectos),
                resolve: {
                    proyectosData: ProyectosResolver
                }
            },
            {
                path: 'proyectos/:id',
                loadComponent: () => import('./pages/proyecto-detalle/proyecto-detalle').then(m => m.ProyectoDetalle),
            },
            { path: '', redirectTo: 'inicio', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

export const appConfig = {
    providers: [
        provideHttpClient()
    ]
};
