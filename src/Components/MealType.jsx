import React from 'react'

export default function MealType({ image, content, title }) {
    return (
        <div className="card mt-3 mb-3" style={{maxWidth:"200px"}}>
            <div className="row g-0">
                <div>
                    <img src={image} className="img-fluid rounded-start" alt="Not found" />
                </div>
                <div>
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
