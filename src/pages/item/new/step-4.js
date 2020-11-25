import React from 'react'
import Link from 'next/link'
import { Container, Button } from 'reactstrap'
import { FormContext } from 'components/FormContext'
import ProgressBar from 'components/ProgressBar'
import data from 'data/item-new.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Auction an item - Step 4",
            listingForm: true
        },
    }
}

const NewAuction4 = () => {
    const [formInputs, setFormInputs] = React.useContext(FormContext)

    return (
        <React.Fragment>
            <ProgressBar progress={100} />
            <section className="py-5">
                <Container className="text-center">
                    <p className="subtitle text-primary">
                        Auction an item
                    </p>
                    <h1 className="h2 mb-5">
                        {data[4].title}
                    </h1>
                    <p className="mb-5">
                        <img src="/content/img/illustration/undraw_celebration_0jvk.svg" alt="" style={{ width: "400px" }} className="img-fluid" />
                    </p>
                    <p className="mb-5 text-muted">
                        {data[4].content}
                    </p>
                    <p className="mb-5">
                        <Link href={data[4].buttons[0].link} passHref>
                            <Button color="primary" className="mr-2 mb-2">
                                {data[4].buttons[0].title}
                            </Button>
                        </Link>
                        <Link href={data[4].buttons[1].link} passHref>
                            <Button color="outline-muted" className="mb-2">
                                {data[4].buttons[1].title}
                            </Button>
                        </Link>
                    </p>
                </Container>
            </section>
        </React.Fragment>
    )
}

export default NewAuction4