import React, { useEffect, useState } from 'react'
import './Massage.css'

export default function Massage(props) {

  const [styleObj, setStyleObj]= useState({transform: 'translateX(-400px)', backgroundColor:props.color||'black'})

  useEffect(()=>{

      if (props.ifShow===true) {
        setStyleObj({transform: 'translateX(0px)', backgroundColor:props.color||'black'})
        setTimeout(()=>{
          props.setIfShow(false)
        },3000)
      }else{
        setStyleObj({transform: 'translateX(-400px)', backgroundColor:props.color||'black'})
      }
    }, [props.ifShow])

  return (
    <div style={styleObj} className='massage'>
      <div style={{padding:'10px'}}>{props.text||"this is default"}</div>
      <div style={{height:'5px'}}>
        <div style={{backgroundColor:'green', width:'50%', position:'relative'}} className={props.ifShow===true?'animet':''}></div>
      </div>
    </div>
  )
}



//Must include these propertis and state variables when using this components

    //Massage popup controller 'states'

    // const [indicator, setIndicator]= useState(false)
    // const [massageText, setMassageText]= useState('')
    // const [massageColor, setMassageColor]= useState('')

  //Massage popup controller 'propertis'

    // <Massage text={massageText} color={massageColor} setIfShow={setIndicator} ifShow={indicator}/>

