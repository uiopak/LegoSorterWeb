import { render } from 'solid-js/web';
import './index.css';
import { Router } from 'solid-app-router';
import App from './app';
import { createEffect } from 'solid-js';
import { themeChange } from 'theme-change'


createEffect(() => {
  themeChange(false)
  // 👆 false parameter is required for react project
})

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);
