import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap'

export default () => {
    return (
        <div id="breadcrumb" className="docs-item element">
            <h5 className="text-uppercase mb-4">Breadcrumb</h5>
            <div className="docs-desc"><p className="lead">Indicate the current page’s location within a navigational hierarchy that automatically adds separators via CSS.. See the <a href="https://reactstrap.github.io/components/breadcrumbs/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Card className="mb-3">
                    <CardBody>
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <a href="#">Home</a>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <a href="#">Library</a>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>
                                Data
                            </BreadcrumbItem>
                        </Breadcrumb>
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
    `import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

export default () => {
    return (
        <Breadcrumb>
            <BreadcrumbItem>
                <a href="#">Home</a>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <a href="#">Library</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>
                Page
            </BreadcrumbItem>
        </Breadcrumb>
    )
}`