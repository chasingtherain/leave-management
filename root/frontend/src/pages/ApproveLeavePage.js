import React from 'react'
import Tab from '../components/layout/Tab'
import Table from '../components/layout/Table'
import { useMainContext } from '../hooks/useMainContext'

function ApproveLeavePage() {
  const {activeTab} = useMainContext()
  const activeTabSelection = (activeTab) => {
    switch (activeTab) {
        case "Pending":
            return (<>
              <h1 className='text-xl my-6 text-center'>Pending for Approval</h1>
              <Table headerType="approval"/>
            </>)
        case "Approved":
            return (<>
              <h1 className='text-xl mb-6 text-center'>Approval History</h1>
              <Table headerType="approvalHistory"/>
            </>)
        default:
            console.log("tab not found!")
            break;
    }
  }

  return (
        <div className='flex flex-col justify-between mt-8'> 
            <Tab/>
            {activeTabSelection(activeTab)}
        </div>
  )
}

export default ApproveLeavePage