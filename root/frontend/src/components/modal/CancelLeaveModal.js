import React from 'react'

function CancelLeaveModal() {
  return (
    <div>        
        <label htmlFor="my-modal-3" className="btn btn-sm modal-button btn-error">
            cancel 取消
        </label>
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box w-88 relative">
                <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <h3 className="text-lg font-bold text-center">Cancel Leave?</h3>
                <h3 className="text-lg font-bold text-center">确定取消？</h3>
                <div className='flex justify-center gap-8 mt-4'>
                    <button className='btn btn-error px-8 py-2'>Yes, 取消</button>
                    <button className='btn-secondary px-8 py-2'>No, 不取消</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CancelLeaveModal