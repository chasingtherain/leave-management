import React, { useState } from 'react'
import { Calendar, DateObject } from "react-multi-date-picker"
import { toast } from 'react-toastify';
import axios from 'axios';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { useMainContext } from '../hooks/useMainContext';
import Loading from '../components/Loading';
function SetWorkdayPage() {
    const {currentHolidaySelection, setCurrentHolidaySelection, currentWorkdaySelection, setCurrentWorkdaySelection} = useMainContext()
    const date = new Date()
    const datePanel = new DateObject()

    const [disableUpdateButton, setDisableUpdateButton] = useState(true)
    const [updateBtnLoading, setUpdateBtnLoading] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [initialHolidaySelection] = useState(currentHolidaySelection)
    const [initialWorkdaySelection] = useState(currentWorkdaySelection)
    const [removedHolidaySelection, setRemovedHolidaySelection] = useState()
    const [removedWorkdaySelection, setRemovedWorkdaySelection] = useState()

    

    console.log(new DateObject().add(2, "days"))
    console.log(datePanel.format('DD MMM YYYY'))

    const handleWorkDaySelection = (date) => {
        setCurrentWorkdaySelection(date)
        setDisableUpdateButton(false)
    }
    
    const handleHolidaySelection = (date) => {
        setCurrentHolidaySelection(date)
        setDisableUpdateButton(false)
    }

    const handleSubmitChange = () => {
        const url = `${process.env.REACT_APP_BACKENDURL}/admin/set-work-day`

        const workdayData = {
            initialWorkdaySelection: initialWorkdaySelection,
            initialHolidaySelection: initialHolidaySelection,
            currentWorkdaySelection: currentWorkdaySelection,
            currentHolidaySelection: currentHolidaySelection,
            entity: "chengdu" 
        }
        console.log(workdayData)
        if(window.confirm("Update changes?")){
            setIsLoading(true)

            setTimeout(()=> {
                axios
                    .post(url, workdayData)
                    .then((res => {
                        setIsLoading(false)
                        console.log(res)
                        toast.success("Update successful")
                    }))
                    .catch(err => console.log(err))
            }, 1000)
            setDisableUpdateButton(true)
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
                value={currentWorkdaySelection}
                onChange={handleWorkDaySelection}
                className=''
                plugins={[<DatePanel position="left" sort="date" header={`Work Days (${currentWorkdaySelection.length})`}/>]} 
            />
        </div>
        <div className='flex flex-col justify-start items-center'>
            <h1 className='text-xl mt-6 text-center'>Public Holidays</h1>   
            <p className='mt-2 mb-4'>The following days are rest days / off in lieu in {date.getFullYear()}:</p>
                <Calendar
                    multiple
                    numberOfMonths={3}
                    format='DD MMM YYYY'
                    value={currentHolidaySelection}
                    onChange={handleHolidaySelection}
                    plugins={[<DatePanel position="left" sort="date" header={`Off in lieu (${currentHolidaySelection.length})`}/>]}
                />
        </div>

        <div className='flex flex-col justify-start items-center'>
                <button 
                    type="submit" 
                    className={`btn text-white px-32 text-center text-base font-semibold shadow-md rounded-lg mt-6 ${updateBtnLoading}`}
                    disabled={disableUpdateButton}
                    onClick={handleSubmitChange}
                >
                    Update
                </button>
        </div>
        {isLoading && <Loading/>}
    </div>
    )
}

export default SetWorkdayPage