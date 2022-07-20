import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import Home from './pages/home';
//import Config from './pages/config';
import AboutData from './pages/about.data';
import ConfigData from './pages/config.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/config',
/*    component: Config,*/
    component: lazy(() => import('./pages/config')),
    data: ConfigData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
