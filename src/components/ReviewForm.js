import React from 'react'

import {
    Button,
    Collapse,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Col
} from 'reactstrap'

export default () => {
    const [reviewCollapse, setReviewCollapse] = React.useState(false)
    return (
        <div className="py-5">
            <Button
                type="button"
                color="outline-primary"
                onClick={() => setReviewCollapse(!reviewCollapse)}
            >
                Leave a review
            </Button>
            <Collapse
                id="leaveReview"
                className="mt-4"
                isOpen={reviewCollapse}
            >
                <h5 className="mb-4">Leave a review</h5>
                <Form className="form">
                    <Row>
                        <Col sm="6">
                            <FormGroup>
                                <Label
                                    for="name"
                                    className="form-label"
                                >
                                    Your name *
                            </Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter your name"
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="6">
                            <FormGroup>
                                <Label
                                    for="rating"
                                    className="form-label"
                                >
                                    Your name *
                            </Label>
                                <select name="rating" id="rating" className="custom-select focus-shadow-0">
                                    <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733; (5/5)</option>
                                    <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734; (4/5)</option>
                                    <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734; (3/5)</option>
                                    <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734; (2/5)</option>
                                    <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734; (1/5)</option>
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label
                            for="email"
                            className="form-label"
                        >
                            Your name *
                            </Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your  email"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label
                            for="review"
                            className="form-label"
                        >
                            Review text *
                            </Label>
                        <Input
                            rows="4"
                            type="textarea"
                            name="review"
                            id="review"
                            placeholder="Enter your  email"
                            required
                        />
                    </FormGroup>
                    <Button
                        type="submit"
                        color="primary"
                    >
                        Post review
                </Button>
                </Form>
            </Collapse>
        </div>
    )
}