import React, { useEffect, useState } from 'react';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress'; // Import InertiaProgress

// v2 - fix mixed content behind reverse proxy

// npm install @inertiajs/progress
// Menambahkan InertiaProgress untuk menampilkan progress bar
InertiaProgress.init({
  color: '#4B89FF', 
  showSpinner: true, 
});

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
