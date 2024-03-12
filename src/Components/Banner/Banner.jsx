import React, { useEffect, useState } from 'react'
import './Banner.css'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Ban from './Ban'
import ProductDetails from './../ProductDetails/ProductDetails';
import Modal from 'react-modal'
import GoogleLogin from 'react-google-login';
import Filter from './Filter/Filter';


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

export default function Banner() {

    const [isHomePage, setisHomePage] = useState(false)

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //   subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);

    }

    function handelSucess(params) {
        console.log(params)
    }

    function handelfail(params) {
        console.log(params)
    }
    return (
        <>
            <BrowserRouter>
                <nav style={{ padding: '1rem .5rem', position: 'fixed', width: '100%', display: 'flex', justifyContent: 'space-between', gap: '1rem', backgroundColor: `${isHomePage? 'transparent' : '#7e0000'}`, zIndex: '3' }}>
                    <h3>{isHomePage === true ? '' : <span style={{ padding: '4px 4px', backgroundColor: 'white', borderRadius: '50%', color: 'red' }}>e!</span>}
                        <Link onClick={() => {
                            setisHomePage(true)
                        }} className='links' to={'/'}>Home</Link> &nbsp;
                        <Link to={'/filter'}>Filter</Link>
                    </h3>

                    <div>
                        <button onClick={openModal} style={{ fontWeight: 'bolder', color: 'white', backgroundColor: 'transparent', border: 'none' }}>Log in</button>
                        <button style={{ border: `${isHomePage ? '1px solid red' : '1px solid white'}` }} className='sign-up-button'>Sign up</button>
                    </div>
                </nav>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2>Hello</h2>
                    <button onClick={closeModal}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                    <GoogleLogin
                        clientId="617614281104-v8qeaighl5bl456omrl99il0khijphet.apps.googleusercontent.com"
                        buttonText="Login with google"
                        onSuccess={handelSucess}
                        onFailure={handelfail}
                        cookiePolicy={'single_host_origin'}
                    />
                </Modal>
                <Routes>
                    <Route path='/' element={<Ban isloaded={setisHomePage} />} />Banner
                    <Route exact path='/details/:id' element={<ProductDetails isloaded={setisHomePage} />} />
                    <Route path='/filter' element={<Filter />}/>

                </Routes>

            </BrowserRouter>
        </>
    )
}
