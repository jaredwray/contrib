import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    ListGroup,
    ListGroupItem
} from 'reactstrap'

export default () => {
    return (
        <div id="listgroup" className="docs-item element">
            <h5 className="text-uppercase mb-4">List Group</h5>
            <div className="docs-desc"><p className="lead">List groups are a flexible and powerful component for displaying a series of content. Modify and extend them to support just about any content within. See the <a href="https://reactstrap.github.io/components/listgroup/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <ListGroup>
                    <ListGroupItem>Cras justo odio</ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Morbi leo risus</ListGroupItem>
                    <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
                    <ListGroupItem>Vestibulum at eros</ListGroupItem>
                </ListGroup>
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
    `import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

export default () => {
    return (
        <ListGroup>
            <ListGroupItem>Cras justo odio</ListGroupItem>
            <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
            <ListGroupItem>Morbi leo risus</ListGroupItem>
            <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
            <ListGroupItem>Vestibulum at eros</ListGroupItem>
        </ListGroup>
    )
}`