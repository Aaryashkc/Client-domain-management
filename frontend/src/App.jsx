import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import DataEntry from './pages/DataEntry'
import LoginPage from './pages/LoginPage'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { LoaderCircle } from 'lucide-react'
import ClientPage from './pages/ClientPage'
import AddService from './pages/AddService'
import ServiceProvider from './pages/ServiceProvider'
import AddProvider from './pages/AddProvider'
import EmailDashboard from './pages/EmailDashboard'

const App = () => {
    const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
    useEffect(()=>{
      checkAuth()
    }, [checkAuth]);
  
    console.log(authUser);
  
    if(isCheckingAuth && !authUser) return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='size-20 animate-spin' />
      </div>
    )
  return (
    <div>
      <Navbar/>

        <Routes>
          
          <Route exact path="/" element={authUser? <Dashboard /> :<Navigate to="/login" />} />
          <Route path="/dataentry" element={authUser ? <DataEntry /> : <Navigate to='/login'/>} />
          <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to='/'/>} />
          <Route path="/clientlist" element={authUser ? <ClientPage /> : <Navigate to='/login'/>} />
          <Route path="/addservice" element={authUser ? <AddService /> : <Navigate to='/login'/>} />
          <Route path="/serviceprovider" element={authUser ? <ServiceProvider /> : <Navigate to='/login'/>} />
          <Route path="/addprovider" element={authUser ? <AddProvider /> : <Navigate to='/login'/>} />
          <Route path="/emaildashboard" element={authUser ? <EmailDashboard /> : <Navigate to='/login'/>} />

        </Routes>
        <Toaster/>
    </div>
  )
}

export default App
