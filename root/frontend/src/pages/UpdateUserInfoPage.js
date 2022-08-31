import React from 'react'

function UpdateUserInfoPage() {
  return (
    <form className="" onSubmit="">
        <p className='text-slate-600 text-3xl ml-[45%] mt-4'>Update <span className="text-sky-500">User Info</span> </p>
        <div className="w-full px-5 ml-[40%]">
            <div className="">
                <label for="name" class="text-sm font-weight-900 -ml-1 label">Name</label>
                <input id="name" type="text" disabled class="input input-bordered input-primary w-full max-w-xs" value="Yan Fang"/>
            </div>
            <div className="">
                <label for="email" class="text-sm font-weight-900 -ml-1 label">Email</label>
                <input id="email" type="email" disabled class="input input-bordered input-primary w-full max-w-xs" value="yanfang@163.com"/>
            </div>
            <div className="">
                <label for="RO" class="text-sm font-weight-900 -ml-1 label">RO</label>
                <input id="RO" type="text" class="input input-bordered input-primary w-full max-w-xs" value="Shen Yun Xi"/>
            </div>
            <div className="">
                <label for="RO-email" class="text-sm font-weight-900 -ml-1 label">RO email</label>
                <input id="RO-email" type="text" class="input input-bordered input-primary w-full max-w-xs" value="yunxi@mfa.sg"/>
            </div>
            <div className="">
                <label for="CO" class="text-sm font-weight-900 -ml-1 label">CO</label>
                <input id="CO" type="text" class="input input-bordered input-primary w-full max-w-xs" value="Huangxi"/>
            </div>
            <div className="">
                <label for="CO-email" class="text-sm font-weight-900 -ml-1 label">CO email</label>
                <input id="CO-email" type="text" class="input input-bordered input-primary w-full max-w-xs" value="huangxi@163.com"/>
            </div>
            <button type="submit" className="btn btn-primary text-white w-1/6 text-center text-base font-semibold shadow-md rounded-lg mt-6 ml-10">
                Update
            </button>
        </div>
    </form>
  )
}

export default UpdateUserInfoPage