import React from 'react'

import {
    Container,
} from 'reactstrap'

import ReactIdSwiper from 'react-id-swiper'
import Link from 'next/link'

import data from '../data/instagram.json'

export default () => {
    const params = {
        containerClass: `swiper-container instagram-slider`,
        slidesPerView: 4,
        breakpoints: {
            1900: {
                slidesPerView: 16
            },
            1500: {
                slidesPerView: 12
            },
            1200: {
                slidesPerView: 10
            },
            991: {
                slidesPerView: 8
            },
            768: {
                slidesPerView: 5
            }
        }
    }
    return (
        <section>
            <Container fluid className="px-0">
                <ReactIdSwiper {...params}>
                    {data && data.map((img, index) =>
                        <div key={index} className="overflow-hidden">
                            <a href={img.link}>
                                <img src={`/content/${img.img}`} alt="" className="img-fluid hover-scale" />
                            </a>
                        </div>
                    )}
                </ReactIdSwiper>
            </Container>
        </section>
    )
}
