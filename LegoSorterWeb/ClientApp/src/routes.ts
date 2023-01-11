import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import Belt from './pages/belt';
import ControlApp from './pages/controlApp';
import ConfigWeb from './pages/configWeb';
import ConfigData from './pages/config.data';
import PageWrapper from './pages/pageWrapper';
import RawBelt from './components/rawBelt';
import ConfigApp from './pages/configApp';
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
        path: '/controlApp',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: ControlApp,
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
        path: '/configWeb',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: ConfigWeb,
                //component: lazy(() => import('./pages/config')),
                //data: ConfigData,
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
        path: '/configApp',
        component: PageWrapper,
        children: [
            {
                path: '/',
                component: ConfigApp,
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
