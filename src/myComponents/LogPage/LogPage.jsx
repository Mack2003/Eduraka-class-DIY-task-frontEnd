import React, { useContext, useEffect, useState } from 'react'
import './LogPage.css'
import img from './login-image.webp'
import backGround from './backGround.webp'
import Massage from '../Massage/Massage'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactLoading from 'react-loading';
import serverURL from './../../weburl';


export default function LogPage(props) {

    const naviget = useNavigate()

    //Check user wants to log in or sign up

    const [isLogIn, setIsLogIn] = useState(false)


    //check if the user is logged in or not using local stroage----

    const checkLocalStroage = async () => {
        if (localStorage.getItem('logData')) {
            await setIsLogIn(false)
            settoAllowMount(preData => preData === true ? false : true)
            let { email, password } = JSON.parse(localStorage.getItem('logData'))
            userLogin(email, password)
        } else {
            setIsLogIn(true)
        }
    }
    const [toAllowMount, settoAllowMount] = useState(true)
    useEffect(() => {
        if (isLogIn === false) {
            document.getElementById('userId').setAttribute('value', email)
            document.getElementById('inPassword').setAttribute('value', password)
        }

    }, [toAllowMount])

    useEffect(() => {
        checkLocalStroage()
    }, [])

    //User log in function

    const userLogin = async (email, password) => {  // **Pass email first and then the password when calling this function**
        document.body.style.overflowY = 'hidden'
        setisLoading(true)

        try {
            let APIdata = await axios.get(`${serverURL}/body?password=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}`)
            setisLoading(false)
            if (APIdata.data.status === true) {
                let data = {
                    email: APIdata.data.data.email,
                    password: APIdata.data.data.password
                }
                localStorage.setItem('logData', JSON.stringify(data))
                naviget('/user', {
                    state: {
                        user: APIdata.data
                    }
                })
                props.isLoggedIn(true)
                props.loggedUserdata(APIdata.data.data)
            } else {
                alert(APIdata.data.data)
            }
        } catch (error) {
            setIndicator(true)
            setMassageColor('red');
            setMassageText(`${error}`)
            setisLoading(false)
        }
    }

    //Handel form submission

    const handelFormSubmit = async (e) => {
        e.preventDefault()
        if (isLogIn === false) {
            if (inPassword && userID) { // Checking if inputs are given values or not
                userLogin(userID, inPassword)
                return;
            }
            alert("Plese fill all the inputs")
        } else {
            setisLoading(true)
            if (name && email && area && password && age) {
                let creatUserAPIdata

                try {
                    creatUserAPIdata = await axios.post(`${serverURL}/body`, { //Meaking a post request to register a new user
                        name: name,
                        email: email,
                        area: area,
                        password: rePasswordVar,
                        age: age,
                    })
    
                    setisLoading(false)
    
                    if (creatUserAPIdata.data.status === true) {
                        let dataForLocalStroage = { email: creatUserAPIdata.data.data.email, password: creatUserAPIdata.data.data.password }
                        localStorage.setItem('logData', JSON.stringify(dataForLocalStroage))
                        setIsLogIn(false)
                        checkLocalStroage()
                    } else {
                        setIndicator(true)
                        setMassageColor('orange')
                        setMassageText(`${creatUserAPIdata.data.data}`)
                    }
    
                } catch (error) {
                    setIndicator(true)
                    setMassageColor('red')
                    setMassageText(`${error}`)
                    setisLoading(false)
                }
            } else {
                setIndicator(true)
                setMassageColor('lightblue');
                setMassageText(`Please fill all the fild to proceed....`)
                setisLoading(false)
            }
        }
    }


    const [password, setPassword] = useState(true); //For toggeling visiblity of password

    const [isLoading, setisLoading] = useState(false) //To controll loading annimation


    //Form data validation variables

    const [nameValid, setnameValid] = useState(true)
    const [ageValid, setageValid] = useState(true)
    const [emailValid, setEmailValid] = useState(true)
    const [areaValid, setAreaValid] = useState(true)
    const [passwordValid, setPasswordValid] = useState(true)
    const [rePasswordValid, setRePasswordValid] = useState(true)

    //Form validation function

    const validForm = (e) => {
        switch (e.target.id) {
            case 'name':
                const regexName = /^[A-Za-z\s]+$/;
                setnameValid(regexName.test(e.target.value))
                setName(e.target.value)
                break;

            case 'email':
                const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailValid(regexEmail.test(e.target.value))
                setEmail(e.target.value)
                break;

            case 'age':
                if (parseInt(e.target.value) > 12) {
                    setageValid(true)
                    setAge(parseInt(e.target.value))
                } else {
                    setageValid(false)
                }
                break;

            case 'areaName':
                const regexArea = /^[a-zA-Z]+$/;
                setAreaValid(regexArea.test(e.target.value))
                setArea(e.target.value)
                break;

            case 'password':
                const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,10}$/;
                setPasswordValid(regexPassword.test(e.target.value))
                setPasswordVar(e.target.value)
                break;

            case 'rePassword':
                if (e.target.value === passwordVar) {
                    setRePasswordValid(true)
                    setRePasswordVar(e.target.value)
                } else {
                    setRePasswordValid(false)
                    setRePasswordVar(e.target.value)
                }
                break;
            default:
                break;
        }

    }

    //Form data stroage

    //For log in
    const [inPassword, setInPassword] = useState();
    const [userID, setUserID] = useState('')
    //For sign up
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [area, setArea] = useState('')
    const [age, setAge] = useState('')
    const [passwordVar, setPasswordVar] = useState('')
    const [rePasswordVar, setRePasswordVar] = useState('')

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)// Window width state

    //Massage popup controller
    const [indicator, setIndicator] = useState(false)
    const [massageText, setMassageText] = useState('')
    const [massageColor, setMassageColor] = useState('')


    //Hendling changes on window resize

    const handelSchreenResize = () => {
        setWindowWidth(window.innerWidth)
    }
    window.onresize = handelSchreenResize


    return (
        <>
            <Massage text={massageText} color={massageColor} setIfShow={setIndicator} ifShow={indicator} />
            {isLoading === true ? <div style={{ position: 'fixed', height: '100vh', width: '100vw', zIndex: '6', paddingTop: '20vh', textAlign: 'center', paddingLeft: '40%' }}>
                <ReactLoading type={'spinningBubbles'} color={'#009688'} height={'20%'} width={'20%'} />
            </div> : ''}

            <div id='loginPage' className="main">
                <div className="graphic">
                    <img style={{ width: `${(windowWidth / 100) * 50}px`, height: `${(windowWidth / 100) * 50}px` }} className='background' src={backGround} alt="Not found" />
                    <img style={{ width: `${(windowWidth / 100) * 50}px`, height: `${(windowWidth / 100) * 50}px` }} className='logImg' src={img} alt="Not found" />
                </div>
                <div className="logdiv">
                    <h1 align="center">{isLogIn === true ? 'Sign up' : 'Log in'}</h1>
                    <form id='userForm'>
                        {isLogIn === true ? <div style={{ margin: 'auto' }} align='left'>
                            <div>
                                <input style={{ borderBottomColor: `${nameValid === true ? 'black' : 'red'}` }} onChange={(e) => { validForm(e) }} type="text" name="name" id="name" placeholder='Enter your name' required autoFocus />
                                {nameValid === true ? '' : <span style={{ color: 'red', display: 'block' }}>Please provide a valid name</span>}
                            </div>
                            <div>
                                <input style={{ borderBottomColor: `${emailValid === true ? 'black' : 'red'}` }} onChange={(e) => { validForm(e) }} type="email" name="email" id="email" placeholder=' Enter your email' required />
                                {emailValid === true ? '' : <span style={{ color: 'red', display: 'block' }}>Please provide a valid email</span>}
                            </div>
                            <div>
                                <input style={{ borderBottomColor: `${ageValid === true ? 'black' : 'red'}` }} onChange={(e) => { validForm(e) }} type="number" name="age" id="age" placeholder='Enter your age' required />
                                {ageValid === true ? '' : <span style={{ color: 'red', display: 'block' }}>Please provide a valid age (more then 12)</span>}

                            </div>
                            <div>
                                <input style={{ borderBottomColor: `${areaValid === true ? 'black' : 'red'}` }} onChange={(e) => validForm(e)} type="text" name="areaName" id="areaName" placeholder='Enter your area name' required />
                                {areaValid === true ? '' : <span style={{ color: 'red', display: 'block' }}>Please provide a valid area name</span>}
                            </div>
                            <div>
                                <div style={{ borderBottomColor: `${passwordValid === true ? 'black' : 'red'}` }} className="eye"><input onChange={(e) => validForm(e)} type={password === true ? "password" : 'text'} name="password" id="password" placeholder='Enter your password' required /><span onClick={() => { setPassword((pre) => pre === true ? false : true) }} className='eyeSpan'>{password === true ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}</span></div>
                                {passwordValid === true ? '' : <span style={{ color: 'red', display: 'block' }}>Please provide a password that will have 1 upper case, 1 lower case, 1 spacial cherector and 1 number</span>}
                            </div>
                            <div>
                                <input style={{ borderBottomColor: `${rePasswordValid === true ? 'black' : 'red'}` }} onChange={(e) => validForm(e)} type='password' name="rePassword" id="rePassword" placeholder='Re Enter your password' required />
                                {rePasswordValid === true ? '' : <span style={{ color: 'red', display: 'block' }}>Is not same as given above</span>}
                            </div>
                        </div> : <div style={{ margin: 'auto' }} align='left'>
                            <div>
                                <input onChange={(e) => setUserID(e.target.value)} value={userID} type="email" name="name" id="userId" placeholder='Enter your email' required autoFocus />
                            </div>
                            <div>
                                <div className="eye"><input onChange={(e) => setInPassword(e.target.value)} value={inPassword} type={password === true ? "password" : 'text'} name="password" id="inPassword" placeholder='Enter your password' required /><span onClick={() => { setPassword((pre) => pre === true ? false : true) }} className='eyeSpan'>{password === true ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}</span></div>
                            </div>
                        </div>}
                        <button onClick={handelFormSubmit} type="submit">{isLogIn === true ? 'Sign up' : 'Log in'}</button>
                    </form>
                    <h6 align='center'>{isLogIn === true ? <button onClick={() => { setIsLogIn(false); document.getElementById('userForm').reset() }} className='formSwitch'>Alredy have an account? click here to sign in</button> : <button onClick={() => { setIsLogIn(true); document.getElementById('userForm').reset() }} className='formSwitch'>Don't have any account? click here to sign up</button>}</h6>
                </div>
            </div>
        </>
    )
}
