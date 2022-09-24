import React, { useState } from 'react'
import { Calendar, DateObject } from "react-multi-date-picker"
import { toast } from 'react-toastify';
import axios from 'axios';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { useMainContext } from '../hooks/useMainContext';
function SetWorkdayPage() {
    const {holidaySelection, setHolidaySelection, workDaySelection, setWorkDaySelection} = useMainContext()
    const date = new Date()
    const datePanel = new DateObject()

    const [activeUpdateButton, setActiveUpdateButton] = useState(true)
    const [updateBtnLoading, setUpdateBtnLoading] = useState()

    console.log(new DateObject().add(2, "days"))
    console.log(datePanel.format('DD MMM YYYY'))

    const handleWorkDaySelection = (date) => {
        setWorkDaySelection(date)
        setActiveUpdateButton(false)
        console.log(workDaySelection)
        console.log(date)
    }

    const handleHolidaySelection = (date) => {
        setHolidaySelection(date)
        setActiveUpdateButton(false)
        console.log(date)
    }

    const handleSubmitChange = () => {
        const url = `${process.env.REACT_APP_BACKENDURL}/admin/set-work-day`
        const workDayData = {
            workDaySelection: workDaySelection,
            holidaySelection: holidaySelection,
            entity: "chengdu" 
        }
        if(window.confirm("Update changes?")){
            axios
                .post(url, workDayData)
                .then((res => {
                    console.log(res)
                    toast.success("Update successful")
                }))
                .catch(err => console.log(err))
            setActiveUpdateButton(true)
        }
    }

    return (
    <div className=''>
        <div className='flex flex-col justify-start items-center'>
            <h1 className='text-xl mt-6 text-center'>Work Days 补休</h1>
            <p className='my-2 text-center'>The following weekends or rest days are work days in {date.getFullYear()}:</p>
            <Calendar
                
                multiple
                numberOfMonths={3}
                format='DD MMM YYYY'
                value={workDaySelection}
                onChange={handleWorkDaySelection}
                className=''
                plugins={[<DatePanel position="left" sort="date" header={`Work Days (${workDaySelection.length})`}/>]} 
            />
        </div>
        <div className='flex flex-col justify-start items-center'>
            <h1 className='text-xl mt-6 text-center'>Public Holidays</h1>   
            <p className='mt-2 mb-4'>The following days are rest days / off in lieu in {date.getFullYear()}:</p>
                <Calendar
                    multiple
                    numberOfMonths={3}
                    format='DD MMM YYYY'
                    value={holidaySelection}
                    onChange={handleHolidaySelection}
                    plugins={[<DatePanel position="left" sort="date" header={`Off in lieu (${holidaySelection.length})`}/>]}
                />
        </div>

        <div className='flex flex-col justify-start items-center'>
                <button 
                    type="submit" 
                    className={`btn text-white px-32 text-center text-base font-semibold shadow-md rounded-lg mt-6 ${updateBtnLoading}`}
                    disabled={activeUpdateButton}
                    onClick={handleSubmitChange}
                >
                    Update
                </button>
        </div>

    </div>
    )
}

export default SetWorkdayPage