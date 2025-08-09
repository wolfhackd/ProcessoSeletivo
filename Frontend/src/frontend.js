import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const elem = document.getElementById('root');

if (!elem) throw new Error('Elemento #root não encontrado');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
