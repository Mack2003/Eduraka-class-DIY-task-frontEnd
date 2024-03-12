import React, { useEffect, useState } from 'react'
import './Filter.css'
import { useNavigate } from 'react-router-dom'

export default function Filter() {
    const naviget = useNavigate()

    const [locationList, setLocationList] = useState(null)// To store available locations 
    const [resturentList, setResturentList] = useState(null) // Store all resturents with filter or with no filter
    const [location, setLocation] = useState('') // To have the selected value
    const [Cusine, setCusine] = useState(undefined) // To store selected cusine values in an array
    const [costMax_Min, setCostMax_Min] = useState(undefined) // To store selected any of one from minimum to maximum filter section
    const [sortHigh_Low, setsortHigh_Low] = useState(undefined) // To store selected any of one from high to low or low to high filter section
    const [cuisineSelectionElement, setcuisineSelectionElement] = useState(undefined) // To store elements with class name 'cuisine' in filter section
    const [totelItem, setTotelItem] = useState(0) // Total number of restaturents recived from server
    const [pageArray, setPageArray] = useState([]) // Store pages for result
    const [pagenumber, setPagenumber] = useState(1) // clicked page number 

    useEffect(() => {
        APILocationFunction()
        setcuisineSelectionElement(document.querySelectorAll('.cuisine'))
    }, [])

    useEffect(()=>{
        async function callAPIFilter() {
            try {
                let filterResponce = await fetch(`http://localhost:2000/resturents/filter?skip=${pagenumber}&location=${location}&cusine=${Cusine}&costMax_Min=${JSON.stringify(costMax_Min)}&sortHigh_Low=${sortHigh_Low}`).then(data => data.json());
                setResturentList(filterResponce.data.restaturentData)
                setTotelItem(filterResponce.data?.totalItem)
            } catch (error) {
                alert('There is an error when connecting to the server '+`${error}`)
            }  
        }
        callAPIFilter()
        pageNumb()
    }, [location, Cusine, costMax_Min, sortHigh_Low, pagenumber])

    cuisineSelectionElement?.forEach(element => {
        if (!element.dataset.listenerAttached) {
            element.dataset.listenerAttached=true;
            element.addEventListener('click', ()=>{
                if (element.checked) {
                   setCusine(preValue => preValue?[...preValue, element.value]:[element.value])
                } else {
                    setCusine(preValue => preValue?.filter(item => item!==element.value))
                }
            })
        }
    });

   
    //Fatching locations....

    const APILocationFunction = async () => {
        try {
            let locationList = await fetch(`http://localhost:2000/location`).then(data => data.json()).catch(err => alert(`Some Error occourd in calling API ${err}`))
            if (locationList.status === true) {
                setLocationList(locationList.data)
            } else {
                alert(locationList.data)
            }
        } catch (error) {
            alert(`${error}`)
        }
    }


    const pageNumb = () => {
        let pages = totelItem/10
        if (!Number.isInteger(pages)) {
            pages = Math.floor(pages)
            pages+=1
        }
        setPageArray([])
        for (let i = 0; i < pages; i++) {
            setPageArray(preValue => preValue? [...preValue, i+1]:[1])
        }
    }

    const handelOnclickPageButton = (pageNum) => {
        setPagenumber(pageNum)
    }

    return (
        <>
            <section className='row'>
                <article style={{ padding: '5rem 1rem 1rem 2rem' }} className='col-sm-12 col-md-4'>
                    <h4>Filters</h4>
                    <div className="location">
                        <p>Select Location</p>
                        <input onChange={e => setLocation(e.target.value)} className="input_box" type="text" list="input_location" placeholder="Select Your City" />
                        <datalist id="input_location">
                            {locationList?.map((item, index) => {
                                return <option key={index} value={item}>{item}</option>
                            })}
                        </datalist>
                    </div>
                    <div className="check_box">
                        <h4>Cusine</h4>
                        <span className="food_type">
                            <input value={'NorthIndian'} className='cuisine' type="checkbox" />
                            <label htmlFor="cuisine">North Indian</label>
                        </span>
                        <span className="food_type">
                            <input value={'SouthIndian'} className='cuisine' type="checkbox" />
                            <label htmlFor="cuisine">South Indian</label>
                        </span>
                        <span className="food_type">
                            <input value={'Chinese'} className='cuisine' type="checkbox" />
                            <label htmlFor="cuisine">Chinese</label>
                        </span>
                        <span className="food_type">
                            <input value={'FastFood'} className='cuisine' type="checkbox" />
                            <label htmlFor="cuisine">Fast Food</label>
                        </span>
                        <span className="food_type">
                            <input value={'StreetFood'} className='cuisine' type="checkbox" />
                            <label htmlFor="cuisine">Street Food</label>
                        </span>
                    </div>
                    <div className="price">
                        <h4>Cost</h4>
                        <span className="price_type">
                            <input onClick={()=> setCostMax_Min({min:0, max: 500})} type="radio" name="price_range" />
                            <label htmlFor="price">Less then $500</label>
                        </span>
                        <span className="price_type">
                            <input onClick={()=> setCostMax_Min({min:500, max: 1000})} type="radio" name="price_range" />
                            <label htmlFor="price">$500-1000</label>
                        </span> <span className="price_type">
                            <input onClick={()=> setCostMax_Min({min:1000, max: 1500})} type="radio" name="price_range" />
                            <label htmlFor="price">$1000-1500</label>
                        </span> <span className="price_type">
                            <input onClick={()=> setCostMax_Min({min:1500, max: 2000})} type="radio" name="price_range" />
                            <label htmlFor="price">$1500-2000</label>
                        </span> <span className="price_type">
                            <input onClick={()=> setCostMax_Min({min:2000, max: 10000})} type="radio" name="price_range" />
                            <label htmlFor="price">More then $2000</label>
                        </span>
                    </div>
                    <div className="sort">
                        <h4>Sort</h4>
                        <span className="price_type">
                            <input onClick={()=> setsortHigh_Low(1)} className='range-type' type="radio" name="price_range" />
                            <label className='range-type' htmlFor="price">Price low to high</label>
                        </span>
                        <span className="price_type">
                            <input onClick={()=> setsortHigh_Low(-1)} type="radio" name="price_range" />
                            <label htmlFor="price">Price high to low</label>
                        </span>
                    </div>
                </article>
                <article style={{ padding: '5rem 0 0 0', height: '100vh' }} className='col-sm-12 col-md-8'>
                    <div style={{ gap: '1rem', overflowY: 'scroll', height: '80vh', padding:'1rem' }} className='row product-con'>
                        {resturentList?.map((item, index) => {
                            return (
                                <div onClick={()=>naviget(`/details/${item._id}`)} style={{ padding: '1rem', boxShadow: '0 0 20px 0 grey', cursor: 'pointer' }} key={index}>
                                    <img className="img-fluid" style={{ borderRadius: '1rem' }} src={item.thumbnail} alt="Not found" />
                                    <h4>{item.name}</h4>
                                    <h6>Location: {item.city}</h6>
                                </div>
                            )
                        })}
                    </div>
                    <div className='page-nav'>
                        {pageArray?.map((item, index) => {
                            return <span key={index} onClick={() =>handelOnclickPageButton(item)} className="page-nav-number">{item}</span>
                        })}
                        
                        <h6 style={{color:'#0027ff'}}>Total result: {totelItem|0}</h6>
                    </div>
                </article>

            </section>
        </>
    )
}
