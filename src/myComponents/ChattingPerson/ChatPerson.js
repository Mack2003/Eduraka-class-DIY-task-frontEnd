import React, { useEffect, useState } from 'react';
import './ChatPerson.css';
import serverURL from './../../weburl';

export default function ChatPerson(props) {

    const userImage = `${serverURL}/profileimage/${props.id}`

    const [chatINFO, setChatINFO] = useState(undefined);
    useEffect(() => {
        setChatINFO(props.pendingMSG);
    }, [props]);

    return (
        <li onClick={() => {
            if (props.pendingMSG?.isActive !== true) {
                props.hendelClick(props.name, props.id)
            }
            props.handelIsChatOnCOPY();
            document.querySelector('.chat-list').style.zIndex = '2';
            document.querySelector('.chat-details').style.zIndex = '3';
        }}>
            <div className='img'>
                <img className='img-fluid' src={userImage} alt="Not found" />
            </div>
            <div>
                <div className='name'>{props.name}</div>
                <div>current massage</div>
            </div>
            {chatINFO?.isRead === false ? <span className='massageCount'>{chatINFO?.unseenMSG.length}</span> : ''}
        </li>

    )
}


//Must include these propertis and state variables when using this components

//A data handler function that will recive data sent from child as a property name => "hendelClick"

//A property name => "name" with the value need to be sent from parent
//A property name => "userName" with the value need to be sent from parent
//A property name => "image" with the value need to be sent from parent



