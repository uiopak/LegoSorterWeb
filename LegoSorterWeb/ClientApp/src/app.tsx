import type { Component } from 'solid-js';
import { Link, useRoutes, useLocation } from 'solid-app-router';

import { routes } from './routes';
import Tc from './components/tc';

const App: Component = () => {
    const location = useLocation();
    const Route = useRoutes(routes);

    return (
        <div>
            <Route />
        </div>
    );
};

export default App;
