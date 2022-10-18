import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment-timezone'
import { useMainContext } from '../hooks/useMainContext'

function TeamCalendar() {
    const {teamCalendar} = useMainContext()
    console.log(teamCalendar)
    const approvedTeamLeave = teamCalendar.filter(entry => entry.status === "approved")
    console.log(approvedTeamLeave)
    moment.tz.setDefault('Asia/Singapore')
    const localizer = momentLocalizer(moment)

    const eventPropGetter = (event) => {
        let backgroundColor;
        console.log(event)
        switch (event.type) {
            case "holiday":
                backgroundColor = '#37C399'
                break;
            case "workday":
                backgroundColor = '#F77272'
                break;
            default:
                backgroundColor = '#3ABEF8';
        }
        return { style: { backgroundColor } }
    }

    return (
        <div className="flex flex-col justify-start items-center mt-[3%]">
            <Calendar
            localizer={localizer}
            events={approvedTeamLeave}
            startAccessor="start"
            endAccessor="end"
            showAllEvents
            style={{ height: 700, width: "80%"}}
            view='month' views={['month']}
            eventPropGetter={eventPropGetter}
            />
        </div>
    )
}

export default TeamCalendar