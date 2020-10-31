import React from 'react'
import { Container } from 'reactstrap'
import Head from 'next/head'


export async function getStaticProps() {
    return {
      props: {
        hideHeader: true,  
        hideFooter: true,
        noPaddingTop: true,
        title: "Coming soon",
      },
    }
  }

export default () => {
    const social = [
        {
            "icon": "twitter",
            "link": "#"
        },
        {
            "icon": "facebook",
            "link": "#"
        },
        {
            "icon": "instagram",
            "link": "#"
        },
        {
            "icon": "pinterest",
            "link": "#"
        },
        {
            "icon": "vimeo",
            "link": "#"
        }
    ]
    return (
        <div className="mh-full-screen d-flex align-items-center dark-overlay">
            <img
                src="content/img/photo/photo-1490578474895-699cd4e2cf59.jpg"
                alt="Coming Soon"
                className="bg-image"
            />
            <Container className="text-white text-center text-lg overlay-content py-6 py-lg-0">
                <h1 className="text-hide mx-auto mb-6">
                    Coming soon
                    <img src="content/img/coming-soon.png" alt="Coming Soon" className="img-fluid" />
                </h1>
                <h3 className="mb-5 text-shadow">Our directory is coming to you soon.</h3>
                <p className="font-weight-light mb-4">
                    <i className="fas fa-map-marker-alt mr-2" /> Directory Ltd. | 25 Baker St., LB8 E18 London, UK
                </p>
                <ul className="list-inline">
                    {social && social.map(icon =>
                        <li key={icon.icon} className="list-inline-item">
                            <a href={icon.link} target="_blank" title={icon.icon} className="text-white">
                                <i className={`fab fa-${icon.icon}`} />
                            </a>
                        </li>
                    )}
                </ul>
            </Container>
        </div>
           
    )
}