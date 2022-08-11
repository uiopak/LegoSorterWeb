import { render } from 'solid-js/web';
import './index.css';
import { Router } from 'solid-app-router';
import App from './app';
import { createEffect } from 'solid-js';
import { themeChange } from 'theme-change'
import { ConectionContext, ConectionProvider, makeConnectionContext } from "./contexts/connectionContext"


createEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
})

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
