import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Directory from './components/Directory/Directory'
import Profile from './components/Profile/Profile'
function App() {

  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Directory />} />
          <Route path='/profile/:id' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
