import React from 'react'

import {
    Card
} from 'reactstrap'

const CardTestimonial = props => {
    const data = props.data
    return (
        <Card className="testimonial rounded-lg shadow border-0">
            <div className="testimonial-avatar">
                <img src={`/content/${data.avatar}`} alt={data.title} className="img-fluid" />
            </div>
            <div className="text">
                <div className="testimonial-quote">
                    <i className="fas fa-quote-right" />
                </div>
                <p className="testimonial-text">
                    {data.content}
                </p>
                <strong>{data.title}</strong>
            </div>
        </Card>
    )
};

export default CardTestimonial;