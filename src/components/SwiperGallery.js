import React from 'react'

import ReactIdSwiper from 'react-id-swiper'

import Lightbox from 'react-image-lightbox'

export default props => {
    const data = props.data
    const [lightBoxOpen, setLightBoxOpen] = React.useState(false)
    const [activeImage, setActiveImage] = React.useState(0)

    const onClick = (index) => {
        setActiveImage(index)
        setLightBoxOpen(!lightBoxOpen)
    }

    const edgeSlidesClick = React.useCallback(
        (index) => {
            onClick(index)
        }, [])

    React.useEffect(() => {
        const firstSlide = document.querySelector('.swiper-slide-prev')
        const lastSlide = document.querySelector('.swiper-slide-duplicate-next')

        firstSlide.addEventListener("click", () => edgeSlidesClick(data.length - 1))
        firstSlide.previousSibling.addEventListener("click", () => edgeSlidesClick(data.length - 2))
        lastSlide.addEventListener("click", () => edgeSlidesClick(1))
        lastSlide.previousSibling.addEventListener("click", () => edgeSlidesClick(0))
        return () => {
            firstSlide.removeEventListener("click", () => edgeSlidesClick())
            firstSlide.previousSibling.removeEventListener("click", () => edgeSlidesClick())
            lastSlide.addEventListener("click", () => edgeSlidesClick())
            lastSlide.previousSibling.addEventListener("click", () => edgeSlidesClick())
        }
    }, [edgeSlidesClick])

    const params = {
        slidesPerView: 3,
        spaceBetween: 0,
        loop: true,
        roundLengths: true,
        centeredSlides: true,

        pagination: {
            el: `.swiper-pagination.swiper-pagination-white`,
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    }
    const customStyles = {
        overlay: {
            zIndex: '1000',
        },
        bodyOpen: {
            position: 'fixed',
        }
    }
    return (
        <React.Fragment>
            <ReactIdSwiper {...params}>
                {data.map((item, index) =>
                    <img
                        key={index}
                        src={`/content/img/photo/${item.img}`}
                        alt={item.alt}
                        className="img-fluid img-gallery"
                        onClick={() => onClick(index)}
                    />
                )}
            </ReactIdSwiper>

            {lightBoxOpen && (
                <Lightbox
                    mainSrc={`/content/img/photo/${data[activeImage].img}`}
                    nextSrc={`/content/img/photo/${data[(activeImage + 1) % data.length].img}`}
                    prevSrc={`/content/img/photo/${data[(activeImage + data.length - 1) % data.length].img}`}
                    onCloseRequest={() => setLightBoxOpen(false)}
                    imageCaption={data[activeImage].title}
                    onMovePrevRequest={() =>
                        setActiveImage((activeImage + data.length - 1) % data.length)
                    }
                    onMoveNextRequest={() =>
                        setActiveImage((activeImage + 1) % data.length)
                    }
                    enableZoom={false}
                    reactModalStyle={customStyles}
                />
            )}
        </React.Fragment>
    )
}