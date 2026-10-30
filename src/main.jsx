import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles.css'
import { store } from './app/store.js'
import PartsPage from './app/PartsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}><PartsPage /></Provider>
  </StrictMode>,
)
