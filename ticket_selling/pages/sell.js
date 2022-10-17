import React, {useState} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
import Navbar from '../components/navbar';

const Sell = () => {
    //pick event from drop down
    //or enter ticket information
    const [eventDate, setDate] = useState('');
    const [eventName, setEventName] = useState('');
    const [ownerID, setOwnerID] = useState('');
  
    function handleSubmit(e) {
      e.preventDefault();
      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventDate,
            eventName,
            ownerID
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.error) {
            setSignupError(data.message);
          }
          if (data && data.token) {
            //set cookie
            cookie.set('token', data.token, {expires: 2});
            Router.push('/');
          }
        });
    }
    return (
      <form onSubmit={handleSubmit}>
        <p>Sell Ticket</p>
        <label htmlFor="date">
          Ticket Date
          <input
            value={eventDate}
            onChange={(e) => setDate(e.target.value)}
            name="eventDate"
            type="date"
          />
        </label>
  
        <br />

        <label htmlFor="eventName">
          Event Name
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            name="eventName"
            type="eventName"
          />
        </label>

        <br />

        <label htmlFor="ownerID">
          Owner ID
          <input
            value={ownerID}
            onChange={(e) => setOwnerID(e.target.value)}
            name="ownerID"
            type="ownerID"
          />
        </label>

        <br />
  
        <input type="submit" value="Submit" />
        {/* {signupError && <p style={{color: 'red'}}>{signupError}</p>} */}
      </form>
    );
  };
  
  export default Sell;