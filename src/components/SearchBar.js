import React from 'react'

import {
    Row,
    Col,
    Form,
    Input,
    Label,
    Button,

} from 'reactstrap'

import Select from 'react-select'

export default props => {

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderStyle: 'transparent',
        }),
        indicatorSeparator: (provided, state) => ({
            display: 'none'
        }),
        menu: (provided, state) => ({
            ...provided,
            color: 'red',
            border: '0 solid #fff',
            boxShadow: '0 0 1.2rem rgba(0, 0, 0, .15)',

        })
    }

    return (
        <div className={`search-bar ${props.className}`}>
            <Form>
                <Row>
                    <Col
                        lg="4"
                        className="d-flex align-items-center form-group"
                    >
                        <Input
                            type="text"
                            name="search"
                            placeholder="What are you searching for?"
                            className="border-0 shadow-0"
                        />
                    </Col>
                    <Col
                        lg="3"
                        md={props.halfInputs ? "6" : "12"}
                        className="d-flex align-items-center form-group"
                    >
                        <div className="input-label-absolute input-label-absolute-right w-100">
                            <Label
                                for="location"
                                className="label-absolute">
                                <i className="fa fa-crosshairs" />
                                <span className="sr-only">City</span>
                            </Label>
                            <Input
                                type="text"
                                name="location"
                                placeholder="Location"
                                id="location"
                                className="border-0 shadow-0"
                            />
                        </div>
                    </Col>
                    <Col
                        lg="3"
                        md={props.halfInputs ? "6" : "12"}
                        className="d-flex align-items-center form-group no-divider"
                    >
                        <Select
                            id="reactselect"
                            options={props.options}
                            placeholder="Categories"
                            className="selectpicker"
                            classNamePrefix="selectpicker"
                            styles={customSelectStyles}
                        />
                    </Col>
                    <Col
                        lg="2"
                        className={props.btnMb ? `mb-${props.btnMb}` : ``}
                    >
                        <Button
                            type="submit"
                            color="primary"
                            className={`btn-block h-100 ${props.btnClassName ? props.btnClassName : ""}`}
                        >
                            Search
                      </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}