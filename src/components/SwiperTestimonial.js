import React from 'react'

import ReactIdSwiper from 'react-id-swiper'

import CardTestimonial from '../components/CardTestimonial'

export default props => {
    const data = props.data

    const params = {

        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        roundLengths: true,

        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 0
            },
            565: {
                slidesPerView: 1
            }
        },
        pagination: props.pagination !== false ? {
            el: `.swiper-pagination`,
            clickable: true,
            dynamicBullets: true
        } : false,
        containerClass: `swiper-container pt-2 pb-5`,
    }
    return (
        <ReactIdSwiper {...params}>
            {data.map((item, index) =>
                <div key={index} className="px-3">
                    <CardTestimonial data={item} />
                </div>
            )}
        </ReactIdSwiper>
    )
}