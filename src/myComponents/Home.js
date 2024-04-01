import React, { useState } from 'react'
import Form from './Form'
import IoContainer from './IoContainer';

export default function Home() {
    let [name, setName] = useState({})
    const dropForm = () => {
        setForm({ logIn: false, clicked: false })
    }
    const showName = (name) => {
        setName(name)
        setForm({ logIn: false, clicked: false })
    }

    let [form, setForm] = useState({ logIn: false, clicked: false })


    const clearForm=()=>{
        setForm({ logIn: false, clicked: false })
    }
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <form style={{ justifyContent: 'space-between' }} className="container-fluid">
                    <div>
                        <button onClick={() => setForm({ logIn: true, clicked: true })} className="btn btn-outline-success me-2" type="button">Log in</button>
                        <button onClick={() => setForm({ logIn: false, clicked: true })} className="btn btn-sm btn-outline-secondary" type="button">Sign in</button>
                    </div>
                    <h2>{name.name}</h2>
                </form>

            </nav>
        
            <IoContainer/>
        </>
    )
}
