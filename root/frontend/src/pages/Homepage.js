import React from 'react'
import { Link } from 'react-router-dom'
import Tab from '../components/layout/Tab'
import Table from '../components/layout/Table'
import { useMainContext } from '../hooks/useMainContext'

function Homepage() {
    const {activeTab} = useMainContext()
    const childCareYear = new Date().getFullYear() - 2

    const activeTabSelection = (activeTab) => {
        switch (activeTab) {
            case "Home 主页":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave Request 休假请求</h1>
                    <Table headerType="request"/>
                </>)
            case "Entitlement 年额":
                return (<>
                    <h1 className='text-xl my-6 text-center'>Leave Entitlement 休假数</h1>
                    <Table headerType="entitlement"/>
                </>)
            case "History 历史":
                return (<>
                    <h1 className='text-xl mt-20 mb-6 text-center'>Leave History 休假历史</h1>
                    <Table headerType="history"/>
                </>)
            default:
                console.log("tab not found!")
                break;
        }
    }

    return (
    <div>
        <div className='flex justify-between'> 
            <Tab/>
            <Link to="/apply-leave">
                <button className='btn bg-black rounded-md mt-6 mr-6 px-6 text-lg'>Apply Leave 申请休假</button>
            </Link>
        </div>
        {/* based on user action, display active tab in homepage */}
        {
            activeTabSelection(activeTab)
        }

    </div>
    )
}

export default Homepage