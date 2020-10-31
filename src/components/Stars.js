import React from 'react'

export default props => {
    const starsArray = []
    for (let i = 1; i <= 5; i++) {
        i <= props.stars ?
          starsArray.push(
            <i key={i} className={`fa ${props.size ? `fa-`+props.size : ""} fa-star ${props.color ? props.color : "text-warning"}`} />
          )
          :
          starsArray.push(
            <i key={i} className={`fa fa-star ${props.size ? `fa-`+props.size : ""} text-gray-300`} />
          )

    }
    return starsArray
}