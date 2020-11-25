import React from 'react'
import { Container } from 'reactstrap'
import ProgressBar from 'components/ProgressBar'
import ListingForm from 'components/ListingForm'
import data from 'data/item-new.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Auction an item - Step 2",
            listingForm: true
        },
    }
}

const NewAuction2 = () => {
    return (
        <React.Fragment>
            <ProgressBar progress={80} />
            <section className="py-5">
                <Container>
                    <p className="subtitle text-primary">
                        Auction an item
                    </p>
                    <h1 className="h2 mb-5">
                        {data[2].title}
                        <span className="text-muted float-right">Step 2</span>
                    </h1>
                    <ListingForm
                        data={data[2]}
                        prevStep="step-1"
                        nextStep="step-3"
                    />
                </Container>
            </section>
        </React.Fragment>
    )
}

export default NewAuction2