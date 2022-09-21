import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMainContext } from '../../hooks/useMainContext'

function Navbar() {
    const {currentUser, setActiveTab, setCurrentUser, setCurrentLeaveSelection} = useMainContext()
    const url = `${process.env.REACT_APP_BACKENDURL}/logout`
    const navigate = useNavigate()

    const signOutCurrentUser = async () => {
        const resp = await axios.post(url)
        console.log(resp)
        if(resp.status === 200) {
            toast.success("Log out successful")
            sessionStorage.removeItem('leaveMgtToken')
            setCurrentUser(null)
            navigate('/login')
        }
        else {toast.error("failed to log out")}
    }

    const clearState = () => {
        setCurrentLeaveSelection("Annual Leave 年假")
    }
    return (
        <div className='flex justify-between navbar bg-slate-800'>
                <div className="navbar-start">
                    {
                        <button className="btn btn-ghost normal-case text-xl" onClick={() => setActiveTab("Home 主页")}>
                            {/* icon only links to homepage if user is logged in */}
                            {!currentUser && <div className='text-slate-50'>LEAVE <span className="text-sky-400">PLANS</span> </div>}
                            {currentUser && <Link onClick={clearState} to="" className='text-slate-50'>LEAVE <span className="text-sky-400">PLANS</span> </Link>}
                        </button>
                    }

                </div>
                <div className="navbar-end hidden lg:flex mr-3">
                    {/* if user is signed in, sign up and sign in page will be hidden */}
                    {!currentUser && <Link to="/login" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Login</Link>}
                    {currentUser && <Link to="/profile" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Profile</Link>}
                    
                    {/* manage user is only visible by admin user */}

                    {currentUser && (currentUser.isAdmin === "admin") && (<div className="dropdown dropdown-end dropdown-hover text-lg mx-2 text-white cursor-pointer p-4">
                        <label tabIndex={0}>Admin</label>
                        <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li className='text-slate-800'>
                                <Link to="/user-management" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Manage User</Link>
                            </li> 
                            <li className='text-slate-800'>
                                <Link 
                                    to="/approve-leave" 
                                    className="text-sm mx-2 cursor-pointer hover:text-gray-500"
                                    onClick={() => setActiveTab("Pending")}
                                    >Approve Leave</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/create-new-leave" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Create New Leave</Link>
                            </li>
                        </ul>
                    </div>)
                    }
                    {/* if user is not signed in, log out will be hidden */}
                    {currentUser && <Link to="/login" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400" onClick={signOutCurrentUser}>Log Out</Link>}
                </div>
        </div>
        )
}

export default Navbar