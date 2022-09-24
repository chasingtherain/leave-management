import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {useMainContext} from '../../hooks/useMainContext'


function Tab() {
    const {activeTab, setActiveTab} = useMainContext()
    const homePageTabs = ["Home 主页", "Entitlement 年额", "History 历史"]
    const approvalPageTabs = ["Pending", "Approved"]
    const location = useLocation()
    console.log(location.pathname)

    const handleActiveTabClick = (event) => {
        setActiveTab(event.target.id)
    }

    const activePageTabs = () => {
        switch (location.pathname) {
            case "/":
                return (    
                <div className="tabs">
                    {homePageTabs.map(tab => <Link 
                        to='' 
                        key={tab} 
                        id={tab} 
                        className={activeTab === tab ? 'tab tab-lifted tab-active text-lg' : 'tab tab-lifted text-lg'} 
                        onClick={handleActiveTabClick}>{tab}</Link> )}
                </div>)
            case "/approve-leave":
                return (    
                    <div className="tabs">
                        {approvalPageTabs.map(tab => <Link 
                            to='' 
                            key={tab} 
                            id={tab} 
                            className={activeTab === tab ? 'tab tab-lifted tab-active text-lg' : 'tab tab-lifted text-lg'} 
                            onClick={handleActiveTabClick}>{tab}</Link> )}
                    </div>)
            default:
                console.log("tab not found!")
                break;
        }
    }

    return (
        <>
            {activePageTabs()}
        </>
    )
}

export default Tab