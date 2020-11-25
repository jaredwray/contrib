import React from 'react'
import Link from 'next/link'
import blog from 'data/blog.json'
import postDummyData from 'data/post.json'
import { Container, Row, Col, Button, Media, Collapse, Form, Input, Label, FormGroup } from 'reactstrap'

export function getAllPostIds() {
    return blog.posts.map(post => ({
        params: {
            slug: post.slug
        }
    }))
}

export function getPostData(slug) {
    for (var i = 0; i < blog.posts.length; i++) {
        if (blog.posts[i].slug == slug) {
            return blog.posts[i]
        }
    }
}

export async function getStaticPaths() {
    return {
        paths: getAllPostIds(),
        fallback: false
    };
}


export async function getStaticProps({ params }) {
    const postData = getPostData(params.slug);
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: postData.title,
            postData
        },
    }
}
export default ({ postData }) => {
    const [formCollapse, setFormCollapse] = React.useState(false)
    return (
        <React.Fragment>
            <section className="hero-home dark-overlay mb-5">
                {postData.img && <img src={`/content/${postData.img}`} className="bg-image" alt={postData.title} />}
                <Container className="py-7">
                    <div className="overlay-content text-center text-white">
                        <h1 className="display-3 text-serif font-weight-bold text-shadow mb-0">
                            {postData.title && postData.title}
                        </h1>
                    </div>
                </Container>
            </section>
            <section>
                <Container>
                    <Row>
                        <Col
                            lg="10"
                            xl="8"
                            className="mx-auto"
                        >
                            <p className="py-3 mb-5 text-muted text-center font-weight-light">
                                {postDummyData.authorLink &&
                                    <Link href={postDummyData.authorLink}>
                                        <a>
                                            <img
                                                src={`/content/img/avatar/${postDummyData.authorAvatar}`}
                                                alt=""
                                                className="avatar mr-2"
                                            />
                                        </a>
                                    </Link>
                                }
                                Written by&nbsp;
                                {postDummyData.authorLink && <Link href={postDummyData.authorLink}>
                                    <a className="font-weight-bold">
                                        {postDummyData.author}
                                    </a>
                                </Link>
                                }
                                <span className="mx-1">|</span> {postDummyData.date && postDummyData.date} in&nbsp;
                                {postDummyData.categoryLink &&
                                    <Link href={postDummyData.categoryLink}>
                                        <a className="font-weight-bold">
                                            {postDummyData.category}
                                        </a>
                                    </Link>
                                }
                                <span className="mx-1">|</span><a href="#" className="text-muted">{postDummyData.comments && postDummyData.comments.length} comments </a>
                            </p>
                            <p className="lead mb-5" dangerouslySetInnerHTML={{ __html: postDummyData.excerpt }} />

                        </Col>
                    </Row>
                    <Row>
                        <Col xl="10" className="mx-auto">
                            <img src="/content/img/photo/photo-1471189641895-16c58a695bcb.jpg" alt="" className="img-fluid mb-5" />
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            xl="8"
                            lg="10"
                            className="mx-auto"
                        >
                            <div className="text-content">
                                <div dangerouslySetInnerHTML={{ __html: postDummyData.content }} />
                                <hr />
                            </div>
                            {postDummyData.comments &&
                                <div className="mt-5">
                                    <h6 className="text-uppercase text-muted mb-4">{postDummyData.comments.length} comments</h6>
                                    {postDummyData.comments.map((comment, index) =>
                                        <Media
                                            key={index}
                                            className="mb-4">
                                            <img src={`/content/img/avatar/${comment.avatar}`} alt={comment.title} className="avatar avatar-lg mr-4" />
                                            <Media body>
                                                <h5>{comment.title}</h5>
                                                <p className="text-uppercase text-sm text-muted"><i className="far fa-clock" /> {comment.date}
                                                </p>
                                                <p className="text-muted">
                                                    {comment.content}
                                                </p>
                                                <p>
                                                    <Button color="link" href="#" className="text-primary">
                                                        <i className="fa fa-reply" /> Reply</Button>
                                                </p>
                                            </Media>
                                        </Media>
                                    )}
                                </div>
                            }
                            <div className="mb-5">
                                <Button
                                    type="button"
                                    aria-expanded={formCollapse}
                                    aria-controls="leaveComment"
                                    color="outline-primary"
                                    onClick={() => setFormCollapse(!formCollapse)}
                                >
                                    Leave a comment
                            </Button>
                                <Collapse id="leaveComment" isOpen={formCollapse} className="mt-4">
                                    <h5 className="mb-4">Leave a comment</h5>
                                    <Form
                                        method="post"
                                    >
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label
                                                        for="name"
                                                        className="form-label"
                                                    >
                                                        Name <span className="required">*</span>
                                                    </Label>
                                                    <Input id="name" type="text" />
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label
                                                        for="email"
                                                        className="form-label"
                                                    >
                                                        Email <span className="required">*</span>
                                                    </Label>
                                                    <Input id="email" type="text" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <FormGroup className="mb-4">
                                            <Label
                                                for="comment"
                                                className="form-label"
                                            >
                                                Comment <span className="required">*</span>
                                            </Label>
                                            <Input id="comment" type="textarea" className="form-control" rows="4" />
                                        </FormGroup>
                                        <Button
                                            type="submit"
                                            color="primary"
                                        >
                                            <i className="far fa-comment" /> Comment
                                        </Button>
                                    </Form>
                                </Collapse>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}