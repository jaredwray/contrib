import React from 'react'
import { Container } from 'reactstrap'
import ProgressBar from 'src/components/ProgressBar'
import ListingForm from 'src/components/ListingForm'
import data from 'src/data/item-new.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Auction an item - Step 3",
            listingForm: true
        },
    }
}

const NewAuction3 = () => {
    return (
        <React.Fragment>
            <ProgressBar progress={60} />
            <section className="py-5">
                <Container>
                    <p className="subtitle text-primary">
                        Auction an item
                    </p>
                    <h1 className="h2 mb-5">
                        {data[3].title}
                        <span className="text-muted float-right">Step 3</span>
                    </h1>
                    <ListingForm
                        data={data[3]}
                        prevStep="step-2"
                        finish="step-4"
                    />
                </Container>
            </section>
        </React.Fragment>
    )
}

export default NewAuction3