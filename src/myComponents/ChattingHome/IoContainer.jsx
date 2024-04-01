import React, { useEffect, useState } from 'react'
import chat from './chat.png'
import './IoContainer.css'
import ChatPerson from '../ChattingPerson/ChatPerson';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import sokit from './../Sokit';
import popSound from './popSound.mp3'
import serverURL from './../../weburl';

export default function IoContainer({ isLoggedIn, userData, handelIsChatOn }) {


    const naviget = useNavigate()
    const location = useLocation()
    const yourData = location.state?.user;
    useEffect(() => {
        if (isLoggedIn !== true) {
            naviget('/')
        }
    }, [isLoggedIn])


    const [isMassaging, setIsMassaging] = useState(false)

    const [imojis, setImojis] = useState(undefined); // Store all imogis came from API
    const [sortedImoji, setSortedImoji] = useState(undefined) // Store sorted imogis came according to the user search
    const [videoStarted, setVideoStarted] = useState(false) // Check if user requested for video call or not?

    const [isChatOn, setIsChatOn] = useState({ clicked: false }) // To check if any chat is active or not

    //Chat person data handling function (to recive data sent from <ChatPerson/> child)

    const handleChildData = async (userName, userid) => {
        // await axios.get('...', {}).then(data => data)
        setIsChatOn({ clicked: true, userName, userid })
        let tempData = friendsChatData?.map(item => {
            if (item.id === userid) {
                item.isActive = true;
                return item
            } else {
                item.isActive = false;
                return item;
            }
        });
        handelIsChatOn(true)
        setFriendsChatData(tempData)
    };

    //----------------Chat massage handling----------------------\\

    //Chat massage storing variable
    const [massageFromSokit, setMassageFromSokit] = useState(undefined);

    useEffect(() => {

        //Listning to incoming massages
        sokit.on(userData._id, massage => {
            setMassageFromSokit(massage);
            document.getElementById('massageSound').play()
        });

    }, [sokit]);

    //Sending massages
    function sendMassage() {
        let text = document.getElementById('massageArea');
        sokit.emit('sendMassage', {
            massage: text.value,
            from: userData._id,
            to: isChatOn?.userid,
        });
        massageCame(text.value, 'right');
        saveMassage('right', text.value, `${userData._id}to${isChatOn?.userid}`)
        document.getElementById('massageArea').value = '';
    }

    const massageCame = (massage, side) => {
        let massageContainer = document.getElementById('masseges');
        let massageElement = document.createElement('div');
        massageElement.style.display = 'flex';
        let spanElement = document.createElement('span');
        //checking who send the massage
        if (side === 'right') {
            massageElement.style.justifyContent = "flex-end";
            spanElement.style.backgroundColor = "#66e0fe";
        } else {
            spanElement.style.backgroundColor = "white";
        }

        spanElement.style.padding = ".5rem";
        spanElement.style.margin = ".4rem";
        spanElement.style.borderRadius = '5px';
        spanElement.innerText = massage;
        massageElement.appendChild(spanElement);
        massageContainer.appendChild(massageElement);
        massageContainer.scrollTop = massageContainer.scrollHeight;
    };


    //--------------------------------------------------------------\\

    //-------------------Manage frinds massages---------------------\\

    const [friendsChatData, setFriendsChatData] = useState([]);
    //Allocating stroage for friends massage
    useEffect(() => {
        let chatMSG_OBJ = userData?.friendList?.map(item => {
            return {
                id: item.id,
                pendingMSG: [],
                isActive: false,
                isRead: true,
                unseenMSG: [],
            }
        })
        setFriendsChatData(chatMSG_OBJ);
    }, [sokit]);

    //Set massages came from sokit server

    useEffect(() => {

        let tampData = friendsChatData;
        tampData = tampData.map(item => {
            if (item.id === massageFromSokit?.from) {
                item.pendingMSG.push(massageFromSokit.massage);
                item.unseenMSG.push(massageFromSokit.massage);
                item.isRead = false;
                return item;
            } else {
                return item;
            };
        });
        if (massageFromSokit) {
            saveMassage('left', massageFromSokit.massage, `${userData._id}to${massageFromSokit.from}`);
        }
    }, [massageFromSokit]);

    //API call to load old massages

    const oldMassageLoad = async (activeChatID) => {
        let massages = await axios.get(`${serverURL}/chatMassage/${userData._id}to${activeChatID}`);
        massages = massages.data;
        return massages;
    };

    useEffect(() => {
        friendsChatData?.map(async (itemOBJ) => {
            if (itemOBJ.isActive === true) {
                if (itemOBJ.isRead === false) {
                    for (let i = 0; i < itemOBJ.unseenMSG.length; i++) {
                        massageCame(itemOBJ.unseenMSG.shift(), 'left');
                    };
                    itemOBJ.isRead = true;
                } else {
                    document.getElementById('masseges').innerHTML = '';
                    let oldMassages = await oldMassageLoad(itemOBJ.id)
                    oldMassages.map(item => {
                        massageCame(item.massage, item.side);
                    });
                };

            };
        });


    }, [friendsChatData, massageFromSokit]);

    //--------------------------------------------------------------\\

    //--------------upload massages to data base--------------------\\

    const saveMassage = (side, massage, MSG_RoomeName) => {
        sokit.emit('saveMSG', { massage, MSG_RoomeName, side });
    };

    //--------------------------------------------------------------\\


    useEffect(() => {
        if (isChatOn?.clicked === true) {
            document.querySelector('.chat-list').style.zIndex = '2';
            document.querySelector('.chat-details').style.zIndex = '3';
        }
    }, [isChatOn]);

    const handelIsChatOnCOPY = () => {
        handelIsChatOn(true)
    };

    // API call to store all imojis
    useEffect(() => {
        (async() => {
            try {
                let imojiData = await axios.get("https://emoji-api.com/emojis?access_key=0b3c7c5102e243a3e125eff80456a33e5ecd9f60");
                imojiData = imojiData.data;
                setImojis(imojiData)
                setSortedImoji(imojiData)
            } catch (error) {
                alert(`Error while trying to get your imojis ready: ${error}`);
            };
        })();
    }, []);

    
    //Function to popup imoji list
    const getImoji = () => {
        let imojiContainer = document.querySelector('.imojiSectionList')
        imojiContainer.classList.toggle('imojiSectionList-afterClick')
    };


    //Handel Imoji Search on user input
    const handelImojiSearch = (e) => {
        setSortedImoji(imojis.filter(item => {
            if(item.slug.includes(e.target.value.toLowerCase())){
                return item;
            };
        }));
    };

    //Add imogi in massage input fild when userclicks on any imoji
    const addImojiTOInput = (e) => {
        const massageTextInputElement = document.querySelector("#massageArea")
        massageTextInputElement.value = massageTextInputElement.value + e.target.innerHTML;
    };

    return (
        <>

            <audio controls id='massageSound' style={{ display: 'none' }} src={popSound}></audio>
            <div className='body'>
                <div className='chat-list'>
                    <ul>
                        {
                            userData.friendList?.map((data, index) => {
                                return <ChatPerson
                                    key={index} hendelClick={handleChildData}
                                    image={data.profileImage}
                                    id={data?.id}
                                    name={data?.name}
                                    pendingMSG={friendsChatData?.find(item => item.id === data.id)}
                                    handelIsChatOnCOPY={handelIsChatOnCOPY}
                                />
                            })
                        }

                    </ul>
                </div>
                <div className='chat-details'>
                    {isChatOn.clicked === true ? <div className='current-chat-hadder  p-2'>
                        <div className='current-chat-hadder-profile-details fw-bolder text-light'>
                            {isChatOn.userName}
                        </div>
                        <div className="calling">
                            <i style={{ cursor: 'pointer' }} className="bi bi-telephone-fill"></i>
                            <i onClick={() => setVideoStarted(prevalue => prevalue === false ? true : false)} style={{ marginLeft: '1rem', cursor: 'pointer' }} className="bi bi-camera-video-fill"></i>
                        </div>
                    </div> : ''}
                    <div id='masseges' className='masseges'>
                        {isChatOn.clicked === false ? <div id='image'>
                            <img style={{ width: '200px' }} src={chat} />
                            <p><b>Start a chat</b></p>
                        </div> : ''}
                    </div>
                    {isChatOn.clicked === true ? <div className='textFild'>
                        <div className='typing'>
                            <div className="imojiSection">
                                <div onMouseLeave={getImoji} className="imojiSectionList">
                                    <input onChange={handelImojiSearch} style={{border: '1px solid grey', borderRadius: '.5rem', position:'sticky', top: '0', zIndex:'1', backgroundColor: 'whitesmoke'}} type="text" id="imojiSearch" placeholder='search imoji'/>
                                    <ul className='imojilist'>
                                        {sortedImoji?.map((item, index) => {
                                            return (
                                                <li key={index} onClick={addImojiTOInput} >
                                                    {item.character}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <i onClick={getImoji} className="bi bi-emoji-heart-eyes"></i>
                            </div>
                            <input type='text' onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (e.target.value) {
                                        let rawInput = e.target.value.split('');
                                        rawInput = rawInput.filter(item => item !== '/n');
                                        sendMassage();
                                        e.target.value = ''
                                    }
                                }
                            }} placeholder='Type massage' name="massageArea" id="massageArea" />
                            <i onClick={sendMassage} className="bi bi-send-fill"></i>
                        </div>
                    </div> : ''}
                </div>
            </div>
        </>
    )
}
