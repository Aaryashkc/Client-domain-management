import React from 'react'
import logo from '../assets/logo.png'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User, Home, Database, Mail } from 'lucide-react'
import { Link } from "react-router-dom"

const Navbar = () => {
  const { logout, authUser } = useAuthStore()
  
  return (
    <div className='h-16 w-full bg-blue-900 text-white flex items-center justify-between px-4 md:px-8 lg:px-20 shadow-md'>
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
        <img className='h-10' src={logo} alt="Logo" />
      </Link>
      
      {authUser && (
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex gap-2 items-center  hover:text-blue-200 transition-colors py-2">
            <Home className="size-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link to="/clientlist" className="flex gap-2 items-center hover:text-blue-200 transition-colors py-2">
            <User className="size-5" />
            <span className="hidden sm:inline">Client List</span>
          </Link>
          <Link to="/serviceprovider" className="flex gap-2 items-center hover:text-blue-200 transition-colors py-2">
            <Database className="size-5" />
            <span className="hidden sm:inline">Service Provider</span>
          </Link>
          <Link to="/emaildashboard" className="flex gap-2 items-center hover:text-blue-200 transition-colors py-2">
            <Mail className="size-5" />
            <span className="hidden sm:inline">Email</span>
          </Link>

          <button 
            className="flex gap-2 items-center hover:text-blue-200 transition-colors py-2" 
            onClick={logout}
          >
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar