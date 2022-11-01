import React, {useState} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
const db = require('/config/database');

// export const getStaticProps = async () => {
//   // pulling events data from events-data.js file
//   const res = await fetch('http://localhost:3000/api/events')
//   const events = await res.json();
//   console.log(events);
//   return {
//       props: {
//           events,
//       },
//   }
// }

export const getStaticProps = async() => {
  const response = await fetch('http://localhost:3000/api/events_buy')
  const data = await response.json()
  return {
    props: {currentEvents: data}
  }
}

const Sell = ({currentEvents}) =>{
  //iterate through events. parse each event object for its name. 
  // create an array with the names
  const [createEventError, setCreateEventError] = useState('');
  const [eventDate, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
    // potentially we just need to store this in db? do we want manual entry
    // const [ownerID, setOwnerID] = useState('');

  //const [venmo, setVenmo] = useState ('');
  
  let json = JSON.stringify(currentEvents)
  /*look back here
  // let result = JSON.parse(currentEvents)
  // let result = JSON.parse(json)
  // let result_json = result.result
  // let usable_result = JSON.parse(result_json)
  // let existingEventNames = result_json.name
    // console.log(usable_result);
    */
// }

  const handleChange = (e) => {
    setEventName(e.target.value);
    // setDate(e.target.value);
    // setEventDescription(e.target.value);
  };


  function handleSubmit(e) {
      e.preventDefault();
      fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          eventName,
          eventDescription,
          ticketPrice
            // ownerID
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.error) {
            setCreateEventError("Success! Selling Ticket");
            setCreateEventError(data.message);
          }
          if (data && data.token) {
            //set cookie
            setCreateEventError("Success! Selling Ticket");
            cookie.set('token', data.token, {expires: 2});
            Router.push('/');
          }
        });
      //post new event to db if it's not already there
      fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            eventDate,
            eventName,
            eventDescription,
              // ownerID
          }),
      })  
      

  }
  
  

  // function getEvents(){
  //   return events.map((event) => {
  //     return <option value={event.name}>{event.name}</option>;
  //   });
  // }

  return( 
    
    <div>
      <br />
      
      <p>Sell Ticket:</p>
      Existing Events: <select value="value" onChange={handleChange}>
        <option value="" />
        {/* {existingEventNames} */}
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
        <label htmlFor="ticketPrice">
          Ticket Price
          <input
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            name="ticketPrice"
            type="ticketPrice"
          />
        </label>

        <br />
  
        <input type="submit" value="Submit" />
      </form>
      {setCreateEventError && <p style={{color: 'red'}}>{createEventError}</p>}

    </div>
    
    
    

    //this will prepopulate the event spot, user still has to enter their own info
  );
  

}
export default Sell;