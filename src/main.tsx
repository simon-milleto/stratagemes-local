import '@radix-ui/themes/styles.css';

import { Theme } from '@radix-ui/themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';


import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <App />
      {/* <ThemePanel /> */}
    </Theme>
  </StrictMode>,
)
