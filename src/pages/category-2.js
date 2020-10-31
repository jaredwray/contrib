import React from 'react'
import dynamic from 'next/dynamic'

import UseWindowSize from '../hooks/UseWindowSize'

import {
    Container,
    Row,
    Col,
    Form,
    Label,
    Input,
    Collapse,
    Button,
    CustomInput
} from 'reactstrap'

import Select from 'react-select'

import CardRestaurant from '../components/CardRestaurant'
import ResultsTopBar from '../components/ResultsTopBar'
import Nouislider from "nouislider-react"
import Pagination from '../components/Pagination'

import data from '../data/category2.json'
import geoJSON from '../data/restaurants-geojson.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Restaurants | Category - Map on the right'
        },
    }
}

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const [dragging, setDragging] = React.useState(false)
    const [tap, setTap] = React.useState(false)

    const [filterCollapse, setFilterCollapse] = React.useState(false)
    const size = UseWindowSize()

    const [priceMin, setPriceMin] = React.useState(40)
    const [priceMax, setPriceMax] = React.useState(110)

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )
        setMapLoaded(true)

        setTap(size.width > 700 ? true : false)
        setDragging(size.width > 700 ? true : false)
    }, [])


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
                        className="py-5 p-xl-5"
                    >
                        <h1 className="text-serif mb-4">
                            {data.title}
                        </h1>
                        <hr className="my-4" />
                        <Form>
                            <Row>
                                <Col
                                    md="6"
                                    xl="4"
                                    className="mb-4"
                                >
                                    <Label for="form_search" className="form-label">Keyword</Label>
                                    <div className="input-label-absolute input-label-absolute-right">
                                        <div className="label-absolute">
                                            <i className="fa fa-search" />
                                        </div>
                                        <Input
                                            type="search"
                                            name="search"
                                            id="form-search"
                                            className="pr-4"
                                            placeholder="Keywords"
                                        />
                                    </div>
                                </Col>

                                <Col
                                    md="6"
                                    xl="4"
                                    className="mb-4"
                                >
                                    <Label for="form_neighbourhood" className="form-label">Neighbourhood</Label>

                                    <Select
                                        name="neighbourhood"
                                        id="form_neighbourhood"
                                        options={data.neighbourhood}
                                        isMulti
                                        isSearchable
                                        className="form-control dropdown bootstrap-select"
                                        classNamePrefix="selectpicker"
                                    />
                                </Col>
                                <Col
                                    md="6"
                                    xl="4"
                                    className="mb-4"
                                >
                                    <Label for="form_category" className="form-label">Category</Label>

                                    <Select
                                        name="category"
                                        id="form_category"
                                        options={data.categories}
                                        className="form-control dropdown bootstrap-select"
                                        classNamePrefix="selectpicker"
                                    />
                                </Col>
                                {data.tags &&
                                    <Col
                                        xs="12"
                                        className="mb-4"
                                    >
                                        <Label className="form-label">
                                            {data.tags.title}
                                        </Label>
                                        <ul className="list-inline mb-0">
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
                                <Col
                                    xs="12"
                                    className="pb-4"
                                >
                                    <Collapse isOpen={filterCollapse}>
                                        {data.cuisine &&
                                            <div className="mb-4">
                                                <Label className="form-label">
                                                    {data.cuisine.title}
                                                </Label>
                                                <ul className="list-inline mb-0">
                                                    {data.cuisine.items.map(tag =>
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
                                            </div>
                                        }
                                        <Row>
                                            <Col
                                                xl="6"
                                                className="mb-4"
                                            >
                                                <Label className="form-label">
                                                    Price
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
                                                xl="6"
                                                className="mb-4"
                                            >
                                                <Label className="form-label">
                                                    Vegetarians
                                                </Label>
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item">
                                                        <CustomInput type="radio" id="vegetarians_0" name="vegetarians" label="All" />
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <CustomInput type="radio" id="vegetarians_1" name="vegetarians" label="Vegetarian only" />
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>

                                    </Collapse>
                                </Col>
                                <Col
                                    xs="6"
                                    className="mb-4"
                                >
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        <i className="fas fa-filter mr-1" />Filter
                                    </Button>
                                </Col>
                                <Col
                                    xs="6"
                                    className="mb-4 text-right"
                                >
                                    <Button
                                        aria-expanded={filterCollapse}
                                        color="link"
                                        className="pl-0 text-secondary btn-collapse"
                                        onClick={() => setFilterCollapse(!filterCollapse)}
                                    >
                                        {filterCollapse ? 'Less filters' : 'More filters'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <hr className="my-4" />
                        <ResultsTopBar sortBy={data.sortby} />
                        {geoJSON.features &&
                            <Row>
                                {geoJSON.features.map((place, index) =>
                                    <Col
                                        key={index}
                                        sm="6"
                                        className="mb-5 hover-animate"
                                        onMouseEnter={() => onCardEnter(place.properties.id)}
                                        onMouseLeave={() => onCardLeave()}
                                    >
                                        <CardRestaurant data={place.properties} />
                                    </Col>
                                )}
                            </Row>
                        }
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
                                popupVenue={true}
                                hoverCard={hoverCard}
                            />
                        }

                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}