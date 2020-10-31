import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardBody,
    Button,
    Tooltip
} from 'reactstrap'

export default () => {
    const [tooltipActive, setTooltipActive] = React.useState({})

    const toggle = (name) => {
        setTooltipActive({...tooltipActive, [name]: !tooltipActive[name]})
    }
    return (
        <div id="tooltips" className="docs-item element">
            <h5 className="text-uppercase mb-4">Tooltips</h5>
            <div className="docs-desc"><p className="lead">Custom Bootstrap tooltips with CSS and JavaScript using CSS3 for animations and data-attributes for local title storage. See the <a href="https://reactstrap.github.io/components/tooltips/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Card>
                    <CardBody>
                        <Button color="outline-primary mb-1" id="Tooltip1">Tooltip on top</Button>
                        <Tooltip
                            placement="top"
                            isOpen={tooltipActive["tooltip-1"]}
                            target="Tooltip1"
                            toggle={() => toggle("tooltip-1")}
                        >Tooltip on top</Tooltip>
                        <Button color="outline-primary mb-1" id="Tooltip2">Tooltip on right</Button>
                        <Tooltip
                            placement="right"
                            isOpen={tooltipActive["tooltip-2"]}
                            target="Tooltip2"
                            toggle={() => toggle("tooltip-2")}
                        >Tooltip on right</Tooltip>
                        <Button color="outline-primary mb-1" id="Tooltip3">Tooltip on bottom</Button>
                        <Tooltip
                            placement="bottom"
                            isOpen={tooltipActive["tooltip-3"]}
                            target="Tooltip3"
                            toggle={() => toggle("tooltip-3")}
                        >Tooltip on bottom</Tooltip>
                        <Button color="outline-primary mb-1" id="Tooltip4">Tooltip on left</Button>
                        <Tooltip
                            placement="left"
                            isOpen={tooltipActive["tooltip-4"]}
                            target="Tooltip4"
                            toggle={() => toggle("tooltip-4")}
                        >Tooltip on left</Tooltip>
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
    `import { Button, Tooltip } from 'reactstrap'

export default () => {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button id="Tooltip1">Tooltip on top</Button>
            <Tooltip
                placement="top"
                isOpen={open}
                target="Tooltip1"
                toggle={() => setOpen(!open)}
            >
                Tooltip on top
            </Tooltip>
        </>
    )
}`