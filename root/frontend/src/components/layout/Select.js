import React from 'react'

function Select({options}) {
  return (
    <select class="select select-secondary w-full max-w-xs">
        {options.map(leaveName => <option>{leaveName}</option>)}
    </select>
  )
}

export default Select