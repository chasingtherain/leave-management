import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment-timezone'
import { useMainContext } from '../hooks/useMainContext'

function TeamCalendar() {
    const {teamCalendar} = useMainContext()
    console.log(teamCalendar)
    moment.tz.setDefault('Asia/Singapore')
    const localizer = momentLocalizer(moment)

    console.log(new Date(2022, 8, 9))
    
    const events = [
        {
            id: 0,
            title: 'Huangxi on leave',
            start: new Date(2022, 8, 9),
            end: new Date(2022, 8, 9),
        },
    ]

    return (
        <div className="flex flex-col justify-start items-center mt-[3%]">
            <Calendar
            localizer={localizer}
            events={teamCalendar}
            startAccessor="start"
            endAccessor="end"
            showAllEvents
            style={{ height: 700, width: "80%"}}
            view='month' views={['month']}
            />
        </div>
    )
}

export default TeamCalendar