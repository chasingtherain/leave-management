import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'

export default function AdminRoute() {
    const {currentUser} = useMainContext()

    return (
    <div>
        {/* if user is admin, direct them to admin routes; else direct to homepage */}
        {(currentUser && currentUser.isAdmin === "admin") ? <Outlet/> : <Navigate to = "/"/>}
    </div>
    )
}