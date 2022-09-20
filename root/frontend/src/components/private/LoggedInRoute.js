import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'

function LoggedInRoute() {
    const {currentUser} = useMainContext()
    console.log(currentUser)
    return (
    <div>
        {/* if user is not logged in, direct them to sign in page */}
        {(currentUser) ? <Outlet/> : <Navigate to = "/login"/>}
    </div>
    )
}

export default LoggedInRoute