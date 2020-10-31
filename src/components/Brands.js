import React from 'react'

import {
    Container
} from 'reactstrap'

import ReactIdSwiper from 'react-id-swiper'

export default props => {
    const params = {
        containerClass: `swiper-container brands-slider pb-5`,
        slidesPerView: 2,
        spaceBetween: 15,
        loop: true,
        roundLengths: true,
        pagination: {
            el: `.swiper-pagination`,
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            1200: {
                slidesPerView: 6
            },
            991: {
                slidesPerView: 4
            },
            768: {
                slidesPerView: 3
            }
        }
    }

    return (
        <section className={`py-6 ${props.greyBackground ? 'bg-gray-100' : ''}`}>
            <Container>
                <h5 className="text-center text-uppercase letter-spacing-3 mb-5">
                    {props.title}
                </h5>
                <ReactIdSwiper {...params}>
                    {props.brands.map((brand, index) =>
                        <div key={index} className="h-auto d-flex align-items-center justify-content-center">
                            <img src={`/content/${brand.img}`} alt={brand.title} className="img-fluid w-6rem opacity-7" />
                        </div>
                    )}
                </ReactIdSwiper>
            </Container>
        </section>
    )
}