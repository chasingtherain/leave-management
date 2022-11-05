import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMainContext } from '../../hooks/useMainContext'
import Loading from '../Loading'

function Navbar() {
    const {currentUser, setActiveTab, setCurrentUser, setCurrentLeaveSelection} = useMainContext()
    const url = `${process.env.REACT_APP_BACKENDURL}/logout`
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const signOutCurrentUser = () => {
        axios
            .post(url)
            .then((resp)=>{
                setIsLoading(true)
                if(resp.status === 200) {
                    toast.success("Log out successful / 已登出")
                    setIsLoading(false)
                    sessionStorage.removeItem('leaveMgtToken')
                    setCurrentUser(null)
                    navigate('/login')
                }
                else {
                    setIsLoading(false)
                    toast.error("failed to log out / 登出失败")
                }
            })
            .catch(err => {
                toast.warning("failed to log out")
                console.log("err: ", err)
            })
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
                    {currentUser && <Link to="/team" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Team</Link>}
                    
                    {/* manage user is only visible by admin user */}

                    {currentUser && (currentUser.isAdmin === "admin") && (<div className="dropdown dropdown-end dropdown-hover text-lg text-white cursor-pointer mx-2 py-4">
                        <label tabIndex={0}>Admin</label>
                        <ul tabIndex={0} className="absolute z-1 menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li className='text-slate-800'>
                                <Link 
                                    to="/approve-leave" 
                                    className="text-sm mx-2 cursor-pointer hover:text-gray-500"
                                    onClick={() => setActiveTab("Pending")}
                                    >Approve Leave</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/user-management" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Manage User</Link>
                            </li> 
                            <li className='text-slate-800'>
                                <Link to="/dashboard" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Dashboard</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/set-work-day" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Set Work Days</Link>
                            </li>
                            <li className='text-slate-800'>
                                <Link to="/set-leave-entitlement" className="text-sm mx-2 cursor-pointer hover:text-gray-500">Set Entitlement</Link>
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
                {isLoading && <Loading/>}
        </div>
        )
}

export default Navbar