import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    CustomInput
} from 'reactstrap'

export default () => {
    return (
        <div id="forms" className="docs-item element">
            <h5 className="text-uppercase mb-4">Forms</h5>
            <div className="docs-desc"><p className="lead">Examples and usage guidelines for form control styles, layout options, and custom components for creating a wide variety of forms. See the <a href="https://reactstrap.github.io/components/form/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="text-uppercase mb-4">Form Group</h6>
                        <Form>
                            <FormGroup>
                                <Label for="exampleInputEmail1" className="form-label">Email address</Label>
                                <Input id="exampleInputEmail1" type="email" aria-describedby="emailHelp" placeholder="Enter email" />
                                <FormText id="emailHelp">We'll never share your email with anyone else.</FormText>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="text-uppercase mb-4">Input Sizes</h6>
                        <Form>
                            <FormGroup>
                                <Input bsSize="sm" id="exampleInputSm" type="text" aria-describedby="inputSm" placeholder="Form Control Small" />
                            </FormGroup>
                            <FormGroup>
                                <Input id="exampleInputSt" type="text" aria-describedby="inputSt" placeholder="Form Control Standard" />
                            </FormGroup>
                            <FormGroup>
                                <Input bsSize="lg" id="exampleInputLg" type="text" aria-describedby="inputLg" placeholder="Form Control Large" />
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="text-uppercase mb-4">Input Group</h6>
                        <Form>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText id="basic-addon1">@</InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                            </InputGroup>
                        </Form>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <h6 className="text-uppercase mb-4"> Custom Inputs</h6>
                        <Form>
                            <FormGroup>
                                <CustomInput type="checkbox" id="custom-check-1">
                                    <Label for="custom-check-1" className="custom-control-label">Check this custom checkbox</Label>
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <div className="custom-control custom-checkbox-switch">
                                    <Input id="custom-switch-1" type="checkbox" className="custom-control-input" />
                                    <Label for="custom-switch-1" className="custom-control-label">Switch this custom checkbox</Label>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <CustomInput type="radio" id="radio1" name="radio" label="Toggle this custom radio" />
                                <CustomInput type="radio" id="radio2" name="radio" label="Or toggle this other custom radio" />
                            </FormGroup>
                            <FormGroup>
                                <CustomInput defaultValue="0" id="select" type="select">
                                    <option value="0">Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <CustomInput type="file" id="customFile">
                                    <Label for="customFile" className="custom-file-label">Choose file</Label>
                                </CustomInput>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </div>
            <div className="mt-4">
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const highlightCode =
    `import { Form, FormGroup, FormText, Label, Input } from 'reactstrap'

export default () => {
    return (
        <Form>
            <FormGroup>
                <Label for="exampleInputEmail1" className="form-label">Email address</Label>
                <Input id="exampleInputEmail1" type="email" aria-describedby="emailHelp" placeholder="Enter email" />
                <FormText id="emailHelp">We'll never share your email with anyone else.</FormText>
            </FormGroup>
        </Form>
    )
}`