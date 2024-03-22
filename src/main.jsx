import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
console.log(process.env.REACT_APP_BASEURL);
axios.defaults.baseURL = process.env.REACT_APP_BASEURL
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  // </React.StrictMode>,
)
