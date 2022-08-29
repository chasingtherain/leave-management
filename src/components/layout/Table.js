import React from 'react'

function Table({headerType}) {

    const requestTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const historyTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const entitlementTableHeader = ["Leave Type", "Validity", "Entitlement", "Quota used", "Available"]

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

    let header = (headerType === "entitlement") ? entitlementTableHeader 
                                                        : (headerType === "request") ? requestTableHeader 
                                                        : historyTableHeader

    let tableContent = (headerType === "entitlement") ? mockEntitlementData 
                                                        : (headerType === "request") ? mockRequestData 
                                                        : mockHistoryData



    return (
    <div class="overflow-x-auto">
        <table class="table w-full">
            {/* <!-- head --> */}
            <thead>
            <tr>
                {header.map(headerName => <th>{headerName}</th>)}
            </tr>
            </thead>
            <tbody>
            {tableContent.map(list =>            
            <tr>
                {list.map(listItem => <th>{listItem}</th>)}
            </tr>)}
            </tbody>
        </table>
    </div>
    )
}

export default Table