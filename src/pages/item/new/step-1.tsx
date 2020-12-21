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
            title: "Auction an item - Step 1",
            listingForm: true
        },
    }
}

const NewAuction1 = () => {
    return (
        <React.Fragment>
            <ProgressBar progress={20} />
            <section className="py-5">
                <Container>
                    <p className="subtitle text-primary">
                        Auction an item
                    </p>
                    <h1 className="h2 mb-5">
                        {data[1].title}
                        <span className="text-muted float-right">Step 1</span>
                    </h1>
                    <ListingForm data={data[1]} nextStep="step-2" />
                </Container>
            </section>
        </React.Fragment>
    )
}

export default NewAuction1