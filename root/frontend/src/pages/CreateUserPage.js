import React from 'react'
import Select from '../components/layout/Select'

function CreateUserPage() {
    return (
        <div>
            <div className='grid place-items-center mt-2 text-slate-600 text-3xl'>Create User</div>
            <div className="grid place-items-center">
                <form className="form-control w-full max-w-xs">
                    <label class="label text-sm">Name</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    <label class="label text-sm">Email 邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    <label class="label text-sm">Account Type</label>
                    <Select options={["admin","user"]}/>
                    <label class="label text-sm">Reporting Officer 主管</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    <label class="label text-sm">Reporting Officer Email 主管邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    <label class="label text-sm">Covering Officer 代办</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    <label class="label text-sm">Covering Officer Email 代办邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    <button className='btn mt-4'>Create User</button>
                </form>
            </div>
        </div>
        )
}

export default CreateUserPage