import React, { useEffect, useState } from 'react'
import './Nav.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogPage from '../LogPage/LogPage';
import IoContainer from '../ChattingHome/IoContainer';
import Body from '../Body';
import axios from 'axios';
import Massage from '../Massage/Massage'
import serverURL from './../../weburl';



export default function Nav(props) {

  // To controle massage popup

  const [indicator, setIndicator] = useState(false);
  const [massageText, setMassageText] = useState('');
  const [massageColor, setMassageColor] = useState('');
  const [isChatOn, setIsChatOn] = useState(false);


  //Check if the user successfully logged in or not
  const [userLogged, setUserLogged] = useState(false)

  const [userData, setuserData] = useState('') //user data storeage for user profile info
  const [windowWidth, setWindowWidth] = useState(window.innerWidth) // Window width
  const [userSettingCSS, setuserSettingCSS] = useState({ hidden: true }) // User setting div's dynamic css
  const isLoggedIn = (data) => {
    setUserLogged(data)
  }

  const getUserLoginData = (data) => { // Function to get user data after login
    setuserData(data)
  }


  const windoeResizeHendle = () => { // To perform oparetion task on window resize
    setWindowWidth(window.innerWidth)
  }
  window.onresize = windoeResizeHendle //Calling "windoeResizeHendle" function on window resize to set current window width


  const openSetting = () => {
    setuserSettingCSS({ width: '80vw', transform: 'translate(0, 0)' })
  }

  const handleCrossSetting = () => {
    setuserSettingCSS({ hidden: true })
  }

  const submitImage = async () => {
    let askToConfirmAgreeToReload = window.confirm(`Updating/Uploading your profile image will reload your page.`)
    if (askToConfirmAgreeToReload === true) {
      const profileImageInput = document.getElementById('profile-image')
      profileImageInput.click()
      profileImageInput.addEventListener('change', async () => {

        //-----------------------------------------------------------\\
        //to compare the given file size to the maximum limit set by developer

        const file = profileImageInput.files[0];
        const maxSizeInBytes = 5 * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
          alert('File size exceeds the limit of 5MB.');
          profileImageInput.value = '';
          return;
        }
        //-----------------------------------------------------------\\

        document.getElementById('imageSubmit').click()
      })
    }
  }


  //Funtion to remove profile picture from user account using API post request

  const removeProfilePicture = async () => {
    let confirmToLogOut = window.confirm(`Updating or removing Profile image will log you out are you sure ${userData.name} you want to log out`)

    if (confirmToLogOut === true) {
      try {
        console.log(userData._id)
        let response = await axios.delete(`${serverURL}/profileimage/${userData._id}`)
        if (response.data.status === true) {
          window.location.reload()
        }
      } catch (error) {
        setIndicator(true)
        setMassageColor('red')
        setMassageText(`${error}`)
      }
    }

  }

  // Handeling "add friend" requests to update INFO in server

  const [friendSuggetion, setfriendSuggetion] = useState([]) // To update person list that matches the search

  let allowDebounce = true; // To do debounce 

  const friendSearchHandel = async (e) => {
    if (allowDebounce === true) {
      allowDebounce = false;
      setTimeout(() => {
        allowDebounce = true;
      }, 2000);
      if (e.target.value !== "") {
        try {
          let searchingFrindAPI = await axios.get(`${serverURL}/searchfriend/${e.target.value.toLowerCase()}`)
          setfriendSuggetion(searchingFrindAPI.data.data)
        } catch (error) {
          setIndicator(true)
          setMassageColor('red')
          setMassageText(`${error}`)
        }
      }
    }
  }

  // Handle the click on  friend list button

  const handelAddFriendtClick = async (e) => {
    let frientToAdd = document.getElementById('addFriend').value
    document.getElementById('addFriend').value = ''
    frientToAdd = friendSuggetion.filter(data => {
      if (data.name === frientToAdd) {
        return data
      }
    })
    if (frientToAdd.length != 0) {
      try {

        let addFriendAPI = await axios.put(`${serverURL}/searchfriend/`, {
          frindOf: userData._id,
          friend: frientToAdd[0]
        })

      } catch (error) {
        setIndicator(true)
        setMassageColor('red')
        setMassageText(`${error}`)
      }
    } else {
      setIndicator(true)
      setMassageColor('#1d90ca')
      setMassageText(`No such user exist..`)
    }


  }

  //Handel if user clicked on any chat or not
  const handelIsChatOn = (data)=> {
    setIsChatOn(data);
  };


  return (
    <>
      <Massage text={massageText} color={massageColor} setIfShow={setIndicator} ifShow={indicator} />

      <Router>
        <nav>
          <div style={{display:'flex', placeItems: 'center'}}>{userLogged === true && isChatOn ===true && window.innerWidth<600? <i onClick={() => {
            setIsChatOn(false);
            document.querySelector('.chat-list').style.zIndex = '3';
            document.querySelector('.chat-details').style.zIndex = '2';

          }} style={{fontWeight: 'bolder', fontSize: '1.5rem', cursor:'pointer'}} className="bi bi-chevron-left"></i>:''}<h4 style={{ fontWeight: 'bolder', color: 'white', paddingLeft: '1rem', margin: '0' }}>Web chatt</h4></div>
          {userLogged === true ? <div className="search">
            {windowWidth > 500 ? <><input onChange={friendSearchHandel} style={{ margin: '0' }} placeholder='Search for a new friend' list='addFriendList' type="text" name="addFriend" id="addFriend" />
              <datalist id='addFriendList'>
                {friendSuggetion?.map((data, index) => {
                  console.log(data)
                  return <option key={index} value={data.name}>{data.email}</option>
                })}
              </datalist>
              <i onClick={handelAddFriendtClick} style={{ color: '#00c7ff', fontSize: '1.3rem', cursor: 'pointer' }} className="bi bi-plus-circle"></i></> : ''}
            <i onClick={openSetting} style={{ color: '#00c7ff', fontSize: '1.3rem', cursor: 'pointer' }} className="bi bi-three-dots-vertical"></i>
          </div> : ''}

        </nav>
        <form style={{ display: 'none' }} method='POST' action={`${serverURL}/profileimage`} encType='multipart/form-data'>
          <input accept=".jpg, .jpeg, .png" type="file" name="profile-image" id="profile-image" />
          <input name='id' type="text" value={userData._id} />
          <button id='imageSubmit' type="submit">submit</button>
        </form>
        <div style={{ display: `${userSettingCSS.hidden ? 'none' : 'block'}` }} className='settingContainer'>
          <section style={userSettingCSS} className='userSetting'>
            <h2 style={{ padding: '0 2rem' }} align='right'><span onClick={handleCrossSetting} style={{ cursor: 'pointer' }}>&#x2718;</span></h2>
            <div style={{ background: `url(${userData ? `${serverURL}/profileimage/${userData._id}` : ''})`, backgroundPosition: 'top', backgroundSize: 'auto', backgroundRepeat: 'no-repeat' }} className='userSetting-img'>
              <img style={{ height: `${(windowWidth / 100) * 50}px`, maxHeight: '330px' }} id='profile-image-element' src={userData ? `${serverURL}/profileimage/${userData._id}` : ''} alt="Not found" />
              <i onClick={submitImage} style={{ float: 'right', padding: '1rem', cursor: 'pointer', position: 'fixed', top: '3rem', right: '2rem' }} className="bi bi-pencil-square"></i>
            </div>
            <div style={{ margin: '1rem 0 2rem 0' }} align='center'>
              <h4 align='center'>{userData.name}</h4>
              {windowWidth < 500 ? <div style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.103)' }} className="search">
                <input onChange={friendSearchHandel} style={{ margin: '0' }} placeholder='Search for a new friend' list='addFriendList' type="text" name="addFriend" id="addFriend" />
                <datalist id='addFriendList'>
                  {friendSuggetion?.map((data, index) => {
                    return <option key={index} value={data.name}>{data.email}</option>
                  })}
                </datalist>
                <i style={{ color: '#00c7ff', fontSize: '1.3rem', cursor: 'pointer' }} className="bi bi-plus-circle"></i>
              </div> : ''}
              {userData.profileImage === '' ? '' : <button style={{ margin: '1rem 0 0 0', padding: '.5rem 2rem', }} onClick={removeProfilePicture}>Remove profile picture</button>} <br />
              <button onClick={() => {
                let confirmToLogOut = window.confirm(`Are you sure ${userData.name} you want to log out`)
                if (confirmToLogOut === true) {
                  if (localStorage.getItem('logData')) {
                    localStorage.removeItem('logData')
                    window.location.reload()
                  }
                }
              }} style={{ margin: '1rem 0 0 0', padding: '.5rem 2rem', backgroundColor: '#a7f3ff', color: '#fa4747' }}>Logout</button>
            </div>
          </section>
        </div>
        <Routes>
          <Route exact path='/' element={<LogPage loggedUserdata={getUserLoginData} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/user' element={<IoContainer handelIsChatOn={handelIsChatOn} userData={userData} isLoggedIn={userLogged} />} />
          <Route path='*' element={<Body />} />
        </Routes>
      </Router>
    </>
  )
}
