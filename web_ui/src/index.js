import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Добавляем заголовки для предотвращения кеширования
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

// Очищаем кеш при загрузке
window.addEventListener('load', () => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
});

// Добавляем мета-теги для предотвращения кеширования
const meta = document.createElement('meta');
meta.httpEquiv = 'Cache-Control';
meta.content = 'no-cache, no-store, must-revalidate';
document.head.appendChild(meta);

const meta2 = document.createElement('meta');
meta2.httpEquiv = 'Pragma';
meta2.content = 'no-cache';
document.head.appendChild(meta2);

const meta3 = document.createElement('meta');
meta3.httpEquiv = 'Expires';
meta3.content = '0';
document.head.appendChild(meta3);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
