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
  // {events.map((event) => (
  //   <EventItem event={event} />
  // ))}

  // const EventItem = ({ event }) => {
  //   return (
  //     <div>
  //       <h3>{event.name}</h3>
  //       <h5>{event.date}</h5>
  //     </div>
  //   )
  // }
   
  //iterate through events. parse each event object for its name. 
  // create an array with the naems
  const [eventDate, setDate] = useState('');
  const [eventName, setEventName] = useState('');
    // potentially we just need to store this in db? do we want manual entry
    // const [ownerID, setOwnerID] = useState('');
  const [venmo, setVenmo] = useState ('');

  const handleChange = (e) => {
    setEventName(e.target.value);
    setDate(e.target.value);
  };


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
          venmo
            // ownerID
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

        <label htmlFor="ownerID">
          Owner ID
          <input
            value={venmo}
            onChange={(e) => setOwnerID(e.target.value)}
            name="ownerID"
            type="ownerID"
          />
        </label>

        <br />
  
        <input type="submit" value="Submit" />
        {/* {signupError && <p style={{color: 'red'}}>{signupError}</p>} */}
      </form>

    </div>
    

    

    //this will prepopulate the event spot, user still has to enter their own info
  );

}

// const Sell = () => {
//     const [eventDate, setDate] = useState('');
//     const [eventName, setEventName] = useState('');
//     // potentially we just need to store this in db? do we want manual entry
//     // const [ownerID, setOwnerID] = useState('');
//     const [venmo, setVenmo] = useState ('');
  
//     function handleSubmit(e) {
//       e.preventDefault();
//       fetch('/api/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             eventDate,
//             eventName,
//             venmo
//             // ownerID
//         }),
//       })
//         .then((r) => r.json())
//         .then((data) => {
//           if (data && data.error) {
//             setSignupError(data.message);
//           }
//           if (data && data.token) {
//             //set cookie
//             cookie.set('token', data.token, {expires: 2});
//             Router.push('/');
//           }
//         });

//     }
//     return (

//       <select name="Existing Events" id="existingEvents">
//         <option value="action">Action</option>
//         <option value="action2">Action2</option>
//         <option value="action3">Action3</option>

//       </select> 
//       // <form onSubmit={handleSubmit}>
//       //   <p>Sell Ticket</p>
//       //   <label htmlFor="date">
//       //     Ticket Date
//       //     <input
//       //       value={eventDate}
//       //       onChange={(e) => setDate(e.target.value)}
//       //       name="eventDate"
//       //       type="date"
//       //     />
//       //   </label>
  
//       //   <br />

//       //   <label htmlFor="eventName">
//       //     Event Name
//       //     <input
//       //       value={eventName}
//       //       onChange={(e) => setEventName(e.target.value)}
//       //       name="eventName"
//       //       type="eventName"
//       //     />
//       //   </label>

//       //   <br />
//       //   <label htmlFor="venmo">
//       //     Venmo
//       //     <input
//       //       value={venmo}
//       //       onChange={(e) => setEventName(e.target.value)}
//       //       name="venmo"
//       //       type="venmo"
//       //     />
//       //   </label>

//         /* <label htmlFor="ownerID">
//           Owner ID
//           <input
//             value={ownerID}
//             onChange={(e) => setOwnerID(e.target.value)}
//             name="ownerID"
//             type="ownerID"
//           />
//         </label> */

//         // <br />
  
//         // <input type="submit" value="Submit" />
//         /* {signupError && <p style={{color: 'red'}}>{signupError}</p>} */
//       // </form>
//     );
//   };
  
//   export default Sell;