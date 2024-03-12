import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MealType from './../MealType';

export default function Ban({ isloaded }) {

    const naviget = useNavigate()
    const [restaturentList, setrestaturentList] = useState(null)
    const [locationList, setLocationList] = useState(null)// To store available locations 
    const [callAPIOnChangeLocation, setCallAPIOnChangeLocation] = useState(false)
    useEffect(() => {
        const locationValue = document.getElementById('searchType').value
        if (locationValue) {
            APIcallingFunction(locationValue)
        }
        APIcallingFunction()
        MealTypeAPIcall()
        APILocationFunction()
    }, [callAPIOnChangeLocation])

    useEffect(()=>{
        isloaded(false)

        APILocationFunction()
    }, [])


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

    const APIcallingFunction = async (location='kolkata') => {
        try {
            let resturentList = await fetch(`http://localhost:2000/resturents?location=${location}`).then(data => data.json()).catch(err => alert(`Some Error occourd in calling API ${err}`))
            if (resturentList.status === true) {
                setrestaturentList(resturentList.data)
            } else {
                alert(restaturentList.data)
            }
        } catch (error) {
            console.log("object")
            alert(`${error}`)
        }
    }

    const routeToProduct = () => {
        const value = document.getElementById('list').value
        let selectedRestutarent = restaturentList.filter(data => {
            if (data.name === value) {
                return data.id
            }
        })
        console.log(selectedRestutarent[0].id)
        naviget(`/details/${selectedRestutarent[0].id}`)
    }


    const [mealType, setMealType] = useState([])

    const MealTypeAPIcall = async () => {
        try {
            let data = await fetch('http://localhost:2000/mealtype').then(data => data.json()).catch(err => alert(`An Error occoured: ${err}`))
            if (data.status === false) {
                alert(data.data)
            } else {
                setMealType(data.data)
            }
        } catch (error) {
            alert(`Error : ${error}`)
        }
    }

    return (
        <>
            <section style={{ paddingTop: '6rem', paddingBottom: '1rem' }} className='banner'>
                <h1 style={{ margin: '2rem 0' }} align='center'><span style={{ padding: '20px 20px', backgroundColor: 'white', borderRadius: '50%', color: 'red' }}>e!</span></h1>
                <h1 align='center' style={{ color: 'white' }}>Find best resturants, cafes, bars</h1>
                <div className="serach-section container-fluid">
                    <div className="row">
                        <div onChange={() => setCallAPIOnChangeLocation(pre => pre === true ? false : true)} className='col-sm-12 col-md-6 col-lg-6 col-xl-6 searchType'>
                            <select name="searchType" id="searchType">
                                {locationList?.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })}
                            </select>
                        </div>
                        <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6 search'>
                            <select onChange={routeToProduct} placeholder='Please enter resturant name' id='list'>
                                {restaturentList?.map((data, index) => {
                                    return <option key={index} value={data.name}>{data.name}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </section>
            <section style={{ gap: '1rem', justifyContent: 'space-between' }} className='row container'>
                {mealType?.map((data, index) => {
                    return <MealType key={index} image={data.image} content={data.content} title={data.name} />
                })}
            </section>
        </>
    )
}
