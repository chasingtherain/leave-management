import React from 'react'
import { Link } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'
import CancelLeaveModal from '../modal/CancelLeaveModal'

function Table({headerType}) {
    const {userList} = useMainContext()

    // table headers
    const requestTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const historyTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const entitlementTableHeader = ["Leave Type", "Validity", "Entitlement", "Quota used", "Available"]
    const changeLogHeader = ["Time","Operation Type", "Changes made", "Changed by"]
    const userManagementTableHeader = ["Name","Email","Created on","Last updated on","Type","RO","RO email", "CO","CO email","Action"]
    
    // table data
    const mockEntitlementData = [
        ["Vacation Leave", "05.05.2022 - 04.02.2023", "1 days", "1 days", "0 days"],
        ["Medical Leave", "05.05.2022 - 31.12.2022", "1 days", "10 days", "0 days"],
        ["Hospitalisation Leave", "05.05.2022 - 31.12.2022", "46 days", "0 days", "46 days"],
        ["Maternity Leave", "05.05.2022 - 31.12.2022", "160 days", "days", "160 days"],
        ["No Pay Leave", "05.05.2022 - 31.12.2022", "1 days", "10 days", "0 days"],
        ["Childcare Leave", "05.05.2022 - 31.12.2022", "3 days", "2 days", "1 days"],
        ["Medical Leave", "05.05.2022 - 31.12.2022", "1 days", "14 days", "13 days"],
    ]

    const mockRequestData = [
        ["Medical Leave", "05.04.2022 - 06.04.2022", "1 days", "03.04.2022", "1 days"],
        ["Vacation Leave", "05.05.2022 - 06.05.2022", "1 days", "03.05.2022", "1 days"],
    ]
    
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
                return changeLogHeader.map(headerName => <th>{headerName}</th>)
            case "entitlement":
                return entitlementTableHeader.map(headerName => <th>{headerName}</th>)
            case "request":
                return requestTableHeader.map(headerName => <th>{headerName}</th>)
            case "history":
                return historyTableHeader.map(headerName => <th>{headerName}</th>)
            case "user-management":
                return userManagementTableHeader.map(headerName => <th>{headerName}</th>)
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    const tableDataSelection = (headerType) => {
        switch (headerType) {
            case "change-log":
                return changeLogData.map(list => <tr>{list.map(listItem => <td>{listItem}</td>)}</tr>)
            case "entitlement":
                return mockEntitlementData.map(list => <tr>{list.map(listItem => <td>{listItem}</td>)}</tr>)
            case "request":
                return mockRequestData.map(list => 
                    (
                        <tr>
                            {list.map(listItem => <td>{listItem}</td>)}
                            <td><div class="badge badge-neutral rounded-sm">Pending</div></td>
                            <td>
                                {/* <button className='btn btn-sm btn-error' onClick={handleCancelLeaveClick}>cancel 取消</button> */}
                                <CancelLeaveModal/>
                            </td>
                        </tr>
                    ))
            case "history":
                return mockHistoryData.map(list => 
                    (
                        <tr>
                            {list.map(listItem => <td>{listItem}</td>)}
                            <td><div class="badge badge-success rounded-sm">Approved</div></td>
                        </tr>
                    ))
            case "user-management":
                return userList.map(list => 
                        (
                            <tr>                                 
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
    <div class="overflow-x-auto">
        <table class="table hover w-full">
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