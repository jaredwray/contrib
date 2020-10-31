import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'

export default () => {
    const [dropdown, setDropdown] = React.useState(false)

    return (
        <div id="dropdowns" className="docs-item element">
            <h5 className="text-uppercase mb-4">Dropdowns</h5>
            <div className="docs-desc"><p className="lead">Toggle contextual overlays for displaying lists of links and more with the Bootstrap dropdown plugin. See the <a href="https://reactstrap.github.io/components/dropdowns/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Dropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)} direction="down" className="d-inline-block">
                    <DropdownToggle color="outline-primary" className="dropdown-toggle">Default</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header className="font-weight-normal">Dropdown header</DropdownItem>
                        <DropdownItem href="#">Action</DropdownItem>
                        <DropdownItem href="#">Another action</DropdownItem>
                        <DropdownItem href="#">Something else here</DropdownItem>
                        <DropdownItem divider></DropdownItem>
                        <DropdownItem href="#">Something else here</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
    `import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export default () => {
    const [dropdown, setDropdown] = React.useState(false)

    return (
        <Dropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)} direction="down" className="d-inline-block">
            <DropdownToggle color="outline-primary" className="dropdown-toggle">Default</DropdownToggle>
            <DropdownMenu>
                <DropdownItem header className="font-weight-normal">Dropdown header</DropdownItem>
                <DropdownItem href="#">Action</DropdownItem>
                <DropdownItem href="#">Another action</DropdownItem>
                <DropdownItem href="#">Something else here</DropdownItem>
                <DropdownItem divider></DropdownItem>
                <DropdownItem href="#">Something else here</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}`