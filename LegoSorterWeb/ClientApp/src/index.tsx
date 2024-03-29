import { render } from 'solid-js/web';
import './index.css';
import { Router } from '@solidjs/router';
import App from './app';
import { ConectionContext, ConectionProvider, makeConnectionContext } from "./contexts/connectionContext"


render(
    () => (
        <Router>
            <ConectionProvider>
                {/*<ConectionContext.Provider value={makeConnectionContext(false) }>*/}
                <App />
            </ConectionProvider>
            {/*</ConectionContext.Provider>*/}
        </Router>
    ),
    document.getElementById('root') as HTMLElement,
);
