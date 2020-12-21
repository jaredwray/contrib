import React from 'react'
import 'react-dates/initialize'
import Select from 'react-select'
import { Container, Row, Col, Form, Input, Label, Collapse, Button, FormGroup, CustomInput } from 'reactstrap'
import Nouislider from 'nouislider-react'
import Pagination from 'src/components/Pagination'
import ResultsTopBar from 'src/components/ResultsTopBar'
import CardAuction from 'src/components/CardAuction'
import { connectToDatabase } from 'src/services/mongodb'

export async function getServerSideProps(context) {
    const { docs } = await connectToDatabase()
    const filter = buildAuctionFilter(context.query)
    const auctions = await docs.auctions().find(filter).toArray()

    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Auction search',
            auctions: JSON.parse(JSON.stringify(auctions)),
            query: context.query
        },
    }
}

function buildAuctionFilter(query) {
    const filter = { }
    const now = new Date()

    const active = query.status == 'active' || Array.isArray(query.status) && query.status.includes('active')
    const complete = query.status == 'complete' || Array.isArray(query.status) && query.status.includes('complete')
    if (active && !complete) {
        filter['startAt'] = { $lte: now }
        filter['endAt'] = { $gt: now }
    }
    if (!active && complete) {
        filter['endAt'] = { $lt: now }
    }
    // Active & complete or no filter just means all

    if (query.sports)
        filter['sport'] = query.sports

    return filter
}

const Auctions = (props) => {
    const [filterCollapse, setFilterCollapse] = React.useState(false)

    const [priceMin, setPriceMin] = React.useState(40)
    const [priceMax, setPriceMax] = React.useState(110)

    const priceSlider = (render, handle, value, un, percent) => {
        setPriceMin(value[0].toFixed(0))
        setPriceMax(value[1].toFixed(0))
    }

    const auctions = props.auctions || []
    const statusOptions = [{ label: "Active", value: "active" }, { label: "Complete", value: "complete" }]

    return (
        <React.Fragment>
            <Container
                fluid
                className="pt-5 pb-3 border-bottom px-lg-5">
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
                                    for="form_text"
                                    className="form-label">
                                    Keywords
                                </Label>
                                <div>
                                    <Input
                                        name="text"
                                        id="form_text"
                                        placeholder="Type search text"
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label
                                    for="form_sports"
                                    className="form-label">
                                    Sports category
                                </Label>
                                <div>
                                    <Select
                                        name="sports"
                                        id="form_sports"
                                        options={["Soccer", "Basketball", "Baseball", "Football"].map(c => ({ label: c, value: c.toLowerCase() }))}
                                        isMulti
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
                                                id="form_team"
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
                                                id="form_game"
                                                isMulti
                                                isSearchable
                                                className="form-control dropdown bootstrap-select"
                                                classNamePrefix="selectpicker" />
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Label className="form-label">
                                                Features
                                            </Label>
                                            <ul className="list-inline mb-0 mt-1">
                                                <li className="mb-3">
                                                    <CustomInput
                                                        id="gameworn"
                                                        type="switch"
                                                        defaultChecked
                                                        label={<span className="text-sm">Game-worn</span>} />
                                                </li>
                                                <li className="mb-3">
                                                    <CustomInput
                                                        id="signed"
                                                        type="switch"
                                                        label={<span className="text-sm">Signed</span>} />
                                                </li>
                                                <li>
                                                    <CustomInput
                                                        id="authenticity"
                                                        type="switch"
                                                        label={<span className="text-sm">Certificate of authenticity</span>} />
                                                </li>
                                            </ul>
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Label
                                                for="form_status" className="form-label">
                                                Status
                                            </Label>
                                            <Select
                                                name="status"
                                                id="form_status"
                                                isMulti
                                                isSearchable
                                                defaultValue={statusOptions.filter(s => props.query.status && props.query.status.includes(s.value))}
                                                options={statusOptions}
                                                className="form-control dropdown bootstrap-select"
                                                classNamePrefix="selectpicker" />
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
                        <ResultsTopBar count={auctions.length} sortBy={["Best match", "Most popular", "Lowest price", "Newly listed", "Ending soonest"].map(c => ({ label: c, value: c.toLowerCase().replace(/[ ]/g, '') }))} />
                        <Row>
                            {auctions.map(auction =>
                                <Col
                                    key={auction._id}
                                    sm="6"
                                    xl="4"
                                    className="mb-5 hover-animate">
                                    <CardAuction data={auction} />
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

export default Auctions