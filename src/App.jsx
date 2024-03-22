import { useState } from 'react'
import './App.css'
import RouterContainer from './routerContainer/RouterContainer'
import AppContext from './context/AppContext'

function App() {
  return (
    <>
    <AppContext>
      <RouterContainer/>  
    </AppContext>
    </>
  )
}

export default App
