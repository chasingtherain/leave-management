import React from 'react'

function Table({headerType}) {

    const requestTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const historyTableHeader = ["Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const EntitlementTableHeader = ["Leave Type", "Validity", "Entitlement", "Quota used", "Available"]

    let header = (headerType === "entitlement") ? EntitlementTableHeader 
                                                        : (headerType === "request") ? requestTableHeader 
                                                        : historyTableHeader


    const mockEntitlementData = [
        ["Vacation Leave", "05.05.2022 - 04.02.2023", "1 days", "1 days", "0 days"],
        ["Medical Leave", "05.05.2022 - 31.12.2022", "1 days", "10 days", "0 days"],
    ]

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
            {mockEntitlementData.map(list =>            
            <tr>
                {list.map(listItem => <th>{listItem}</th>)}
            </tr>)}
            </tbody>
        </table>
    </div>
    )
}

export default Table