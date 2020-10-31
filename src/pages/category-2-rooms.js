import React from 'react'
import dynamic from 'next/dynamic'

import UseWindowSize from '../hooks/UseWindowSize'

import 'react-dates/initialize'

import { DateRangePicker } from 'react-dates'

import Select from 'react-select'

import {
    Container,
    Row,
    Col,
    Form,
    Input,
    Label,
    Collapse,
    Button,
    CustomInput
} from 'reactstrap'

import Nouislider from 'nouislider-react'
import Pagination from '../components/Pagination'

import ResultsTopBar from '../components/ResultsTopBar'
import CardRoom from '../components/CardRoom'


import data from '../data/category-2-rooms.json'
import geoJSON from '../data/rooms-geojson.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Rooms | Category - Map on the top'
        },
    }
}
let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const [dragging, setDragging] = React.useState(false)
    const [tap, setTap] = React.useState(false)

    const size = UseWindowSize()

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )
        setMapLoaded(true)

        setTap(size.width > 700 ? true : false)
        setDragging(size.width > 700 ? true : false)
    }, [])

    const [range, setRange] = React.useState([{ startDate: new Date() }, { endDate: '' }])
    const [dateFocused, setDateFocused] = React.useState(range.startDate)

    const [filterCollapse, setFilterCollapse] = React.useState(false)

    const [priceMin, setPriceMin] = React.useState(40)
    const [priceMax, setPriceMax] = React.useState(110)

    const [beds, setBeds] = React.useState(1)
    const [bedrooms, setBedrooms] = React.useState(1)
    const [bathrooms, setBathrooms] = React.useState(1)

    const priceSlider = (render, handle, value, un, percent) => {
        setPriceMin(value[0].toFixed(0))
        setPriceMax(value[1].toFixed(0))
    }

    const [hoverCard, setHoverCard] = React.useState(null)
    const onCardEnter = (id) => {
        setHoverCard(id)
    }
    const onCardLeave = () => {
        setHoverCard(null)
    }
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col
                        lg="6"
                        className="py-4 p-xl-5"
                    >
                        <h2 className="mb-4">{data.title && data.title}</h2>
                        <hr className="my-4" />
                        <Form>
                            <Row>
                                <Col
                                    md="6"
                                    className="mb-4 z-index-20"
                                >
                                    <Label for="form_dates" className="form-label">
                                        Dates
                                    </Label>
                                    <br />
                                    <DateRangePicker
                                        startDate={range.startDate}
                                        startDateId="fromDate"
                                        endDate={range.endDate}
                                        endDateId="toDate"
                                        block={true}
                                        onDatesChange={({ startDate, endDate }) => setRange({ startDate, endDate })}
                                        focusedInput={dateFocused}
                                        onFocusChange={dateFocused => setDateFocused(dateFocused)}
                                        orientation={size.width < 400 ? "vertical" : "horizontal"}
                                    />

                                </Col>
                                <Col
                                    md="6"
                                    className="mb-4"
                                >
                                    <Label
                                        for="form_guests"
                                        className="form-label"
                                    >
                                        Guests
                                    </Label>
                                    <Select
                                        instanceId="guestsSelect"
                                        name="guests"
                                        id="form_guests"
                                        options={data.guests && data.guests}
                                        className="form-control dropdown bootstrap-select"
                                        classNamePrefix="selectpicker"
                                    />

                                </Col>
                                <Col
                                    md="6"
                                    lg="12"
                                    className="mb-4"
                                >
                                    <Label
                                        for="form_type"
                                        className="form-label"
                                    >
                                        Home type
                                    </Label>
                                    <Select
                                        instanceId="typeSelect"
                                        name="type"
                                        id="form_type"
                                        options={data.type && data.type}
                                        isMulti
                                        className=""
                                        classNamePrefix="selectpicker"
                                    />

                                </Col>
                                <Col
                                    md="6"
                                    xl="4"
                                    className="mb-4"
                                >
                                    <Label
                                        className="form-label"
                                    >
                                        Price range
                                    </Label>
                                    <Nouislider
                                        range={{ min: 40, max: 110 }}
                                        start={[40, 110]}
                                        onUpdate={priceSlider}
                                        className="text-primary"
                                        connect
                                    />
                                    <div className="nouislider-values">
                                        <div className="min">From $<span id="slider-snap-value-from">{priceMin}</span></div>
                                        <div className="max">To $<span id="slider-snap-value-to">{priceMax}</span></div>
                                    </div>
                                </Col>
                                <Col
                                    md="6"
                                    lg="12"
                                    xl="8"
                                    className="mb-4 d-xl-flex justify-content-center"
                                >
                                    <div>
                                        <Label
                                            className="form-label"
                                        >
                                            Host and booking
                                        </Label>
                                        <ul className="list-inline mb-0 mt-1">
                                            <li className="list-inline-item">
                                                <CustomInput
                                                    id="instantBook"
                                                    type="switch"
                                                    label={<span className="text-sm">Instant book</span>}
                                                />
                                            </li>
                                            <li className="list-inline-item">
                                                <CustomInput
                                                    id="superhost"
                                                    type="switch"
                                                    label={<span className="text-sm">Superhost</span>}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col xs="12" className="pb-4">
                                    <Collapse isOpen={filterCollapse}>
                                        <div className="filter-block">
                                            <h6 className="mb-3">
                                                Location
                                            </h6>
                                            <Row>
                                                <Col
                                                    xs="12"
                                                    className="mb-4"
                                                >
                                                    <Label
                                                        for="form_neighbourhood" className="form-label"
                                                    >
                                                        Neighbourhood
                                                    </Label>
                                                    <Select
                                                        instanceId="neighbourhoodSelect"
                                                        name="neighbourhood"
                                                        id="form_neighbourhood"
                                                        options={data.neighbourhood && data.neighbourhood}
                                                        isMulti
                                                        isSearchable
                                                        className="form-control dropdown bootstrap-select"
                                                        classNamePrefix="selectpicker"
                                                    />
                                                </Col>
                                                {data.tags &&
                                                    <Col xs="12">
                                                        <Label className="form-label">
                                                            {data.tags.title}
                                                        </Label>
                                                        <ul className="list-inline mt-xl-1 mb-0">
                                                            {data.tags.items.map(tag =>
                                                                <li key={tag.value} className="list-inline-item">
                                                                    <CustomInput
                                                                        type="checkbox"
                                                                        id={tag.value}
                                                                        name={tag.value}
                                                                        label={tag.label}
                                                                    />
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </Col>
                                                }
                                            </Row>
                                        </div>
                                        <div className="filter-block">
                                            <h6 className="mb-3">
                                                Rooms and beds
                                            </h6>
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="form-label">
                                                        Beds
                                                    </Label>
                                                    <div className="d-flex align-items-center">
                                                        <Button
                                                            color="items"
                                                            className="btn-items-decrease"
                                                            onClick={() => beds > 1 && setBeds(beds - 1)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input
                                                            type="text"
                                                            value={`${beds}+`}
                                                            disabled
                                                            className="input-items input-items-greaterthan"
                                                        />
                                                        <Button
                                                            color="items"
                                                            className="btn-items-increase"
                                                            onClick={() => setBeds(beds + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="form-label">
                                                        Bedrooms
                                                    </Label>
                                                    <div className="d-flex align-items-center">
                                                        <Button
                                                            color="items"
                                                            className="btn-items-decrease"
                                                            onClick={() => bedrooms > 1 && setBedrooms(bedrooms - 1)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input
                                                            type="text"
                                                            value={`${bedrooms}+`}
                                                            disabled
                                                            className="input-items input-items-greaterthan"
                                                        />
                                                        <Button
                                                            color="items"
                                                            className="btn-items-increase"
                                                            onClick={() => setBedrooms(bedrooms + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="form-label">
                                                        Bathrooms
                                                    </Label>
                                                    <div className="d-flex align-items-center">
                                                        <Button
                                                            color="items"
                                                            className="btn-items-decrease"
                                                            onClick={() => bathrooms > 1 && setBathrooms(bathrooms - 1)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input
                                                            type="text"
                                                            value={`${bathrooms}+`}
                                                            disabled
                                                            className="input-items input-items-greaterthan"
                                                        />
                                                        <Button
                                                            color="items"
                                                            className="btn-items-increase"
                                                            onClick={() => setBathrooms(bathrooms + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="filter-block">
                                            <h6 className="mb-3">
                                                Trip type
                                            </h6>
                                            <Row className="pt-1">
                                                <Col sm="6">
                                                    <CustomInput
                                                        id="forfamilies"
                                                        type="switch"
                                                        name="forfamilies"
                                                        aria-describedby="forfamiliesHelp"
                                                        className="mb-3"
                                                        label={<span className="text-sm">For Families</span>}
                                                    />
                                                    <small
                                                        id="forfamiliesHelp"
                                                        className="text-muted form-text"
                                                    >
                                                        Explore entire homes with 5-star reviews from families and essentials like a kitchen and TV
                                                    </small>
                                                </Col>
                                                <Col sm="6">
                                                    <CustomInput
                                                        id="forwork"
                                                        type="switch"
                                                        name="forwork"
                                                        aria-describedby="forworkHelp"
                                                        className="mb-3"
                                                        label={<span className="text-sm">For work</span>}
                                                    />
                                                    <small
                                                        id="forworkHelp"
                                                        className="text-muted form-text"
                                                    >
                                                        Explore top-rated homes with essentials like a workspace, wifi, and self check-in
                                                    </small>
                                                </Col>
                                            </Row>
                                        </div>
                                        {data.amenities &&
                                            <div className="filter-block">
                                                <h6 className="mb-3">
                                                    {data.amenities.title}
                                                </h6>

                                                <ul className="list-inline mb-0">
                                                    {data.amenities.items.map(amenity =>
                                                        <li
                                                            key={amenity.value}
                                                            className="list-inline-item">
                                                            <CustomInput
                                                                type="checkbox"
                                                                id={amenity.value}
                                                                name={amenity.value}
                                                                label={amenity.label}
                                                            />
                                                        </li>
                                                    )}
                                                </ul>

                                            </div>
                                        }
                                        {data.facilities &&
                                            <div className="filter-block">
                                                <h6 className="mb-3">
                                                    {data.facilities.title}
                                                </h6>
                                                <ul className="list-inline mb-0">
                                                    {data.facilities.items.map(facility =>
                                                        <li
                                                            key={facility.value}
                                                            className="list-inline-item">
                                                            <CustomInput
                                                                type="checkbox"
                                                                id={facility.value}
                                                                name={facility.value}
                                                                label={facility.label}
                                                            />
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        }
                                    </Collapse>
                                </Col>
                            </Row>
                            <Row>
                                <Col
                                    sm="6"
                                    className="mb-4 order-2 order-sm-1"
                                >
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        <i className="fas fa-search mr-1" />
                                        Search
                                    </Button>
                                </Col>
                                <Col
                                    sm="6"
                                    className="mb-4 text-sm-right order-1 order-sm-2"
                                >
                                    <Button
                                        aria-expanded={filterCollapse}
                                        onClick={() => setFilterCollapse(!filterCollapse)}
                                        color="link"
                                        className="btn-collapse pl-0 text-secondary"
                                    >
                                        {filterCollapse ? 'Less filters' : 'More filters'}

                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <hr className="my-4" />
                        <ResultsTopBar sortBy={data.sortby} />
                        <Row>
                            {geoJSON.features && geoJSON.features.map(room =>
                                <Col
                                    key={room.properties.name}
                                    sm="6"
                                    className="mb-5 hover-animate"
                                    onMouseEnter={() => onCardEnter(room.properties.id)}
                                    onMouseLeave={() => onCardLeave()}
                                >
                                    <CardRoom data={room.properties} />
                                </Col>
                            )}
                        </Row>
                        <Pagination />
                    </Col>
                    <Col
                        lg="6"
                        className="map-side-lg pr-lg-0"
                    >
                        {mapLoaded &&
                            <Map
                                className="map-full shadow-left"
                                center={[51.505, -0.09]}
                                zoom={14}
                                dragging={dragging}
                                tap={tap}
                                geoJSON={geoJSON}
                                hoverCard={hoverCard}
                            />
                        }
                    </Col>
                </Row>
            </Container>

        </React.Fragment>
    )
}