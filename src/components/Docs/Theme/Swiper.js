import React from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import Swiper from '../../Swiper'

import {Collapse,Button} from 'reactstrap'

import geoJSONRooms from '../../../data/rooms-geojson.json'
import geoJSONRestaurants from '../../../data/restaurants-geojson.json'
import propertySlides from '../../../data/index4.json'
import imgCardsSlides from '../../../data/guides.json'

export default () => {

    const [propsCollapse, setPropsCollapse] = React.useState(false)

    return (
        <div id="swiper" className="docs-item element">
            <h5 className="text-uppercase mb-4">Swiper</h5>
            <div className="docs-desc">
                <p className="lead">
                    Touch-enabled React plugin that lets you create beautiful responsive carousel sliders.
                </p>
                <p>
                Used for the single-item carousels and also for the card carousels. You can use Swiper templates included in this template or import and customize on your own using docs for this plugin.
                </p>
                <p>
                    <a href="https://github.com/kidjp85/react-id-swiper#readme" className="btn btn-outline-dark btn-sm">Visit plugin website</a>
                </p>
                <Button
                    aria-expanded={propsCollapse}
                    onClick={() => setPropsCollapse(!propsCollapse)}
                    color="link"
                    className="btn-collapse pl-0 text-secondary"
                >Supported props</Button>

                <Collapse isOpen={propsCollapse}>
                    <ul>
                        <li><b>simple</b> - if true, simple style will be used</li>
                        <li><b>cards</b> - if true, room cards style will be used</li>
                        <li><b>propertyCards</b> - if true, property cards style will be used</li>
                        <li><b>imgCards</b> - if true, image cards style will be used</li>
                        <li><b>restaurantCards</b> - if true, restaurant cards style will be used</li>
                        <li><b>className</b> - classes for <code>Swiper</code> container</li>
                        <li><b>wrapperClass</b> - classes for <code>Swiper</code> wrapper</li>
                        <li><b>slidesPerView</b> - slides per view at smallest size</li>
                        <li><b>effect</b> - <code>Swiper</code> effect</li>
                        <li><b>allowTouchMove</b> - if false, touch moves are disabled otherways enabled</li>
                        <li><b>spaceBetween</b> - space between slides</li>
                        <li><b>centeredSlides</b> - slides centering</li>
                        <li><b>roundLengths</b> - if true, round values of slides width and height to prevent blurry texts on usual resolutions</li>
                        <li><b>loop</b> - endless loop through slides</li>
                        <li><b>speed</b> - speed of animation</li>
                        <li><b>parallax</b> - parallax effect</li>
                        <li><b>breakpoints</b> - pass breakpoints object for different behaviour on different screen sizes</li>
                        <li><b>xs</b> - slides per view at extra small size</li>
                        <li><b>sm</b> - slides per view at small size</li>
                        <li><b>md</b> - slides per view at medium size</li>
                        <li><b>lg</b> - slides per view at large size</li>
                        <li><b>xl</b> - slides per view at extra large size</li>
                        <li><b>xxl</b> - slides per view at at width over 1400px</li>
                        <li><b>xxxl</b> - slides per view at at width over 1600px</li>
                        <li><b>autoplay</b> - enables/disables autoplay</li>
                        <li><b>delay</b> - delay for autoplay</li>
                        <li><b>pagiantion</b> - if true, pagination bullets will shop up</li>
                        <li><b>pagiantionClass</b> - class for pagination</li>
                        <li><b>navigation</b> - if true, navigation arrows will shop up</li>
                        <li><b>data</b> - pass slides object</li>
                    </ul>
                </Collapse>
            </div>
            <div className="mt-5">
                <h6>Rooms Swiper</h6>
                <p className="mb-4 text-muted">GeoJSON file used to generate slides: <a href="/content/rooms-geojson.json">rooms-geojson.json</a></p>
                <div className="mb-3">
                    <Swiper
                        className="swiper-container-mx-negative pt-3 pb-5"
                        perView={1}
                        spaceBetween={20}
                        loop
                        roundLengths
                        md={2}
                        lg={3}
                        data={geoJSONRooms.features}
                        cards
                    />
                </div>
            </div>
            <div class="mt-4">
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode.cards}
                </SyntaxHighlighter>
            </div>
            <div className="mt-5">
                <h6>Restaurants Swiper</h6>
                <p className="mb-4 text-muted">GeoJSON file used to generate slides: <a href="/content/restaurants-geojson.json">restaurants-geojson.json</a></p>
                <div className="mb-3">
                    <Swiper
                        className="swiper-container-mx-negative pt-3 pb-5"
                        perView={1}
                        spaceBetween={20}
                        loop
                        roundLengths
                        md={2}
                        lg={3}
                        data={geoJSONRestaurants.features}
                        restaurantCards
                    />
                </div>
            </div>
            <div>
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode.restaurantCards}
                </SyntaxHighlighter>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Swiper property cards style</h6>
                <div className="mb-3">
                    <Swiper
                        className="swiper-container-mx-negative pt-3 pb-5"
                        perView={1}
                        spaceBetween={20}
                        loop
                        roundLengths
                        md={2}
                        lg={3}
                        data={propertySlides.featured.swiper}
                        propertyCards
                    />
                </div>
            </div>
            <div>
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode.propertyCards}
                </SyntaxHighlighter>
            </div>
            <div className="mt-5">
                <h6 className="mb-4">Swiper image cards style</h6>
                <div className="mb-4">
                    <Swiper
                        className="mx-n2 pt-3 pb-5"
                        perView={1}
                        spaceBetween={20}
                        imgCards
                        loop
                        roundLengths
                        md={2}
                        lg={4}
                        data={imgCardsSlides.swiperItems}
                    />
                </div>
            </div>
            <div>
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode.imgCards}
                </SyntaxHighlighter>
            </div>
            <div className="mt-5">
                <h6>Background Images Hero Slider</h6>
                <p className="mb-4">Parent element must have <code>.position-relative</code> and height set</p>
                <div style={{ height: "300px" }} className="position-relative mb-3">
                    <Swiper
                        className="hero-slider"
                        wrapperClasses="dark-overlay"
                        data={swiper.simple}
                        simple={true}
                        effect='fade'
                        speed={2000}
                        allowTouchMove={false}
                        pagination={false}
                        autoplay={true}
                        delay={2000}
                    />
                </div>
            </div>
            <div>
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode.simple}
                </SyntaxHighlighter>
            </div>            
        </div>
    )
}

const swiper = {
    "simple": [
        "photo-1501621965065-c6e1cf6b53e2.jpg",
        "photo-1519974719765-e6559eac2575.jpg",
        "photo-1490578474895-699cd4e2cf59.jpg",
        "photo-1534850336045-c6c6d287f89e.jpg"
    ],
}

const highlightCode = {
    "simple": (
        `import Swiper from '../../Swiper'

export default () => {

    const slides = [
            "photo-1501621965065-c6e1cf6b53e2.jpg",
            "photo-1519974719765-e6559eac2575.jpg",
            "photo-1490578474895-699cd4e2cf59.jpg",
            "photo-1534850336045-c6c6d287f89e.jpg"
    ]
    
    return (
        <Swiper
            className="hero-slider"
            wrapperClasses="dark-overlay"
            data={slides}
            simple={true}
            effect='fade'
            speed={2000}
            allowTouchMove={false}
            pagination={false}
            autoplay={true}
            delay={2000}
        />
    )
}`),
    "cards": (
`import Swiper from '../../Swiper'

import geoJSON from './public/content/rooms-geojson.json'

export default () => {
    return (
        <Swiper
            className="swiper-container-mx-negative pt-3 pb-5"
            perView={1}
            spaceBetween={20}
            loop
            roundLengths
            md={2}
            lg={3}
            data={geoJSONRooms.features}
            cards
        />
    )
}`),
    "restaurantCards": (
`import Swiper from '../../Swiper'

import geoJSON from './public/content/restaurants-geojson.json'

export default () => {
    return (
        <Swiper
            className="swiper-container-mx-negative pt-3 pb-5"
            perView={1}
            spaceBetween={20}
            loop
            roundLengths
            md={2}
            lg={3}
            xl={4}
            data={geoJSONfeatures}
            restaurantCards
        />
    )
}
`),
    "propertyCards": (
`import Swiper from '../../Swiper'

export default () => {
    "slides": [
        {
            "title": "Modern, Well-Appointed Room",
            "location": "San Francisco",
            "type": "House",
            "link": "detail-rooms",
            "img": "img/photo/photo-1484154218962-a197022b5858.jpg",
            "meters": "350",
            "bedrooms": "3",
            "bathrooms": "2",
            "price": "$150k"
        },
        {
            "title": "Cute Quirky Garden apt, NYC adjacent",
            "location": "San Francisco",
            "type": "Apartment",
            "link": "detail-rooms",
            "img": "img/photo/photo-1426122402199-be02db90eb90.jpg",
            "meters": "85",
            "bedrooms": "2",
            "bathrooms": "1",
            "price": "$65k"
        }
        ...
        ...
    ]
    
    return (
        <Swiper
            className="swiper-container-mx-negative pt-3 pb-5"
            perView={1}
            spaceBetween={20}
            loop
            roundLengths
            md={2}
            lg={3}
            xl={4}
            data={slides}
            propertyCards
        />
    )
}`),
    "imgCards": (
        `import Swiper from '../../Swiper'

export default () => {

    "slides": [
        {
            "title": "New York",
            "subtitle": "The big apple",
            "img": "img/photo/new-york.jpg",
            "link": "category"
        },
        {
            "title": "Paris",
            "subtitle": "Artist capital of Europe",
            "img": "img/photo/paris.jpg",
            "link": "category"
        },
        {
            "title": "Barcelona",
            "subtitle": "Dalí, Gaudí, Barrio Gotico",
            "img": "img/photo/barcelona.jpg",
            "link": "category"
        },
        {
            "title": "Prague",
            "subtitle": "City of hundred towers",
            "img": "img/photo/prague.jpg",
            "link": "category"
        }
    ]
    
    return (
        <Swiper
            className="mx-n2 pt-3 pb-5"
            perView={1}
            spaceBetween={20}
            imgCards
            loop
            roundLengths
            md={2}
            lg={4}
            data={slides}
        />
    )
}`)
}