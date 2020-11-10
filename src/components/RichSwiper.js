import React from "react"
import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Badge
} from 'reactstrap'

import Stars from './Stars'

import ReactIdSwiper from 'react-id-swiper'

const RichSwiper = (props) => {
    const breakpoints = []
    if (props.sm) {
        breakpoints[565] = {
            slidesPerView: props.sm
        }
    }

    if (props.md) {
        breakpoints[768] = {
            slidesPerView: props.md
        }
    }
    if (props.lg) {
        breakpoints[991] = {
            slidesPerView: props.lg
        }
    }
    if (props.xl) {
        breakpoints[1200] = {
            slidesPerView: props.xl
        }
    }
    if (props.xxl) {
        breakpoints[1400] = {
            slidesPerView: props.xxl
        }
    }
    if (props.xxxl) {
        breakpoints[1600] = {
            slidesPerView: props.xxxl
        }
    }
    const params = {
        containerClass: `swiper-container .swiper-pagiantion ${props.className}`,
        slidesPerView: props.perView,
        centeredSlides: props.centeredSlides,
        loop: props.loop,
        speed: props.speed ? props.speed : 400,
        parallax: props.parallax,
        breakpoints: breakpoints,
        pagination: {
            el: `.swiper-pagination.${props.paginationClass}`,
            clickable: true,
            dynamicBullets: true
        }
    }
    return (
        props.data ? <ReactIdSwiper {...params}>
            {props.data.map(slide =>
                <div
                    key={slide.title}
                    style={{ backgroundImage: `url(content/${slide.img})` }}
                    className=" bg-cover dark-overlay"
                >
                    <Container className="h-100">
                        <div
                            data-swiper-parallax={slide.parallax}
                            className="d-flex h-100 text-white overlay-content align-items-center"
                        >
                            <div className="w-100">
                                <Row>
                                    <Col lg={slide.blocks ? "12" : "6"}>
                                        <p className="subtitle text-white letter-spacing-3 mb-3 font-weight-light">
                                            {slide.subTitle}
                                        </p>
                                        <h2
                                            style={{ lineHeight: "1" }}
                                            className="display-3 font-weight-bold mb-3"
                                        >
                                            {slide.title}
                                        </h2>
                                        <p className="mb-5">
                                            {slide.content}
                                        </p>
                                        {slide.button &&
                                            <Link href={slide.buttonLink}>
                                                <Button
                                                    href={slide.buttonLink}
                                                    color="outline-light"
                                                    className={slide.buttonClasses}
                                                >
                                                    {slide.button}
                                                    <i className="fa fa-angle-right ml-2" />
                                                </Button>
                                            </Link>
                                        }
                                    </Col>
                                    <Col
                                        lg={slide.iconsRight ? "6" : "12"}
                                        className="pl-lg-5 my-3 my-md-5 my-lg-0"
                                    >
                                        {slide.iconsRight && slide.iconsRight.map(icon =>
                                            <a
                                                key={icon.title}
                                                href="#"
                                                className="media text-reset text-decoration-none hover-animate mb-2 mb-md-5"
                                            >
                                                <div className="icon-rounded bg-white opacity-7 mr-4">
                                                    <svg className="svg-icon text-dark w-2rem h-2rem">
                                                        <use xlinkHref={`content/svg/orion-svg-sprite.svg/${icon.icon}`} />
                                                    </svg>
                                                </div>
                                                <div className="media-body">
                                                    <h5>{icon.title}</h5>
                                                    {icon.badge &&
                                                        <Badge color="light">
                                                            {icon.badge}
                                                        </Badge>
                                                    }
                                                    {icon.content &&
                                                        <p>{icon.content}</p>
                                                    }
                                                </div>
                                            </a>
                                        )}
                                    </Col>
                                </Row>
                                {slide.blocks &&
                                    <Row>
                                        {slide.blocks.map(block =>
                                            <Col
                                                key={block.title}
                                                md="4"
                                                className="d-none d-md-block mb-5"
                                            >
                                                <Card
                                                    className="h-100 border-0 shadow-lg bg-dark hover-animate"
                                                >
                                                    <div className="card-img-top overflow-hidden gradient-overlay"> <img src={`/content/${block.img}`} alt={block.title} className="img-fluid"
                                                    />
                                                        <Link href={block.link}>
                                                            <a className="tile-link" />
                                                        </Link>
                                                        <div className="card-img-overlay-top text-right">
                                                            <a
                                                                href="#"
                                                                className="card-fav-icon position-relative z-index-40">
                                                                <svg className="svg-icon text-white">
                                                                    <use xlinkHref="content/svg/orion-svg-sprite.svg#heart-1" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <CardBody
                                                        className=" d-flex align-items-center"
                                                    >
                                                        <div className="w-100">
                                                            <CardTitle tag="h6">
                                                                <Link href={block.link}>
                                                                    <a className="text-decoration-none text-white">
                                                                        {block.title}
                                                                    </a>
                                                                </Link>
                                                            </CardTitle>
                                                            <CardSubtitle className="d-flex">
                                                                <p className="flex-grow-1 mb-0 text-muted text-sm">
                                                                    {block.location}
                                                                </p>
                                                                <p className="flex-shrink-1 mb-0 card-stars text-xs text-right">
                                                                    <Stars stars={block.stars} />
                                                                </p>
                                                            </CardSubtitle>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        )
                                        }
                                    </Row>
                                }
                                {slide.iconsBottom &&
                                    <Row className="mt-3 mt-md-5">
                                        {slide.iconsBottom.map(icon =>
                                            <Col
                                                key={icon.title}
                                                md="4"
                                                className="mb-2 mb-md-0"
                                            >
                                                <a
                                                    href="#"
                                                    className="media text-reset text-decoration-none hover-animate mb-2 mb-md-5"
                                                >
                                                    <div className="icon-rounded bg-white opacity-7 mr-4">
                                                        <svg className="svg-icon text-dark w-2rem h-2rem">
                                                            <use xlinkHref={`content/svg/orion-svg-sprite.svg/${icon.icon}`} />
                                                        </svg>
                                                    </div>
                                                    <div className="media-body">
                                                        <h5>{icon.title}</h5>
                                                        {icon.badge &&
                                                            <Badge color="light">
                                                                {icon.badge}
                                                            </Badge>
                                                        }
                                                        {icon.content &&
                                                            <p>{icon.content}</p>
                                                        }
                                                    </div>
                                                </a>
                                            </Col>
                                        )}
                                    </Row>
                                }
                            </div>

                        </div>
                    </Container>
                </div>
            )}

        </ReactIdSwiper>
            : 'loading'
    )
}

export default RichSwiper