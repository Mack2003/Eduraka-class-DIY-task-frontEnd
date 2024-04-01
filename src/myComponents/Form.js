import React, { useState } from 'react'

export default function Form(props) {

    const [eye, setEye] = useState({ type: 'password', isClick: false })
    const toggelEye = () => {
        if (eye.isClick === false) return setEye({ type: 'text', isClick: true })
        setEye({ type: 'password', isClick: false })
    }

    let [name, setName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [userName, setUserName] = useState('')


    const upload = async (e) => {
        e.preventDefault()
        if (props.type === 'log In') {

            if (isNaN(userName) && isNaN(password)) {
                let data = await fetch(`http://localhost:4000/users?userName=${userName}`).then(data => data.json())
                if (data.Status === false) {
                    alert(data.data)
                } else {
                    if(data.data.password === password) {
                        props.showName(data.data)
                        setName('')
                        setEmail('')
                        setUserName('')
                        setPassword('')
                        props.clear()
                    }else{
                        alert("kindly enter a correct password")
                    }
                }
            } else {
                alert("Fill all the inputs")
            }
        } else {

            if (isNaN(name) && isNaN(password) && isNaN(email)) {
                props.clear()

                let user = {
                    name: name,
                    email: email,
                    password: password
                }
                let responce = await fetch('http://localhost:4000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                }).then(data => data.json())

                if (responce.Status === false) {
                    alert(`Must notice: \n This ${Object.values(responce.data.keyValue)[0]} ${Object.keys(responce.data.keyValue)[0]} is already in use try with diffrent entry`)
                    return
                }


            } else {
                alert("Fill all the inputs")
            }
        }


    }
    return (
        <form id='form' style={{width:'40%', margin: '5% 30%', position:'fixed', backgroundColor: 'white', padding:'10px', boxShadow:'3px 3px 4px 5px rgb(23, 23, 23,.5)', borderRadius:'5px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}><h1 align="center">{props.type}</h1><i onClick={props.dropFormT} className="bi bi-x-lg"></i></div>
            {props.type === "log In" ? '' :
                <div className="mb-3">
                    <label htmlFor="Your_name" className="form-label">Your name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="form-control" id="Your_name" />
                </div>}
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">{props.type === 'log In' ? "User name" : 'Email address'}</label>
                <input onChange={(e) => props.type === 'log In' ? setUserName(e.target.value) : setEmail(e.target.value)} value={props.type === 'log In' ? userName : email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <div className="input-group mb-3">
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type={`${eye.type}`} className="form-control" placeholder="Your password" aria-label="Recipient's username" aria-describedby="button-addon2" />
                    <button onClick={toggelEye} className="btn btn-outline-secondary" type="button" id="button-addon2"><i className="bi bi-eye-fill"></i></button>
                </div>
            </div>
            <button onClick={upload} type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}
