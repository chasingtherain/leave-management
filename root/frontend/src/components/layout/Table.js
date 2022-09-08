import React from 'react'
import { Link } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'
import CancelLeaveModal from '../modal/CancelLeaveModal'
import InfoBubble from './InfoBubble'

function Table({headerType}) {
    const {currentUser, userList} = useMainContext()

    const currentUserLeave = currentUser.leave
    console.log(currentUserLeave)
    console.log(currentUserLeave.rollover)

    // table headers
    const requestTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const historyTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const entitlementTableHeader = ["Leave Type", "Entitlement ", "Quota used", "Available", "Note", "Bring Over to Next Year?"]
    const changeLogHeader = ["Time","Operation Type", "Changes made", "Changed by"]
    const userManagementTableHeader = ["Name","Email","Created on","Last updated on","Type","RO","RO email", "CO","CO email","Action"]
    
    // mock table data
    
    const mockHistoryData = [
        ["Vacation Leave", "05.04.2022 - 06.04.2022", "1 days", "03.04.2022", "1 days"],
        ["Medical Leave", "05.05.2022 - 31.12.2022", "1 days", "04.04.2022", "1 days"],
        ["Vacation Leave", "05.05.2022 - 31.12.2022", "1 days", "05.04.2022", "1 days"],
    ]

    const mockUserData = [
        ["He Hua", "hehua@163.com", "03.04.2022", "03.04.2022", "admin", "Shen Yun Xi", "yunxi@mfa.sg", "Mao Se", "maose@mail.com", "Active"],
        ["Yan Fang", "yanfang@163.com", "03.04.2022", "03.04.2022", "user", "Shen Yun Xi", "yunxi@mfa.sg", "Yan Fang", "huangxi@163.com", "Active"],
        ["Huang Xi", "huangxi@163.com", "03.04.2022", "03.04.2022", "user", "Shen Yun Xi", "yunxi@mfa.sg", "Huang Xi", "yanfang@163.com", "Active"],
        ["Fang", "fang@163.com", "03.04.2022", "03.04.2022", "user", "Shen Yun Xi", "yunxi@mfa.sg", "Zhang", "zhang@163.com", "Active"],
    ]

    const changeLogData = [
        ["04.04.2022", "Update", ["role changed to:", " admin"] , "yunxi@mfa.sg"],
        ["01.04.2022", "Add", ["new account added"] , "yunxi@mfa.sg"],
        ["03.07.2022", "Delete", ["account X deleted"] , "yunxi@mfa.sg"],
    ]
    
    const handleEditClick = (event) => {
        // identify user's id, send user's data to update user info form
        console.log(event.target.id)
    }

    const handleCancelLeaveClick = (event) => {
        // identify user's id, send user's data to update user info form
        console.log(event.target.id)
    }

    const tableHeaderSelection = (headerType) => {
        switch (headerType) {
            case "change-log":
                return changeLogHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "entitlement":
                return entitlementTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "request":
                return requestTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "history":
                return historyTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "user-management":
                return userManagementTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    const tableDataSelection = (headerType) => {
        switch (headerType) {
            case "change-log":
                return changeLogData.map((list, index) => <tr key={index}>{list.map(listItem => <td>{listItem}</td>)}</tr>)
            case "entitlement":
                return currentUserLeave.map((leave,index) => 
                    <tr key={index}>
                        <td key={index}>{leave.name}</td>
                        <td key={index}>{leave.entitlement}</td>
                        <td key={index}>{leave.used}</td>
                        <td key={index}>{leave.entitlement - leave.used}</td>
                        <td key={index}><InfoBubble info={leave.note}/></td>
                        <td key={index}>{(leave.rollover) ? "Yes" : "No"}</td>
                    </tr>)
            // case "request":
            //     return mockRequestData.map((list,index) => 
            //         (
            //             <tr key={index}>
            //                 {list.map((listItem,index) => <td key={index}>{listItem}</td>)}
            //                 <td><div className="badge badge-neutral rounded-sm">Pending</div></td>
            //                 <td>
            //                     {/* <button className='btn btn-sm btn-error' onClick={handleCancelLeaveClick}>cancel 取消</button> */}
            //                     <CancelLeaveModal/>
            //                 </td>
            //             </tr>
            //         ))
            case "history":
                return mockHistoryData.map((list,index) => 
                    (
                        <tr key={index}>
                            {list.map((listItem, index) => <td key={index}>{listItem}</td>)}
                            <td><div className="badge badge-success rounded-sm">Approved</div></td>
                        </tr>
                    ))
            case "user-management":
                return userList.map((list, index) => 
                        (
                            <tr key={index}>                                 
                                <td>{list.name}</td>    
                                <td>{list.email}</td>    
                                <td>{list.createdOn}</td>    
                                <td>{list.lastUpdatedOn}</td>    
                                <td>{list.isAdmin}</td>    
                                <td>{list.ro}</td>    
                                <td>{list.reportingEmail}</td>    
                                <td>{list.co}</td>    
                                <td>{list.coveringEmail}</td>     
                                <td><Link to ="/update-user"><button id={list[0]} className='btn btn-xs btn-neutral' onClick={handleEditClick}>edit</button></Link></td>
                            </tr>
                        ))
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    return (
    <div className="overflow-x-auto">
        <table className="table hover w-full">
            {/* <!-- head --> */}
            <thead>
            <tr>
                {tableHeaderSelection(headerType)}
            </tr>
            </thead>
            <tbody>
                {userList.length > 0 && tableDataSelection(headerType)}
            </tbody>
        </table>
    </div>
    )
}

export default Table