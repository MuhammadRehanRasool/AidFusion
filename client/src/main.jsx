import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CONSTANT } from './CONSTANT'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Load the Maps JS API with the key from .env; "ADDRESS" is the callback use-places-autocomplete registers.
const mapsScript = document.createElement('script')
mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${CONSTANT.GOOGLE_MAPS_API}&libraries=places&callback=ADDRESS`
mapsScript.defer = true
document.body.appendChild(mapsScript)
