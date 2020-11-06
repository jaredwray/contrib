import React from 'react'

import Link from 'next/link'

import {
    Container,
    Row,
    Button,
    Table,
    Breadcrumb,
    BreadcrumbItem,
    Badge
} from 'reactstrap'

import Stars from '../components/Stars'

import data from '../data/compare.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Compare"
        },
    }
}

const Compare = () => {
    return (
        <React.Fragment>
            <section className="hero py-5 py-lg-7">
                <Container className="position-relative">
                    <Breadcrumb listClassName="pl-0 justify-content-center">
                        <BreadcrumbItem>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {data.title}
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <h1 className="hero-heading">{data.title}</h1>
                </Container>
            </section>
            <section className="py-6">
                <Container>
                    <Row>
                        <Table
                            striped
                            responsive="lg"
                            hover
                            className="text-gray-700"
                        >
                            <tbody>
                                <tr className="no-hover no-stripe">
                                    <th className="border-top-0" />
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            style={{ minWidth: '200px' }}
                                            className="border-top-0 pb-0"
                                        >
                                            <Link href="detail-rooms">
                                                <a className="d-inline-block text-reset text-decoration-none">
                                                    <span className="h6">{column.title}</span>
                                                    <br />
                                                    <span className="text-xs">
                                                        <Stars stars={column.stars} />
                                                    </span>
                                                    {column.badge &&
                                                        <React.Fragment>
                                                            <br />
                                                            <Badge color={column.badgeColor} className="mt-3">
                                                                {column.badge}
                                                            </Badge>
                                                        </React.Fragment>
                                                    }
                                                </a>
                                            </Link>
                                        </td>
                                    )}
                                </tr>
                                <tr className="no-hover no-stripe">
                                    <th className="border-top-0" />
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            style={{ minWidth: '200px' }}
                                            className="border-top-0"
                                        >
                                            <Link href="detail-rooms">
                                                <a className="d-inline-block hover-animate">
                                                    <img
                                                        src={`/content/img/photo/${column.img}`}
                                                        alt={column.title}
                                                        className="img-fluid rounded"
                                                    />
                                                </a>
                                            </Link>
                                        </td>

                                    )}
                                </tr>
                                <tr className="no-hover no-stripe">
                                    <th className="border-top-0" />
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="border-top-0"
                                        >
                                            <strong className="text-sm">
                                                {column.price}/night
                                     </strong>
                                            <Button
                                                href="#"
                                                size="sm"
                                                color="outline-primary"
                                                className="float-right">
                                                Book
                                     </Button>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Area</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.area}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Rooms</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.rooms}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Bedrooms</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.bedrooms}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Bathrooms</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.bathrooms}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Air conditioning</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.airconditioning}
                                            <svg className={`svg-icon svg-icon-lg text-${column.airconditioning ? 'success' : 'danger'}`}>
                                                <use xlinkHref={`content/svg/orion-svg-sprite.svg#${column.airconditioning ? 'checkmark-1' : 'close-1'}`}></use>
                                            </svg>
                                            <span className="sr-only">
                                                {column.airconditioning ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Swimming pool</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.swimmingpool}
                                            <svg className={`svg-icon svg-icon-lg text-${column.swimmingpool ? 'success' : 'danger'}`}>
                                                <use xlinkHref={`content/svg/orion-svg-sprite.svg#${column.swimmingpool ? 'checkmark-1' : 'close-1'}`}></use>
                                            </svg>
                                            <span className="sr-only">
                                                {column.swimmingpool ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Laundry</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.laundry}
                                            <svg className={`svg-icon svg-icon-lg text-${column.laundry ? 'success' : 'danger'}`}>
                                                <use xlinkHref={`content/svg/orion-svg-sprite.svg#${column.laundry ? 'checkmark-1' : 'close-1'}`}></use>
                                            </svg>
                                            <span className="sr-only">
                                                {column.laundry ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Window covering</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.windowcovering}
                                            <svg className={`svg-icon svg-icon-lg text-${column.windowcovering ? 'success' : 'danger'}`}>
                                                <use xlinkHref={`content/svg/orion-svg-sprite.svg#${column.windowcovering ? 'checkmark-1' : 'close-1'}`}></use>
                                            </svg>
                                            <span className="sr-only">
                                                {column.windowcovering ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Gym</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.gym}
                                            <svg className={`svg-icon svg-icon-lg text-${column.gym ? 'success' : 'danger'}`}>
                                                <use xlinkHref={`content/svg/orion-svg-sprite.svg#${column.gym ? 'checkmark-1' : 'close-1'}`}></use>
                                            </svg>
                                            <span className="sr-only">
                                                {column.gym ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <th className="py-4 align-middle">Internet</th>
                                    {data.table && data.table.columns.map(column =>
                                        <td
                                            key={column.title}
                                            className="py-4 text-center align-middle"
                                        >
                                            {column.internet}
                                            <svg className={`svg-icon svg-icon-lg text-${column.internet ? 'success' : 'danger'}`}>
                                                <use xlinkHref={`content/svg/orion-svg-sprite.svg#${column.internet ? 'checkmark-1' : 'close-1'}`}></use>
                                            </svg>
                                            <span className="sr-only">
                                                {column.internet ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                                <tr className="no-hover no-stripe">
                                    <th />
                                    {data.table && data.table.columns.map(column =>
                                        <td key={column.title} className="text-center">
                                            <Button color="outline-muted" href="#">Remove</Button>
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
};

export default Compare;