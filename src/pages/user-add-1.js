import React from 'react'


import { Container } from 'reactstrap'

import ProgressBar from '../components/ProgressBar'
import ListingForm from '../components/ListingForm'
import data from '../data/user-add.json'
export async function getStaticProps() {

    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggedUser: true,
            title: "Add your listing",
            listingForm: true
        },
    }
}

export default () => {
    return (
        <React.Fragment>
            <ProgressBar progress={20} />
            <section className="py-5">
                <Container>
                    <p className="subtitle text-primary">
                        {data[1].subtitle}
                    </p>
                    <h1 className="h2 mb-5">
                        {data[1].title}
                        <span className="text-muted float-right">Step 1</span>
                    </h1>

                    <ListingForm
                        data={data[1]}
                        nextStep="/user-add-2"
                    />


                </Container>
            </section>

        </React.Fragment>
    )
}