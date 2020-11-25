import React from 'react'
import { Row, Col, Form, Input, Button } from 'reactstrap'
import Select from 'react-select'

const SearchBar = props => {
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '0 solid #fff',
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
                        lg="5"
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
                        lg="4"
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
                        lg="3"
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

export default SearchBar