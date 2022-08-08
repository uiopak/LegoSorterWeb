import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import Home from './pages/home'; 
import Belt from './pages/belt'; 
//import Config from './pages/config';
import AboutData from './pages/about.data';
import ConfigData from './pages/config.data';
import PageWrapper from './pages/pageWrapper';
import RawBelt from './components/rawBelt';
import Control from './pages/control';


export const routes: RouteDefinition[] = [
    {
        path: '/',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: Home,
            }
        ]
    }, {
        path: '/belt',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: Belt,
            }
        ]
    }, {
        path: '/rawbelt',
        component: RawBelt,
    },

    {
        path: '/about',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: lazy(() => import('./pages/about')),
                data: AboutData,
            }
        ]
    },
    {
        path: '/config',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: lazy(() => import('./pages/config')),
                data: ConfigData,
            }
        ]
        
    }, {
        path: '/control',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: Control,
            }
        ]
    }, {
        path: '**',
        component: PageWrapper,
        children: [
            {
                path: '**',
                component: lazy(() => import('./errors/404')),
            }
        ]
        
    },
];
