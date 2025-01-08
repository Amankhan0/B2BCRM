import React from 'react'

function ViewTripFilter({ fetchData, fetchDataBySearch }) {

    const onChange = (value, type) => {
        if (type === 'select') {
            fetchData(value !== 'All' && { find: value })
        } else {
            console.log('value', value);
            if (value === '') {
                fetchData()
            }
            if (value?.length > 3) {
                fetchDataBySearch({
                    "$text": {
                        "$search": value
                    }
                })
            }
        }
    }

    return (
        <div className='flex gap-4'>
            <div>
                <p className='text-black ml-1'>Search here</p>
                <input onChange={(e) => onChange(e.target.value, 'search')} className='p-2 rounded-xl border-slate-300 mb-2' placeholder='Search here...' />
            </div>
            <div>
                <p className='text-black ml-1'>Status</p>
                <select className='p-2 rounded-xl w-28 border-slate-300 mb-2' onChange={(e) => onChange(e.target.value, 'select')}>
                    <option>All</option>
                    <option value='Running'>Active</option>
                    <option>Ended</option>
                    <option>Cancelled</option>
                </select>
            </div>
        </div>
    )
}

export default ViewTripFilter