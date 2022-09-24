import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import '../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment-timezone'

function TeamCalendar() {
    moment.tz.setDefault('Asia/Singapore')
    const localizer = momentLocalizer(moment)
    console.log(new Date(2022, 9, 10))
    console.log(new Date("30 Aug 2022"))
    console.log(new Date("30 Aug 2022"))
    const events = [
        {
            id: 0,
            title: 'Huangxi on leave',
            allDay: true,
            start: new Date(2022, 8, 9),
            end: new Date(2022, 8, 12),
          },
    ]

    return (
        <div className="flex flex-col justify-start items-center mt-[3%]">
            <Calendar
            localizer={localizer}
            events={events}
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