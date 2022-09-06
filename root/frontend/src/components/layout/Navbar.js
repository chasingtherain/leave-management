import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMainContext } from '../../hooks/useMainContext'

function Navbar() {
    const {baseBackEndUrl, currentUser, setCurrentUser} = useMainContext()
    const url = `${baseBackEndUrl}/logout`
    const navigate = useNavigate()

    const signOutCurrentUser = async () => {
        const resp = await axios.post(url)
        console.log(resp)
        if(resp.status === 200) {
            toast.success("Log out successful")
            setCurrentUser(null)
            navigate('/login')
        }
        else {toast.error("failed to log out")}
    }
    return (
        <div className='flex justify-between navbar bg-slate-800'>
                <div className="navbar-start">
                    {
                        <button className="btn btn-ghost normal-case text-xl">
                            {/* icon only links to homepage if user is logged in */}
                            {!currentUser && <div className='text-slate-50'>LEAVE <span className="text-sky-400">PLANS</span> </div>}
                            {currentUser && <Link to="" className='text-slate-50'>LEAVE <span className="text-sky-400">PLANS</span> </Link>}
                        </button>
                    }

                </div>
                <div className="navbar-end hidden lg:flex mr-3">
                    {/* if user is signed in, sign up and sign in page will be hidden */}
                    {!currentUser && <Link to="/login" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Login</Link>}
                    {currentUser && <Link to="/profile" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Profile</Link>}
                    
                    {/* manage user is only visible by admin user */}
                    {currentUser && (currentUser.isAdmin !== "user") && <Link to="/user-management" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Manage User</Link>}
                    
                    {/* if user is not signed in, log out will be hidden */}
                    {currentUser && <Link to="/login" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400" onClick={signOutCurrentUser}>Log Out</Link>}
                </div>
        </div>
        )
}

export default Navbar