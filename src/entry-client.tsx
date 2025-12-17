import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App' 

// Get initial data from server
const initialData = (window as any).__INITIAL_DATA__ || {};

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} /> 
    </BrowserRouter>
  </StrictMode>,
)