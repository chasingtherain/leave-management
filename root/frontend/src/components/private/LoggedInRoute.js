import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'

function LoggedInRoute() {
    const {currentUser} = useMainContext()

    return (
    <div>
        {/* if user is not logged in, direct them to sign in page */}
        {/* setting timeout to prevent logged in user refreshing page from being redirected to /login */}
        {(currentUser) ? <Outlet/> : setTimeout(() => <Navigate to = "/login"/>, 1000)} 
    </div>
    )
}

export default LoggedInRoute