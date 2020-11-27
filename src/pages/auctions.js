import React from 'react'
import 'react-dates/initialize'
import Select from 'react-select'
import { Container, Row, Col, Form, Input, Label, Collapse, Button, FormGroup, CustomInput } from 'reactstrap'
import Nouislider from 'nouislider-react'
import Pagination from 'components/Pagination'
import ResultsTopBar from 'components/ResultsTopBar'
import data from 'data/auctions.json'
import sportsCategories from 'data/sports-categories'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Auction search'
        },
    }
}

const Auctions = () => {
    const [filterCollapse, setFilterCollapse] = React.useState(false)

    const [priceMin, setPriceMin] = React.useState(40)
    const [priceMax, setPriceMax] = React.useState(110)

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
                        <h1 className="mb-4">Search auctions</h1>
                        <p className="lead text-muted">
                            Find game-worn sports memorabilia from your favorite athletes and support deserving charities at the same time.
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container
                fluid
                className="py-5 px-lg-5">
                <Row>
                    <Col
                        lg="3"
                        className="pt-3">
                        <Form className="pr-xl-3">
                            <div className="mb-4">
                                <Label
                                    for="form_category"
                                    className="form-label">
                                    Keywords
                                </Label>
                                <div>
                                    <Input
                                        name="text"
                                        inputId="form_text"
                                        placeholder="Type search text"
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label
                                    for="form_category"
                                    className="form-label">
                                    Sports category
                                </Label>
                                <div>
                                    <Select
                                        name="category"
                                        inputId="form_category"
                                        options={sportsCategories.map(s => ({ label: s, value: s.toLowerCase() }))}
                                        isMulti
                                        isSearchable
                                        className="form-control dropdown bootstrap-select"
                                        classNamePrefix="selectpicker" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label className="form-label">
                                    Price range
                                </Label>
                                <Nouislider
                                    range={{ min: 15, max: 3000 }}
                                    start={[15, 3000]}
                                    onUpdate={priceSlider}
                                    className="text-primary"
                                    connect />
                                <div className="nouislider-values">
                                    <div className="min">From $<span id="slider-snap-value-from">{priceMin}</span></div>
                                    <div className="max">To $<span id="slider-snap-value-to">{priceMax}</span></div>
                                </div>
                            </div>
                            <div className="pb-4">
                                <Collapse isOpen={filterCollapse}>
                                    <div className="filter-block">
                                    <h6>Additional filtering</h6>
                                        <FormGroup className="mb-4">
                                            <Label
                                                for="form_team" className="form-label">
                                                Team
                                            </Label>
                                            <Select
                                                name="team"
                                                inputId="form_team"
                                                isMulti
                                                isSearchable
                                                className="form-control dropdown bootstrap-select"
                                                classNamePrefix="selectpicker" />
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Label
                                                for="form_game" className="form-label">
                                                Game
                                            </Label>
                                            <Select
                                                name="game"
                                                inputId="form_game"
                                                isMulti
                                                isSearchable
                                                className="form-control dropdown bootstrap-select"
                                                classNamePrefix="selectpicker" />
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Label className="form-label">
                                                Options
                                            </Label>
                                            <ul className="list-inline mb-0 mt-1">
                                                <li className="mb-3">
                                                    <CustomInput
                                                        id="instantBook"
                                                        type="switch"
                                                        checked
                                                        label={<span className="text-sm">Game-worn</span>} />
                                                </li>
                                                <li>
                                                    <CustomInput
                                                        id="superhost"
                                                        type="switch"
                                                        checked
                                                        label={<span className="text-sm">Certificate of authenticity</span>} />
                                                </li>
                                            </ul>
                                        </FormGroup>
                                    </div>
                                </Collapse>
                                <div className="mb-4">
                                    <Button
                                        aria-expanded={filterCollapse}
                                        onClick={() => setFilterCollapse(!filterCollapse)}
                                        color="link"
                                        className="btn-collapse pl-0 text-secondary">
                                        {filterCollapse ? 'Less filters' : 'More filters'}
                                    </Button>
                                </div>
                                <div className="mb-4">
                                    <Button
                                        type="submit"
                                        color="primary">
                                        <i className="fas fa-search mr-1" />
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Col>
                    <Col lg="9">
                        <ResultsTopBar sortBy={data.sortby} />
                        <Pagination />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default Auctions