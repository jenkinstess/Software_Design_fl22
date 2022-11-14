import React, {useState, useRef} from 'react';
import Tesseract from 'tesseract.js';
import preprocessImage from './preprocess';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
import { server } from '../config';
const db = require('/config/database');

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


  //GET BACK TO THIS
  // const ticketJson = JSON.stringify(existingTickets)
  // console.log(ticketJson);
  //var objs2 = JSON.parse(ticketJson);
  // for (let i = 0; i<objs2.result.length; i++){
  //   //come back to this to also populate date
  //   //eventData.set(objs.result[i].name, objs.result[i].date)
  //   console.log("TESTING HERE!!!" + objs2.result[i])
  // }



  const handleChange = (e) => {
    // setDate(e.target.value);
    // setEventDescription(e.target.value);
    e.preventDefault();
    setEventName(e.target.value);
    //GET BACK TO THIS
    // console.log('EVENT NAME RIGHT NOW IS +' + eventName)
    // fetch('/api/ticketPrices', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     eventName
    //   }),
    // })


  };

  const handleOTHERChange = (event) => {
    console.log(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]))
    //handleClick(event);
    
  }

  function handleSubmit(e) {
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
    .then(() => {fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          eventName,
          eventDescription,
          ticketPrice,
          text
            // ownerID
        }),
      })})
        // .then((r) => r.json())
        .then((data) => {
          //still have to check for error
          Router.push('/buy');
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
      <br />
      
      <p>Sell Ticket:</p>
      Existing Events: <select onChange={handleChange}>
        <option value="" />
        {existingEventNames.map((eventName) => (
          <option>{eventName}</option>))}
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
            required
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
            required
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