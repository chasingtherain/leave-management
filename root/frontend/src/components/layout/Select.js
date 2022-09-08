import React from 'react'
import { useMainContext } from '../../hooks/useMainContext'

function Select({options}) {
  const {setCurrentLeaveSelection} = useMainContext()
  return (
    <select className="select select-secondary w-full max-w-xs" onChange={(e)=> setCurrentLeaveSelection(e.target.value)}>
        {options.map(leaveName => <option>{leaveName}</option>)}
    </select>
  )
}

export default Select