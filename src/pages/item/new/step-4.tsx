import React from 'react'
import Link from 'next/link'
import { Container, Button } from 'reactstrap'
import { FormContext } from 'src/components/FormContext'
import ProgressBar from 'src/components/ProgressBar'
import data from 'src/data/item-new.json'

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
                        {
                            data[4].buttons.map(button =>
                                <Link href={button.link} passHref>
                                    <Button color="primary" className="mr-2 mb-2">
                                        {button.title}
                                    </Button>
                                </Link>
                            )
                        }
                    </p>
                </Container>
            </section>
        </React.Fragment>
    )
}

export default NewAuction4