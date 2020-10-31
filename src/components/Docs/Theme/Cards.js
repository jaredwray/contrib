import React from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Row,
    Col
} from 'reactstrap'

import geoJSONRestaurants from '../../../data/restaurants-geojson.json'
import geoJSONRooms from '../../../data/rooms-geojson.json'
import posterCards from '../../../data/guides.json'
import propertyCards from '../../../data/index4.json'
import postCards from '../../../data/blog.json'
import reviewCards from '../../../data/detail-rooms.json'
import teamCards from '../../../data/team.json'
import testimonialCards from '../../../data/index.json'

import CardRestaurant from '../../CardRestaurant'
import CardRoom from '../../CardRoom'
import CardPoster from '../../CardPoster'
import CardProperty from '../../CardProperty'
import CardPost from '../../CardPost'
import CardReview from '../../CardReview'
import CardTeam from '../../CardTeam'
import CardTestimonial from '../../CardTestimonial'

export default () => {

    return (
        <div id="cards" className="docs-item element">
            <h5 className="text-uppercase mb-4">Cards</h5>
            <div className="docs-desc">
                <p className="lead">This theme comes with a variety of card styles useful for directory and marketplace websites.</p>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Restaurant</h6>
                <Row>
                    <Col md="6" lg="4">
                        <CardRestaurant data={geoJSONRestaurants.features[0].properties} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-md-block">
                        <CardRestaurant data={geoJSONRestaurants.features[1].properties} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-lg-block">
                        <CardRestaurant data={geoJSONRestaurants.features[2].properties} />
                    </Col>
                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow}className="rounded shadow p-4">
                        {highlightCode.restaurant}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Room</h6>
                <Row>
                    <Col md="6" lg="4">
                        <CardRoom data={geoJSONRooms.features[0].properties} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-md-block">
                        <CardRoom data={geoJSONRooms.features[1].properties} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-lg-block">
                        <CardRoom data={geoJSONRooms.features[2].properties} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.room}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Property</h6>
                <Row>
                    <Col md="6" lg="4">
                        <CardProperty data={propertyCards.featured.swiper[0]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-md-block">
                        <CardProperty data={propertyCards.featured.swiper[1]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-lg-block">
                        <CardProperty data={propertyCards.featured.swiper[2]} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.property}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Card with a background image</h6>
                <Row>
                    <Col md="6" lg="4">
                        <CardPoster data={posterCards.swiperItems[0]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-md-block">
                        <CardPoster data={posterCards.swiperItems[1]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-lg-block">
                        <CardPoster data={posterCards.swiperItems[2]} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.poster}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Blog Post</h6>
                <Row>
                    <Col md="6" lg="4">
                        <CardPost data={postCards.posts[0]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-md-block">
                        <CardPost data={postCards.posts[1]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-lg-block">
                        <CardPost data={postCards.posts[2]} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.post}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Review</h6>
                <Row>
                    <Col xs="12">
                        <CardReview data={reviewCards.reviews[0]} />
                    </Col>
                    <Col xs="12" className="d-none d-md-block">
                        <CardReview data={reviewCards.reviews[1]} />
                    </Col>
                    <Col xs="12" className="d-none d-lg-block">
                        <CardReview data={reviewCards.reviews[2]} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.review}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Team member</h6>
                <Row>
                    <Col md="6" lg="4">
                        <CardTeam data={teamCards.sales.items[0]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-md-block">
                        <CardTeam data={teamCards.sales.items[1]} />
                    </Col>
                    <Col md="6" lg="4" className="d-none d-lg-block">
                        <CardTeam data={teamCards.sales.items[2]} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.team}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Testimonial</h6>
                <Row>
                    <Col md="6">
                        <CardTestimonial data={testimonialCards.testimonials.swiperItems[0]} />
                    </Col>
                    <Col md="6" className="d-none d-md-block">
                        <CardTestimonial data={testimonialCards.testimonials.swiperItems[1]} />
                    </Col>

                </Row>
                <div className="my-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.testimonial}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    )
}

const highlightCode = {
    "restaurant": (
        `import CardRestaurant from '../../CardRestaurant'

import geoJSON from './public/content/restaurants-geojson.json'

export default () => {
    return (
        geoJSON.features.map(restaurant => 
            <CardRestaurant data={restaurant.properties} />
        )
    )
}`),
    "room": (
        `import CardRoom from '../../CardRoom'

import geoJSON from './public/content/rooms-geojson.json'

export default () => {
    return (
        geoJSON.features.map(room => 
            <CardRestaurant data={room.properties} />
        )
    )
}`),
    "property": (
        `import CardProperty from '../../CardProperty'

import properties from './public/content/properties.json'

export default () => {
    return (
        properties.map(property => 
            <CardProperty data={property} />
        )
    )
}`),
    "poster": (
        `import CardPoster from '../../CardPoster'

import posters from './public/content/posters.json'

export default () => {
    return (
        posters.map(poster => 
            <CardPoster data={poster} />
        )
    )
}`),
    "post": (
        `import CardPost from '../../CardPost'

import posts from './public/content/posts.json'

export default () => {
    return (
        posts.map(post => 
            <CardPost data={post} />
        )
    )
}`),
    "review": (
        `import CardReview from '../../CardReview'

import reviews from './public/content/reviews.json'

export default () => {
    return (
        reviews.map(review => 
            <CardReview data={review} />
        )
    )
}`),
    "team": (
        `import CardTeam from '../../CardTeam'

import teams from './public/content/teams.json'

export default () => {
    return (
        teams.map(team => 
            <CardTeam data={team} />
        )
    )
}`),
    "testimonial": (
        `import CardTestimonial from '../../CardTestimonial'

import testimonials from './public/content/testimonials.json'

export default () => {
    return (
        testimonials.map(testimonial => 
            <CardTestimonial data={testimonial} />
        )
    )
}`)
}