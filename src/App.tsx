import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  if (!isClient && typeof window !== 'undefined') {
    setIsClient(true)
  }

  return (
    <>
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: isClient ? '#4caf50' : '#f44336',
          color: 'white',
          padding: '0.5rem 1rem',
          zIndex: 9999,
          borderRadius: '0 0 10px 0',
          fontWeight: 'bold'
      }}>
        {isClient ? 'Hydrated on Client' : 'Rendered on Server (SSR)'}
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
