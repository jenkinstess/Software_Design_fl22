import React, {useState, useRef} from 'react';
import Tesseract from 'tesseract.js';
import preprocessImage from './preprocess';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
const db = require('/config/database');

export const getStaticProps = async() => {
  const response = await fetch('http://localhost:3000/api/events_buy')
  const data = await response.json()
  return {
    props: {currentEvents: data}
  }
}

const Sell = ({currentEvents}) =>{

  const [createEventMessage, setCreateEventMessage] = useState('');
  const [eventDate, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const existingEventNames = [];

  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
    // potentially we just need to store this in db? do we want manual entry
    // const [ownerID, setOwnerID] = useState('');

  //const [venmo, setVenmo] = useState ('');
  
  //iterate through events. parse each event object for its name. 
  // create an array with the names
  const json = JSON.stringify(currentEvents)
  var objs = JSON.parse(json);
  for (let i = 0; i<objs.result.length; i++){
    existingEventNames.push(objs.result[i].name)
    console.log(objs.result[i].name)
  }

  /*example
  // const text = '{"name":"John", "birth":"1986-12-14", "city":"New York"}';
  // const obj = JSON.parse(text, function (key, value) {
  //   if (key == "birth") {
  //     return new Date(value);
  //   } else {
  //     return value;
  //   }
  // });
  */
  

  const handleChange = (e) => {
    setEventName(e.target.value);
    // setDate(e.target.value);
    // setEventDescription(e.target.value);
  };

  const handleOTHERChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]))
  }

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
            setCreateEventMessage(data.message);
          }
          if (data && data.token) {
            //set cookie
            setCreateEventMessage("Success");
            cookie.set('token', data.token, {expires: 2});
            // Router.push('/');
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

  const handleClick = () => {

    console.log("handling this click !");
    
    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas),0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");
  
    Tesseract.recognize(
      dataUrl,'eng',
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
      // Get Confidence score
      let confidence = result.confidence
      // Get full output
      let text = result.text
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

        <label htmlFor="ticketCode">
          Unique ticket code
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            name="text"
            type="text"
          />
        </label>

        <br />
  
        <input type="submit" value="Submit" />
        {createEventMessage && <p style={{color: 'red'}}>{createEventMessage}</p>}

      </form>

      <br />

      <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img 
           src={image} className="App-logo" alt="logo"
           ref={imageRef} 
           />
        <h3>Canvas</h3>
        <canvas ref={canvasRef} width={700} height={300}></canvas>
          <h3>Extracted text</h3>
          {text}
        <div className="pin-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleOTHERChange} />
        <button onClick={handleClick} style={{height:50}}>Convert to text</button>
      </main>
    </div>

    </div>
    
    
    

    //this will prepopulate the event spot, user still has to enter their own info
  );
  

}
export default Sell;