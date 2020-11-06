import React from 'react'

import Link from 'next/link'

import {
    Container,
    Row,
    Col,
    Pagination,
    PaginationItem,
    PaginationLink
} from 'reactstrap'

import CardPost from '../components/CardPost'

import data from '../data/blog.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "Blog"
        },
    }
}

const Blog = () => {

    const featuredPost = data.posts[0]

    return (
        <React.Fragment>
            {featuredPost && <section className="position-relative py-6">
                {featuredPost.img && <img src={`/content/${featuredPost.img}`} className="bg-image" alt={featuredPost.title} />}
                <Container>
                    <Row>
                        <Col lg="6">
                            <div className="bg-white rounded-lg shadow p-5">
                                <strong className="text-uppercase text-secondary d-inline-block mb-2 text-sm">
                                    {featuredPost.subtitle}
                                </strong>
                                <h2 className="mb-3">{featuredPost.title}</h2>
                                <p className="text-muted">{featuredPost.content}</p>
                                <Link
                                    href="/blog/[slug]"
                                    as={`/blog/${featuredPost.slug}`}>
                                    <a className="p-0 btn btn-link">
                                        Continue reading <i className="fa fa-long-arrow-alt-right" />
                                    </a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            }
            <section className="py-6">
                <Container>
                    <Row className="mb-5">
                        {data.posts && data.posts.map((post, index) => {
                            // the first post is featured
                            if (index >= 1)
                                return <Col
                                    key={index}
                                    sm="6"
                                    lg="4"
                                    className="mb-4 hover-animate"
                                >
                                    <CardPost data={post} index={index} />
                                </Col>
                        }
                        )}

                    </Row>
                    <Pagination aria-label="Page navigation example" listClassName="d-flex justify-content-between mb-5">
                        <PaginationItem>
                            <PaginationLink href="#" className="page-link text-sm rounded">
                                <i className="fa fa-chevron-left mr-1" />Older posts
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem className="disabled">
                            <PaginationLink href="#" className="page-link text-sm rounded">
                                Newer posts<i className="fa fa-chevron-right ml-1" />
                            </PaginationLink>
                        </PaginationItem>
                    </Pagination>
                </Container>
            </section>
        </React.Fragment>
    )
};

export default Blog;