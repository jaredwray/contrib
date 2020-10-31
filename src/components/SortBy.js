import React from 'react'

import Select from 'react-select'

export default props => {
    return (
        <div>
            <label className="form-label mr-2">Sort by</label>
            <Select
                instanceId="sortBySelect"
                options={props.data}
                defaultValue={props.data[0]}

                className="dropdown bootstrap-select"
                classNamePrefix="selectpicker"
            />
        </div>
    )
}