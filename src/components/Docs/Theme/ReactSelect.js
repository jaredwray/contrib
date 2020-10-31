import React from 'react'

import {
    Row,
    Col
} from 'reactstrap'

import Select from 'react-select'

export default () => {
    return (
        <div id="react-select" className="docs-item element">
            <h5 className="text-uppercase mb-4">React Select</h5>
            <div className="docs-desc">
                <p className="lead">Directory Theme uses React Select plugin for showing select input. You can customize it using props.</p>
                <p>
                    <a href="https://react-select.com/" className="btn btn-outline-dark btn-sm">Visit plugin website</a>
                </p>
            </div>
            <div className="mt-5">
                <Select
                    instanceId="sortBySelect"
                    options={selectOptions}
                    defaultValue={selectOptions[0]}
                    className="bootstrap-select"
                    classNamePrefix="selectpicker"
                />
            </div>
        </div>
    )
}


const selectOptions = [
    {
        "value": "popular",
        "label":  "Most popular"
        
    },
    {
        "value": "recommended",
        "label":  "Recommended"
        
    },
    {
        "value": "newest",
        "label":  "Newest"
        
    },
    {
        "value": "oldest",
        "label":  "Oldest"
        
    },
    {
        "value": "closest",
        "label":  "Closest"
        
    }
]