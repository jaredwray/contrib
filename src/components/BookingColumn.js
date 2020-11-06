import React from 'react'
import Link from 'next/link'
import { Media, Card, CardBody, CardFooter } from 'reactstrap'

import Stars from '../components/Stars'

const BookingColumn = props => {
    const from = props.from
    const to = props.to
    return (
        <Card className="border-0 shadow">
            <CardBody className="p-4">
                <div className="text-block pb-3">
                    <Media className="align-items-center">
                        <Media body>
                            <h6>
                                <Link href="detail-rooms">
                                    <a className="text-reset">Modern Apt - Vibrant Neighborhood</a>
                                </Link>
                            </h6>
                            <p className="text-muted text-sm mb-0">
                                Entire home in New York
                                <span className="mt-n1 d-block">
                                    <Stars
                                        stars={4}
                                        size="sm"
                                        color="text-primary"
                                    />
                                </span>
                            </p>
                        </Media>
                        <Link href="detail-rooms">
                            <a>
                                <img
                                    src="/content/img/photo/photo-1512917774080-9991f1c4c750.jpg"
                                    alt=""
                                    width="100"
                                    className="ml-3 rounded"
                                />
                            </a>
                        </Link>
                    </Media>
                </div>
                <div className="text-block py-3">
                    <ul className="list-unstyled mb-0">
                        <li className="mb-3">
                            <i className="fas fa-users fa-fw text-muted mr-2" />3 guests</li>
                        <li className="mb-0">
                            <i className="far fa-calendar fa-fw text-muted mr-2" />
                            {from.month.substring(0, 3)} {from.day}, {from.year} <i className="fas fa-arrow-right fa-fw text-muted mx-3" />
                            {to.month.substring(0, 3)} {to.day}, {to.year}
                        </li>
                    </ul>
                </div>
                <div className="text-block pt-3 pb-0">
                    <table className="w-100">
                        <tbody>
                            <tr>
                                <th className="font-weight-normal py-2">
                                    $432.02 x 1 night
                                </th>
                                <td className="text-right py-2">
                                    $432.02
                                </td>
                            </tr>
                            <tr>
                                <th className="font-weight-normal pt-2 pb-3">
                                    Service fee
                                </th>
                                <td className="text-right pt-2 pb-3">
                                    $67.48
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-top">
                                <th className="pt-3">
                                    Total
                                </th>
                                <td className="font-weight-bold text-right pt-3">
                                    $499.50
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardBody>
            <CardFooter className="bg-primary-light py-4 border-0">
                <Media className="align-items-center">
                    <Media body>
                        <h6 className="text-primary">
                            Flexible – free cancellation
                        </h6>
                        <p className="text-sm text-primary opacity-8 mb-0">
                            Cancel within 48 hours of booking to get a full refund. <a href="#" className="text-reset ml-3">More details</a>
                        </p>
                    </Media>
                    <svg className="svg-icon svg-icon svg-icon-light w-3rem h-3rem ml-2 text-primary">
                        <use xlinkHref="/content/svg/orion-svg-sprite.svg#diploma-1" />
                    </svg>
                </Media>
            </CardFooter>
        </Card>
    )
};

export default BookingColumn;