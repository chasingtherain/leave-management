import React from 'react'

function Table({headerType}) {

    const requestTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const historyTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const entitlementTableHeader = ["Leave Type", "Validity", "Entitlement", "Quota used", "Available"]
    const userManagementTableHeader = ["Name","Email","Created on","Last updated on","Account type","RO","RO email", "CO","CO email","Status","Action"]
    

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
        ["Medical Leave", "05.04.2022 - 06.04.2022", "1 days", "03.04.2022", "1 days", "Pending", "Cancel Leave"],
        ["Vacation Leave", "05.05.2022 - 06.05.2022", "1 days", "03.05.2022", "1 days", "Pending", "Cancel Leave"],
    ]
    
    const mockHistoryData = [
        ["Vacation Leave", "05.04.2022 - 06.04.2022", "1 days", "03.04.2022", "1 days", "Approved"],
        ["Medical Leave", "05.05.2022 - 31.12.2022", "1 days", "04.04.2022", "1 days", "Approved"],
        ["Vacation Leave", "05.05.2022 - 31.12.2022", "1 days", "05.04.2022", "1 days", "Approved"],
    ]

    const mockUserData = [
        ["He Hua", "hehua@163.com", "03.04.2022", "03.04.2022", "admin", "Shen Yun Xi", "yunxi@mfa.sg", "Mao Se", "maose@mail.com", "Active", "Update"],
        ["Yan Fang", "yanfang@163.com", "03.04.2022", "03.04.2022", "user", "Shen Yun Xi", "yunxi@mfa.sg", "Yan Fang", "huangxi@163.com", "Active", "Update"],
        ["Huang Xi", "huangxi@163.com", "03.04.2022", "03.04.2022", "user", "Shen Yun Xi", "yunxi@mfa.sg", "Huang Xi", "yanfang@163.com", "Active", "Update"],


    ]

    const tableHeaderSelection = (headerType) => {
        switch (headerType) {
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
            case "entitlement":
                return mockEntitlementData.map(list => <tr>{list.map(listItem => <th>{listItem}</th>)}</tr>)
            case "request":
                return mockRequestData.map(list => <tr>{list.map(listItem => <th>{listItem}</th>)}</tr>)
            case "history":
                return mockHistoryData.map(list => <tr>{list.map(listItem => <th>{listItem}</th>)}</tr>)
            case "user-management":
                return mockUserData.map(list => <tr>{list.map(listItem => <th>{listItem}</th>)}</tr>)
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    return (
    <div class="overflow-x-auto">
        <table class="table w-full">
            {/* <!-- head --> */}
            <thead>
            <tr>
                {tableHeaderSelection(headerType)}
            </tr>
            </thead>
            <tbody>
                {tableDataSelection(headerType)}
            </tbody>
        </table>
    </div>
    )
}

export default Table