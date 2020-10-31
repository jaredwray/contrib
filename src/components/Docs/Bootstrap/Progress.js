import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardBody,
    Progress
} from 'reactstrap'

export default () => {
    return (
        <div id="progress" className="docs-item element">
            <h5 className="text-uppercase mb-4">Progress</h5>
            <div className="docs-desc"><p className="lead">Bootstrap custom progress bars featuring support for stacked bars, animated backgrounds, and text labels. See the <a href="https://reactstrap.github.io/components/progress/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Card>
                    <CardBody>
                        <Progress value="25" color="primary" className="mb-3" />
                        <Progress value="50" color="info" className="mb-3" />
                        <Progress value="75" color="success" className="mb-3" />
                        <Progress value="100" color="secondary" />
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
    `import { Progress } from 'reactstrap'

export default () => {
    return (
        <>
            <Progress value="25" color="primary"/>
            <Progress value="50" color="info"/>
            <Progress value="75" color="success"/>
            <Progress value="100" color="secondary" />
        </>
    )
}`