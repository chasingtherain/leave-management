import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    const signOutCurrentUser = () => {
        // signOut(auth).then(() => {
        //     // Sign-out successful.
        //     dispatch({type: "LOGOUT", payload: null})

        //     toast.success("Log Out Successful!")
        //     navigate('/sign-in')

        //   }).catch((error) => {
        //     // An error happened.
        //     console.log(error,"sign out was unsuccessful");
        //   });
    }
    return (
        <div className='flex justify-between navbar bg-slate-800'>
                <div className="navbar-start">
                    {
                        <button className="btn btn-ghost normal-case text-xl">
                            <Link to="/" className='text-slate-50'>LEAVE <span className="text-sky-400">PLANS</span> </Link>
                        </button>
                    }

                </div>
                <div className="navbar-end hidden lg:flex mr-3">
                    {/* if user is signed in, sign up and sign in page will be hidden */}
                    {<Link to="/sign-in" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Login</Link>}
                    {<Link to="/profile" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Profile</Link>}
                    {<Link to="/user-management" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400">Manage User</Link>}
                    
                    {/* if user is not signed in, log out will be hidden */}
                    {<Link to="/" className="text-lg mx-2 text-white cursor-pointer hover:text-gray-400" onClick={signOutCurrentUser}>Log Out</Link>}
                </div>
        </div>
        )
}

export default Navbar