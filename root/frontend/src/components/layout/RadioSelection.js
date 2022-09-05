import React from 'react'
import { useMainContext } from '../../hooks/useMainContext';

function RadioSelection({id, radioType}) {
    const {setIsAdmin} = useMainContext()
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
    <div id={id} className="form-control">
        {radioContent.map((content) => 
        (<div className='flex mt-1'>
            <input type="radio" name={id} className="radio-sm required" value={content} onChange={(e) => setIsAdmin(content)}/>
            <span className="label-text">{content}</span> 
        </div>)
        )}
    </div>
    )
}

export default RadioSelection