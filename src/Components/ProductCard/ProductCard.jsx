import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ data }) {
    const handelClick = () => {

    }
    return (
        <Link to={`/details/${data.id}`} style={{textDecoration:'none', color:'black', display:'block'}} className='col-sm-12 col-md-6 col-lg-4'>
            <article className=' product-card' onClick={handelClick}>
                <img style={{ maxHeight: '200px' }} src={data.thumbnail} alt="Not found" />
                <h4 style={{ padding: '0 1rem', color: 'white', margin: '0' }}>{data.title}</h4>
                <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Price: <span style={{ fontWeight: 'bolder', color: '#044495' }}>{data.price}</span> <i className="bi bi-currency-rupee"></i></span>
                    <span style={{ padding: '3px', backgroundColor: 'green', display: 'inline-block', fontWeight: 'bolder', color: 'white' }}>{data.rating} <i className="bi bi-bookmark-star"></i></span>
                </div>
            </article>
        </Link>
    )
}
