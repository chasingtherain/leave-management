import React from 'react'

function RadioSelection({id, radioType}) {
    const leaveDateRadio = ["AM", "PM", "Full Day"]
    const accountTypeRadio = ["user", "admin"]
    let radioContent;

    switch (radioType) {
        case "leaveDateRadio":
            radioContent = leaveDateRadio
            break;
        case "accountTypeRadio":
            radioContent = accountTypeRadio
            break;
        default:
            console.log("invalid table header provided!")
            break;
    }

    return (
    <div id={id} class="form-control">
        {radioContent.map((content) => 
        (<div className='flex mt-1'>
            <input type="radio" name={id} class="radio-sm required"/>
            <span class="label-text">{content}</span> 
        </div>)
        )}
    </div>
    )
}

export default RadioSelection