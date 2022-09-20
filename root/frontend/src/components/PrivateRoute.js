import axios from 'axios'
import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useMainContext } from '../hooks/useMainContext'

export default function PrivateRoute() {
    const {currentUser, sessionToken} = useMainContext()
    
    // check if session storage is valid, server will return current user for FE to set

    return (
    <div>
        {/* if user is not logged in, direct them to sign up / sign in page; if logged in, direct to homepage */}
        {(currentUser) ? <Outlet/> : <Navigate to = "/"/>}
    </div>
    )
}