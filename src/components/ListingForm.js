import React from 'react'
import Link from 'next/link'
import { Row, Col, Form, FormGroup, Label, Input, Button, CustomInput } from 'reactstrap'
import Select from 'react-select'
import { useDropzone } from 'react-dropzone'
import { FormContext } from 'components/FormContext'

const ListingForm = props => {
    const data = props.data
    const [formInputs, setFormInputs] = React.useContext(FormContext)

    const onChange = (e) => {
        const value = e.target.value;
        setFormInputs({ ...formInputs, [e.target.name]: value })
    }

    const onCheckboxChange = (e) => {
        const value = e.target.value;
        setFormInputs({ ...formInputs, [e.target.id]: !value })
    }

    const onSelectChange = (name, e) => {
        setFormInputs({ ...formInputs, [name]: e })
    }

    const onButtonDecrease = (e, name) => {
        const value = parseInt(e.target.nextElementSibling.value, 10)
        setFormInputs({ ...formInputs, [name]: value - 1 })
    }
    const onButtonIncrease = (e, name) => {
        const value = parseInt(e.target.previousElementSibling.value, 10)
        setFormInputs({ ...formInputs, [name]: value + 1 })
    }

    let dropZone;

    return (
        <Form>
            {data.formBlocks.map(block =>
                <Row className="form-block" key={block.title}>
                    <Col lg="4">
                        <h4>
                            {block.title}
                        </h4>
                        <p className="text-muted text-sm">
                            {block.content}
                        </p>
                    </Col>
                    <Col
                        lg="7"
                        className="ml-auto"
                    >
                        {block.inputs.map((input, index) => {
                            if (input.type == 'upload') {
                                dropZone = useDropzone({
                                    accept: input.accept,
                                    onDrop: acceptedFiles => {
                                        setFormInputs({
                                            ...formInputs,
                                            [input.name]: acceptedFiles.map(file =>
                                                Object.assign(file, { preview: URL.createObjectURL(file) }))
                                        })
                                    }
                                })
                            }
                            return <React.Fragment key={index}>
                                {input.type === "text" &&
                                    <FormGroup>
                                        <Label
                                            className="form-label"
                                            for={input.name}
                                        >
                                            {input.label}
                                        </Label>
                                        <Input
                                            type={input.type}
                                            input={input.name}
                                            name={input.name}
                                            id={input.name}
                                            value={formInputs[input.name] || ''}
                                            onChange={(e) => onChange(e)}
                                        />
                                    </FormGroup>
                                }
                                {input.type === "textarea" &&
                                    <FormGroup className="mb-3">
                                        <Label
                                            className="form-label"
                                            for={input.name}
                                        >
                                            {input.label}
                                        </Label>
                                        <Input
                                            type={input.type}
                                            rows={input.rows || 5}
                                            input={input.name}
                                            name={input.name}
                                            id={input.name}
                                            value={formInputs[input.name] || ''}
                                            onChange={(e) => onChange(e)}
                                            aria-describedby={input.helpId}
                                        />
                                        <small id={input.helpId} className="form-text text-muted mt-2">
                                            {input.help}
                                        </small>
                                    </FormGroup>
                                }
                                {input.type === "select" &&
                                    <FormGroup>
                                        <Label
                                            className="form-label"
                                            for={input.name}
                                        >
                                            {input.label}
                                        </Label>
                                        <Select
                                            id={input.name}
                                            name={input.name}
                                            options={input.options}
                                            className="selectpicker"
                                            classNamePrefix="selectpicker"
                                            value={formInputs[input.name] || ''}
                                            onChange={(e) => onSelectChange(input.name, e)}

                                        />
                                        {input.text &&
                                            <small
                                                id="propertyTypeHelp"
                                                className="form-text text-muted"
                                            >
                                                {input.text}
                                            </small>
                                        }
                                    </FormGroup>
                                }
                                {input.type === "radios" &&
                                    <FormGroup>
                                        <Label className="form-label">
                                            {input.label}
                                        </Label>

                                        {input.radios.map(radio =>
                                            <CustomInput
                                                key={radio.label}
                                                type="radio"
                                                id={radio.id}
                                                name={radio.name}
                                                value={radio.id}
                                                onChange={(e) => onChange(e)}
                                                checked={formInputs[radio.name] === radio.id}
                                                label={radio.label}
                                            />
                                        )}
                                    </FormGroup>
                                }
                                {input.type === "form-group" &&
                                    <Row>
                                        {input.inputs.map(input =>
                                            <Col md={input.col} key={input.name}>
                                                <FormGroup>
                                                    <Label
                                                        for={input.name}
                                                        className="form-label">
                                                        {input.label}
                                                    </Label>
                                                    <Input
                                                        name={input.name}
                                                        id={input.name}
                                                        value={formInputs[input.name] || ''}
                                                        onChange={(e) => onChange(e)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                    </Row>
                                }
                                {input.type === "buttons" &&
                                    <Row>
                                        {input.buttons.map(button =>
                                            <Col lg="4" key={button.name}>
                                                <Label className="form-label">
                                                    {button.label}
                                                </Label>
                                                <div className="d-flex align-items-center">
                                                    <Button
                                                        color="items"
                                                        className="btn-item-decrease"
                                                        onClick={(e) => onButtonDecrease(e, button.name)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        name={button.name}
                                                        value={formInputs[button.name] || 1}

                                                        disabled
                                                        className="input-items"
                                                    />
                                                    <Button
                                                        color="items"
                                                        className="btn-item-increase"
                                                        onClick={(e) => onButtonIncrease(e, button.name)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                }
                                {input.type === "checkboxes" &&
                                    <FormGroup>
                                        <Label className="form-label">
                                            {input.label}
                                        </Label>
                                        <ul className="list-inline mb-0">
                                            {input.checkboxes.map(checkbox =>
                                                <li key={checkbox.id} className="list-inline-item">
                                                    <CustomInput
                                                        type="checkbox"
                                                        id={checkbox.id}
                                                        name={checkbox.name}
                                                        value={formInputs[checkbox.id] || ''}
                                                        onChange={(e) => onCheckboxChange(e)}
                                                        label={checkbox.label}
                                                        className="text-muted"
                                                    />
                                                </li>
                                            )}
                                        </ul>

                                    </FormGroup>
                                }
                                {input.type === "upload" &&
                                    <FormGroup>
                                        <div {...dropZone.getRootProps({ className: 'dropzone dz-clickable' })}>
                                            <input {...dropZone.getInputProps()} />
                                            <div className="dz-message text-muted">
                                                <p>Drop files here or click to upload.</p>
                                            </div>
                                        </div>
                                        <Row className="mt-4">
                                            {formInputs[input.name] && formInputs[input.name].map(file =>
                                                <ol key={file.name} className="col-lg-4 list-unstyled">
                                                    <li>
                                                        {file.type.indexOf('video/') == 0
                                                            ?
                                                            <video controls className="preview-fluid rounded shadow mb-4">
                                                                <source src={file.preview} type={file.type} />
                                                            </video>
                                                            :
                                                            <img
                                                                src={file.preview}
                                                                alt={file.name}
                                                                className="preview-fluid rounded shadow mb-4"
                                                            />
                                                        }
                                                    </li>
                                                </ol>
                                            )}
                                        </Row>
                                    </FormGroup>
                                }
                            </React.Fragment>
                        }
                        )}
                    </Col>
                </Row>
            )}
            <Row className="form-block flex-column flex-sm-row">
                <Col className="text-center text-sm-left">
                    {props.prevStep &&
                        <Link href={props.prevStep} passHref>
                            <Button color="link" className="text-muted">
                                <i className="fa-chevron-left fa mr-2" />
                                Back
                            </Button>
                        </Link>
                    }
                </Col>
                <Col className="text-center text-sm-right">
                    {props.nextStep &&
                        <Link href={props.nextStep} passHref>
                            <Button color="primary" className="px-3">
                                Next step
                                <i className="fa-chevron-right fa ml-2" />
                            </Button>
                        </Link>
                    }
                    {props.finish &&
                        <Link href={props.finish} passHref>
                            <Button color="primary" className="px-3">
                                Finish
                                <i className="fa-chevron-right fa ml-2" />
                            </Button>
                        </Link>
                    }
                </Col>
            </Row>
        </Form>
    )
}

export default ListingForm