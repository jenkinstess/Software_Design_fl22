import React, {useState} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
const db = require('/config/database');


export const getStaticProps = async () => {
  // pulling events data from events-data.js file
  const res = await fetch('http://localhost:3000/api/events')
  const events = await res.json()

  return {
      props: {
          events,
      },
  }
}

export default function Sell({ events }) {
  //iterate through events. parse each event object for its name. 
  // create an array with the naems
  const [createEventError, setCreateEventError] = useState('');
  const [eventDate, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
    // potentially we just need to store this in db? do we want manual entry
    // const [ownerID, setOwnerID] = useState('');

  //const [venmo, setVenmo] = useState ('');

  const handleChange = (e) => {
    setEventName(e.target.value);
    // setDate(e.target.value);
    // setEventDescription(e.target.value);
  };


  function handleSubmit(e) {
      e.preventDefault();
      fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          eventDate,
          eventName,
          
            // ownerID
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.error) {
            setCreateEventError(data.message);
          }
          if (data && data.token) {
            //set cookie
            cookie.set('token', data.token, {expires: 2});
            Router.push('/profile');
          }
        });

  }

  function getEvents(){
    return events.map((event) => {
      return <option value={event.name}>{event.name}</option>;
    });
  }

  return( 
    
    <div>
      <p>Sell Ticket:</p>
      Existing Events: <select value="value" onChange={handleChange}>
        <option value="" />
        {getEvents()}
    </select> 

    <br></br><br></br>
    <form onSubmit={handleSubmit}>
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

        <label htmlFor="eventDescription">
          Event Description
          <input
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            name="eventDescription"
            type="eventDescription"
          />
        </label>

        <br />
  
        <input type="submit" value="Submit" />
        {/* {signupError && <p style={{color: 'red'}}>{signupError}</p>} */}
      </form>
      {setCreateEventError && <p style={{color: 'red'}}>{createEventError}</p>}

    </div>
    

    

    //this will prepopulate the event spot, user still has to enter their own info
  );

}
