import React, {useState, useRef} from 'react';
import Tesseract from 'tesseract.js';
import preprocessImage from './preprocess';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
import { server } from '../config';
const db = require('/config/database');
import AuthRedirection from '../components/AuthRedirection';


export const getStaticProps = async() => {
  const response = await fetch(`${server}/api/events_buy`)
  const data = await response.json()



  // const response2 = await fetch(`${server}/api/ticketPrices`)
  // const data2 = await response2.json()
  return {
    props: {currentEvents: data}
  }
}
/*get back to this
// async function fetchTicketPrices(){
//   const response2 = await fetch(`${server}/api/ticketPrices`)
//   const data2 = await response2.json()
//   return{
//     props:{existingTickets: data2}
//   }
// }
*/

const Sell = ({currentEvents, existingTickets}) =>{

  const [createEventMessage, setCreateEventMessage] = useState('');
  const [eventDate, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  //const eventData = new Map();
  const existingEventNames = [];

  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [imgConfirm, setImgConfirm] = useState('');
  const [imgData, setImgData] = useState('');
  const [imgError, setImageError] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [showMe, setShowMe] = useState(true);

    // potentially we just need to store this in db? do we want manual entry
  
  //iterate through events. parse each event object for its name. 
  // create an array with the names
  const json = JSON.stringify(currentEvents)
  var objs = JSON.parse(json);
  for (let i = 0; i<objs.result.length; i++){
    //come back to this to also populate date
    //eventData.set(objs.result[i].name, objs.result[i].date)
    existingEventNames.push(objs.result[i].name)
  }

  const handleChange = (e) => {
    e.preventDefault();
    setEventName(e.target.value);
    console.log("TEST HERE SHOWME:" + e.target.value)
    if(e.target.value.length == 0){
      setShowMe(true);
    }
    else{
      setShowMe(false);
    }
    
  };

  const handleOTHERChange = (event) => {
    console.log(event.target.files[0]);
    setImgData(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]))
    //handleClick(event);
    
  }

  async function findSellerID(){
    const loggedin_user_res = await fetch(`${server}/api/me`)
    const loggedin_user = await loggedin_user_res.json()
  
    // get logged in user's id for ticket sold
    const users_res = await fetch(`${server}/api/all_users`)
    const users = await users_res.json()
    const current_user = users.result.filter((user) => user.email.toString() == loggedin_user.email.toString())[0]
    console.log('logged in ID: ' + current_user.userid)
  
    const user_id = current_user.userid;
    return user_id;
  }

  async function handleSubmit(e) {
      e.preventDefault();
      console.log("handling this click !");

      // Tesseract.recognize(
      //   image,'eng',
      //   { 
      //     logger: m => console.log(m) 
      //   }
      // )
      // .catch (err => {
      //   console.log("error here");
      //   console.error(err);
      // })
      // .then(result => {
      //   console.log("getting the result");
      //   console.log("result is: " + JSON.stringify(result));
      //   console.log("text is: " + result.data.text);
      //   let numResult = (result.data.text).replaceAll(/[^0-9]/gi, '');
      //   console.log("text w only numbers is " + numResult);

      //   // Get full output
      //   let text = numResult;
      //   console.log(text)
    
      //   setText(text);
      // })

      // get logged in user's ID:
      const ownerID = await findSellerID();


      //console.log('Owner ID: ' + ownerID)

      fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          eventDate,
          eventName,
          eventDescription,
          //ownerID,
        }),
    }) 
    .then(() => {fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          eventName,
          eventDescription,
          ticketPrice,
          text,
          ownerID
        }),
      })})
      .then(() => {fetch('/api/img_tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          //imgData,
          image,
          text,
          eventName
        }),
      })})
        .then((data) => {
          console.log("data being sent is: " + data);
          console.log("stringified sent data: "+ JSON.stringify(data));
          //still have to check for error
          //Router.push('/buy');
          //alert("Event Uploaded!")
          if (data && data.error) {
            setCreateEventMessage(data.message);
          }
          if (data && data.info==0) {
            //set cookie
            setCreateEventMessage("Success");
            setText('');
            //cookie.set('token', data.token, {expires: 2});

          }
        });
      //post new event to db if it's not already there
       
  }

  const handleClick = (e) => {
    e.preventDefault();
    console.log("handling this click !");

    console.log("contents of image: " + image);
  
    Tesseract.recognize(
      image,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.log("error here");
      console.error(err);
    })
    .then(result => {
      console.log("getting the result");
      console.log("result is: " + JSON.stringify(result));
      console.log("text is: " + result.data.text);
      let numResult = (result.data.text).replaceAll(/[^0-9]/gi, '');
      console.log("text w only numbers is " + numResult);

      // Get full output
      let text = numResult;
      console.log(text)

      fetch('/api/verify_ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          eventName,
        }),
      })
        .then((r) => {
          return r.json();
        })
        .then((data) => {
          console.log("logging data" + JSON.stringify(data));
          if (data && data.error) {
            setImageError(data.message);
          }
          if (data && !data.ticket) {
            //set cookie
            console.log("success")
            setText(text);
            setImgConfirm("image chosen")
            //cookie.set('token', data.token, {expires: 2});

          }
        });

      // setPin(patterns);
    })
  }

  return( 
     
    <div>
       <AuthRedirection />
      <h2>Sell Ticket</h2>
      <br></br>
      Existing Events: <select onChange={handleChange}>
        <option value="" />
        {existingEventNames.map((eventName) => (
          <option>{eventName}</option>))}
    </select> 

    <br></br><br></br>
    <form onSubmit={handleSubmit}>
        
        {showMe && (
        <label htmlFor="date">
          Ticket Date
          <input
            value={eventDate}
            onChange={(e) => setDate(e.target.value)}
            name="eventDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </label>
        )}
        
  
        <br />

        <label htmlFor="eventName">
          Event Name
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            name="eventName"
            type="eventName"
            required
          />
        </label>

        <br />

        {showMe && (
        <label htmlFor="eventDescription">
          Event Description
          <input
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            name="eventDescription"
            type="eventDescription"
          />
        </label>
        )}
        <br />
        <label htmlFor="ticketPrice">
          Ticket Price 
          <input 
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            name="ticketPrice"
            type="number" //setting type to number restricts input to be a number
            // depending on the browser being used this will either be checked while typing or 
            //   upon submission. e is accepted due to e representing an integer (ie. 13e3 = 13*10^3)
            required
          />
        </label>

        {/* <br />

        <label htmlFor="ticketCode">
          Unique ticket code
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            name="text"
            type="text"
          />
        </label> */}

        <br />
        <div className="App">
      <main className="App-main">
        <br></br>
        <br></br>
        <h4>Upload Ticket:</h4>
        <p>Upload Ticket in format of <i>bmp, jpg, png, pbm, or webp</i></p>
        <p><i>Note:</i> Only the QR/bar code and numeric value under it should be visible</p>
        <br/>
        <img 
           src={image} className="App-logo" alt="logo"
          //  ref={imageRef} 
           />
        {/* <h3>Canvas</h3>
        <canvas ref={canvasRef}></canvas> */}
          {/* <h3>Extracted text</h3> */}
          {/* {text} */}
        <div className="text-box">
          {/* <p> {text} </p> */}
        </div>
        <input type="file" onChange={handleOTHERChange} />
        <br/>
        Confirm this is the right ticket
        <button onClick={handleClick}>CORRECT</button>
        {imgConfirm && <p style={{color: 'green'}}> {imgConfirm}</p>}
        {imgError && <p style={{color: 'red'}}> {imgError}</p>}
      </main>
      </div>
      <br/>
  
        <input type="submit" value="Submit" />
        {createEventMessage && <p style={{color: 'red'}}>{createEventMessage}</p>}
        

      </form>

      <br />


    </div>
    
    
    

    //this will prepopulate the event spot, user still has to enter their own info
  );
  

}
export default Sell;
