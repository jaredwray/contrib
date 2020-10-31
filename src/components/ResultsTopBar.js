import React from 'react'

import SortBy from './SortBy'

export default props => {
    return (
        <div className="d-flex justify-content-between align-items-center flex-column flex-md-row mb-4">
            <div className="mr-3">
                <p className="mb-3 mb-md-0">
                    <strong>12</strong>
                    &nbsp;results found
                </p>
            </div>
            {props.sortBy && <SortBy data={props.sortBy} />}
        </div>
    )
}