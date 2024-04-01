import React, { useEffect, useState } from 'react'
import robot from '../robot.png'
import './Body.css'

export default function Body(props) {

  return (
    <>
    <div style={{height:'40vh', display:'grid', placeItems:'center'}}>
    <h1 style={{color:'grey'}}>Page not found</h1>
    <img className='bootImage' style={{width:'50vw'}} src={robot} alt="Not found" />
    <div className='shadow'></div>
    </div>
    </>
  )
}
