import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Pagination,
    PaginationItem,
    PaginationLink
} from 'reactstrap'

export default () => {
    return (
        <div id="pagination" className="docs-item element">
            <h5 className="text-uppercase mb-4">Pagination</h5>
            <div className="docs-desc"><p className="lead">Pagination to indicate a series of related content exists across multiple pages. See the <a href="https://reactstrap.github.io/components/pagination/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Pagination aria-label="Page navigation example">
                    <PaginationItem><PaginationLink href="#" aria-label="Previous">Previous</PaginationLink></PaginationItem>
                    <PaginationItem active><PaginationLink href="#">1</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#" aria-label="Next">Next</PaginationLink></PaginationItem>
                </Pagination>
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
    `import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

export default () => {
    return (
        <Pagination aria-label="Page navigation example">
            <PaginationItem>
                <PaginationLink href="#" aria-label="Previous">Previous</PaginationLink>
            </PaginationItem>
            <PaginationItem active>
                <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#" aria-label="Next">Next</PaginationLink>
            </PaginationItem>
        </Pagination>
    )
}`