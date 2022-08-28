import React from 'react'
import { Link } from 'react-router-dom'

function Tab() {
    const activeTab = () => {

    }
    return (
    <div class="tabs">
        <Link to='/' className="tab tab-lifted">Home</Link> 
        <Link to='/' className="tab tab-lifted tab-active"> Leave Entitlement </Link> 
    </div>
    )
}

export default Tab