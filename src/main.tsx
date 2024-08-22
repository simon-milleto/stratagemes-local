import '@radix-ui/themes/styles.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Theme, ThemePanel } from '@radix-ui/themes';


import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <App />
      {/* <ThemePanel /> */}
    </Theme>
  </StrictMode>,
)
