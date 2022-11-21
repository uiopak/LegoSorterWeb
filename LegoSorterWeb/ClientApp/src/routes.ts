import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home'; 
import Belt from './pages/belt'; 
import Config from './pages/config';
import ConfigData from './pages/config.data';
import PageWrapper from './pages/pageWrapper';
import RawBelt from './components/rawBelt';
import Control from './pages/control';
import About from './pages/about';
import Sessions from './pages/sessions';
import ConfigServer from './pages/configServer';


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
                component: About,
            }
        ]
    },
    {
        path: '/sessions',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: Sessions,
            }
        ]
    },
    {
        path: '/config',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: Config,
                //component: lazy(() => import('./pages/config')),
                data: ConfigData,
            }
        ]
        
    },
    {
        path: '/configServer',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: ConfigServer,
                //data: ConfigData,
            }
        ]

    },
    {
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
