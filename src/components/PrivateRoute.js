import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
    // const {user} = useAuthContext()
    const user = true

    return (
    <div>
        {/* if user is not logged in, direct them to sign up / sign in page; if logged in, direct to homepage */}
        {(user) ? <Outlet/> : <Navigate to = "/"/>}
    </div>
    )
}