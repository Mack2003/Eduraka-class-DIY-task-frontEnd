import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




export default function ProductDetails(props) {

    const naviget = useNavigate()

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const [modalIsOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);

    }

    const [productData, setproductData] = useState(null)
    const [isData, setisData] = useState(false)
    const [cartItem, setCartItem] = useState(undefined)
    const [cartBar, setCartBar] = useState(false)

    useEffect(() => {
        let id = window.location.href.split('/')
        id = id[id.length - 1]
        apiCall(id)
        props.isloaded(false)
    }, [])

    const apiCall = async (id) => {
        let APIdata;
        try {
            APIdata = await fetch(`http://localhost:2000/resturent/${id}`).then(data => data.json()).catch(err => alert(err.massage))
            if (APIdata.status === true) {
                setproductData(APIdata.data)

                setisData(true)
            } else {
                alert(`${APIdata.data}`)
            }
        } catch (error) {
            alert(`${error}`)
        }
    }

    const handelItemClick = (e) => {
        const clickedItem = e.target.previousElementSibling.innerText;
        let filterArray = cartItem?.includes(clickedItem)
        if (filterArray === filterArray) {
            setCartItem(preValue => preValue ? [...preValue, clickedItem] : [clickedItem])
        }
        if (cartItem?.length > 0) {
            setCartBar(true)
        }
    }

    const removeItemCart = (e) => {
        const itemToRemove = e.target.innerText;
        setCartItem(prevalue => prevalue ? prevalue.filter(item => item !== itemToRemove) : prevalue)
    }

    useEffect(() => {
        if (cartItem?.length < 1) {
            setCartBar(false)
        }
        if (cartItem?.length > 0) {
            setCartBar(true)
        }
    }, [cartItem])


    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:2000/money', { amount:200 });
            const { data } = response;
            console.log(data.id);
            const options = {
                key: 'rzp_test_IG9jeB32X4c02g',
                amount: data.amount,
                currency: 'INR',
                name: 'Your Company Name',
                description: 'Test Payment',
                order_id: data.id,
                handler: function (response) {
                    naviget('/filter')
                },
                prefill: {
                    name: 'Your Name',
                    email: 'your.email@example.com',
                    contact: '8906144923',
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
        }
    };




    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <ul style={{ margin: '0', padding: '0', display: 'flex', gap: '.5rem', flexDirection: 'column' }}>
                    {
                        productData?.cuisine?.map((item, index) => {
                            return (
                                <li style={{ display: 'flex', flexDirection: 'row', width: '50vw', justifyContent: 'space-between' }} key={index}>
                                    <h4>{item?.name}</h4>
                                    {cartItem?.includes(item?.name) ? <span style={{ color: 'green' }}>Item added &#10003;</span> : <button onClick={handelItemClick}>Add</button>}
                                </li>
                            )
                        })
                    }
                </ul>
            </Modal>
            <div style={{ width: '50%', height: '20%', margin: 'auto', paddingTop: '6rem' }} id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {productData?.gallery?.map((data, index) => {
                        if (index === 0) {
                            return (
                                <div key={index} className="carousel-item active">
                                    <img style={{ height: '70vw' }} src={data} className="d-block w-100" alt="Not found" />
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} className="carousel-item">
                                    <img style={{ height: '70vw' }} src={data} className="d-block w-100" alt="Not found" />
                                </div>
                            )
                        }
                    })}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1 style={{ color: '#006bff' }}>{productData?.name || 'Title'}</h1>
                <button onClick={() => setIsOpen(true)} style={{ margin: '0 1rem 0 0', backgroundColor: 'red', color: 'whitesmoke', border: 'none', borderRadius: '1rem', padding: '0 1rem', fontWeight: 'bolder', fontSize: '2vw' }}>Add items to your cart now</button>
            </div>
            <p>by <span style={{ fontWeight: 'bolder' }}>{productData?.city}</span></p>
            <Tabs style={{ margin: '1rem' }}>
                <TabList>
                    <Tab>Details</Tab>
                    <Tab>Discreotion</Tab>
                </TabList>

                <TabPanel>
                    <div>
                        <h1>{productData?.title}</h1>
                        <span>Dining Ratings: <span style={{ fontWeight: 'bolder' }}>{productData?.dining_Ratings}  </span></span> <br />
                        <span>Delivery Ratings: <span style={{ fontWeight: 'bolder' }}>{productData?.delivery_Ratings}</span></span> <br />
                        <span>Contact number: <span style={{ fontWeight: 'bolder' }}>{productData?.contact_Details?.number}</span></span> <br />

                        <span>Locality: <span style={{ fontWeight: 'bolder' }}>{productData?.city}</span></span>

                    </div>
                </TabPanel>
                <TabPanel>
                    <h4>Cuisines: </h4>
                    <div style={{ gap: '1rem', padding: '1rem' }} className='row'>
                        {productData?.cuisines?.map((data, index) => {
                            return (
                                <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} key={index}>
                                    <h4>ID: {index}</h4>
                                    <h4 align='center' style={{ color: 'green' }}>{data?.type}</h4>
                                </div>
                            )
                        })}
                    </div>
                    <h4>Opens:</h4>


                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Sunday </h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.sunday.isopen}</h4>
                    </div>
                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Monday</h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.monday.isopen}</h4>
                    </div>
                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Tuasday</h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.tuasday.isopen}</h4>
                    </div>
                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Wednesday</h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.wednesday.isopen}</h4>
                    </div>
                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Thursday</h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.thursday.isopen}</h4>
                    </div>
                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Friday</h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.friday.isopen}</h4>
                    </div>
                    <div style={{ width: 'max-content', boxShadow: '0 0 10px 4px black', cursor: 'pointer' }} >
                        <h4>Satarday</h4>
                        <h4 align='center' style={{ color: 'green' }}>{productData?.opens?.satarday.isopen}</h4>
                    </div>

                </TabPanel>
            </Tabs>
            {cartBar ? <div style={{ borderRadius: '.5rem', boxShadow: '0 0 3rem .5rem black', color: 'whitesmoke', position: 'fixed', bottom: '0', marginBottom: '1rem', width: '80vw', backgroundColor: 'red', marginLeft: '10vw', display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                <div>
                    {cartItem?.map((item, index) => {
                        return (
                            <>
                                <span onClick={removeItemCart} key={index} style={{ padding: '4px', backgroundColor: '#002353', boxShadow: "#00000073 0px 0px 10px 3px", borderRadius: '.5rem', cursor: 'pointer' }}>{item}</span> &nbsp;
                            </>

                        )
                    })}
                </div>
                <div>
                    <span>Total items: {cartItem?.length}</span> &nbsp; &nbsp;
                    <span>Total Price: {'200'}</span>
                    <div>
                        <button onClick={handlePayment} style={{ float: 'right', margin: '.5rem 0 0 0', border: 'none', fontWeight: 'bolder' }}>Buy Now !!</button>
                    </div>
                </div>
            </div> : ''}
        </>
    )
}
