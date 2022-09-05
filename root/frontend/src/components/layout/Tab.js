import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useMainContext} from '../../hooks/useMainContext'

function Tab() {
    const tabNames = ["Home", "Leave Entitlement"]
    const {activeTab, setActiveTab} = useMainContext()
    const handleActiveTabClick = (event) => {
        setActiveTab(event.target.id)
    }
    return (
    <div className="tabs">
        {tabNames.map(tab => <Link 
            to='' 
            key={tab} 
            id={tab} 
            className={activeTab === tab ? 'tab tab-lifted tab-active text-lg' : 'tab tab-lifted text-lg'} 
            onClick={handleActiveTabClick}>{tab}</Link> )}
    </div>
    )
}

export default Tab