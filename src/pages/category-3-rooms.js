import React from 'react'

import 'react-dates/initialize'

import UseWindowSize from '../hooks/UseWindowSize'

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
    FormGroup,
    CustomInput
} from 'reactstrap'

import Nouislider from 'nouislider-react'
import Pagination from '../components/Pagination'

import ResultsTopBar from '../components/ResultsTopBar'
import CardRoom from '../components/CardRoom'

import data from '../data/category-3-rooms.json'
import geoJSON from '../data/rooms-geojson.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Rooms | Category - No map'
        },
    }
}


export default () => {
    const size = UseWindowSize()
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
    return (
        <React.Fragment>
            <Container
                fluid
                className="pt-5 pb-3 border-bottom px-lg-5"
            >
                <Row>
                    <Col xl="8">
                        <h1 className="mb-4">{data.title && data.title}</h1>
                        <p className="lead text-muted">
                            {data.content && data.content}
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container
                fluid
                className="py-5 px-lg-5"
            >
                <Row>
                    <Col
                        lg="3"
                        className="pt-3"
                    >
                        <Form className="pr-xl-3">
                            <div className="mb-4">
                                <Label
                                    for="form_dates"
                                    className="form-label"
                                >
                                    Dates
                                    </Label>
                                <DateRangePicker
                                    startDate={range.startDate}
                                    startDateId="fromDate"
                                    endDate={range.endDate}
                                    endDateId="toDate"
                                    onDatesChange={({ startDate, endDate }) => setRange({ startDate, endDate })}
                                    focusedInput={dateFocused}
                                    block={true}
                                    onFocusChange={dateFocused => setDateFocused(dateFocused)}
                                    orientation={size.width < 400 ? "vertical" : "horizontal"}
                                />
                            </div>
                            <div className="mb-4">
                                <Label
                                    for="form_guests"
                                    className="form-label"
                                >
                                    Guests
                                </Label>
                                <div>
                                    <Select
                                        name="guests"
                                        id="form_guests"
                                        options={data.guests && data.guests}
                                        isMulti
                                        isSearchable
                                        className="form-control dropdown bootstrap-select"
                                        classNamePrefix="selectpicker"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label
                                    for="form_type"
                                    className="form-label"
                                >
                                    Home type
                                    </Label>
                                <Select
                                    name="type"
                                    id="form_type"
                                    options={data.guests && data.guests}
                                    isMulti
                                    isSearchable
                                    className="form-control dropdown bootstrap-select"
                                    classNamePrefix="selectpicker"
                                />
                            </div>
                            <div className="mb-4">
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
                            </div>
                            <div className="mb-4">
                                <Label
                                    className="form-label"
                                >
                                    Host and booking
                                        </Label>
                                <ul className="list-inline mb-0 mt-1">
                                    <li className="list-inline-item mb-2">
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
                            <div className="pb-4">
                                <Collapse isOpen={filterCollapse}>
                                    <div className="filter-block">
                                        <h6 className="mb-3">
                                            Location
                                            </h6>
                                        <FormGroup className="mb-4">
                                            <Label
                                                for="form_neighbourhood" className="form-label"
                                            >
                                                Neighbourhood
                                                    </Label>
                                            <Select
                                                name="neighbourhood"
                                                id="form_neighbourhood"
                                                options={data.neighbourhood && data.neighbourhood}
                                                isMulti
                                                isSearchable
                                                className="form-control dropdown bootstrap-select"
                                                classNamePrefix="selectpicker"
                                            />
                                        </FormGroup>
                                        {data.tags &&
                                            <FormGroup className="mb-0">
                                                <Label className="form-name">
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
                                            </FormGroup>
                                        }
                                    </div>
                                    <div className="filter-block">
                                        <h6 className="mb-3">
                                            Rooms and beds
                                        </h6>
                                        <FormGroup className="mb-2">
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
                                        </FormGroup>
                                        <FormGroup className="mb-2">
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
                                        </FormGroup>
                                        <FormGroup className="mb-2">
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
                                        </FormGroup>
                                    </div>
                                    <div className="filter-block">
                                        <h6 className="mb-3">
                                            Trip type
                                            </h6>
                                        <FormGroup className="mb-0">
                                            <CustomInput
                                                id="forfamilies"
                                                type="switch"
                                                name="forfamilies"
                                                aria-describedby="forfamiliesHelp"
                                                className="mb-2"
                                                label={<span className="text-sm">For Families</span>}
                                            />
                                            <small
                                                id="forfamiliesHelp"
                                                className="text-muted form-text"
                                            >
                                                Explore entire homes with 5-star reviews from families and essentials like a kitchen and TV
                                                    </small>
                                        </FormGroup>
                                        <FormGroup className="mb-0">
                                            <CustomInput
                                                id="forwork"
                                                type="switch"
                                                name="forwork"
                                                aria-describedby="forworkHelp"
                                                className="mb-2"
                                                label={<span className="text-sm">For work</span>}
                                            />
                                            <small
                                                id="forworkHelp"
                                                className="text-muted form-text"
                                            >
                                                Explore top-rated homes with essentials like a workspace, wifi, and self check-in
                                                    </small>
                                        </FormGroup>

                                    </div>
                                    {data.amenities &&
                                        <div className="filter-block">
                                            <h6 className="mb-3">
                                                {data.amenities.title}
                                            </h6>

                                            <ul className="list-unstyled mb-0">
                                                {data.amenities.items.map(amenity =>
                                                    <li key={amenity.value}>
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
                                            <ul className="list-unstyled mb-0">
                                                {data.facilities.items.map(facility =>
                                                    <li key={facility.value}>
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
                                <div className="mb-4">
                                    <Button
                                        aria-expanded={filterCollapse}
                                        onClick={() => setFilterCollapse(!filterCollapse)}
                                        color="link"
                                        className="btn-collapse pl-0 text-secondary"
                                    >
                                        {filterCollapse ? 'Less filters' : 'More filters'}

                                    </Button>
                                </div>
                                <div className="mb-4">
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        <i className="fas fa-search mr-1" />
                                        Search
                                    </Button>
                                </div>
                            </div>

                        </Form>
                    </Col>
                    <Col lg="9">
                        <ResultsTopBar sortBy={data.sortby} />
                        <Row>
                            {geoJSON.features && geoJSON.features.map(room =>
                                <Col
                                    key={room.properties.name}
                                    sm="6"
                                    xl="4"
                                    className="mb-5 hover-animate"
                                >
                                    <CardRoom data={room.properties} />
                                </Col>
                            )}

                        </Row>
                        <Pagination />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}