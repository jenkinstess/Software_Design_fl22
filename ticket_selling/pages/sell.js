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
        // .then((r) => r.json())
        .then((data) => {
          //still have to check for error
          //Router.push('/buy');
          alert("Event Uploaded!")
          if (data && data.error) {
            setCreateEventMessage(data.message);
          }
          if (data && data.token) {
            
            //set cookie
            setCreateEventMessage("Success");
            cookie.set('token', data.token, {expires: 2});

          }
        });
      //post new event to db if it's not already there
       
  }

  const handleClick = (e) => {
    e.preventDefault();
    console.log("handling this click !");
    
    // const canvas = canvasRef.current;
    // canvas.width = imageRef.current.width;
    // canvas.height = imageRef.current.height;
    // const ctx = canvas.getContext('2d');

    // ctx.drawImage(imageRef.current, 0, 0);
    // ctx.putImageData(preprocessImage(canvas),0,0);
    // const dataUrl = canvas.toDataURL("image/jpeg");
  
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
  
      setText(text);
      // setPin(patterns);
    })
  }

  return( 
     
    <div>
       <AuthRedirection />
      <br />
      
      <p>Sell Ticket:</p>
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
        <h3>Upload Ticket in format of <h7>[bmp, jpg, png, pbm, webp]</h7></h3>
        <h4>(Only the QR/bar code and numeric value under it should be visible)</h4>
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