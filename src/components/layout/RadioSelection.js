import React from 'react'

function RadioSelection({id}) {
    const leaveDateSelection = ["AM", "PM", "Full Day"]
    return (
    <div id={id} class="form-control">
        {leaveDateSelection.map((time) => 
        (<div className='flex mt-1'>
            <input type="radio" name={id} class="radio-sm checked required"/>
            <span class="label-text">{time}</span> 
        </div>)
        )}
    </div>
    )
}

export default RadioSelection