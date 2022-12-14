import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import preprocessImage from './preprocess';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
import { server } from '../config';
const db = require('/config/database');
import AuthRedirection from '../components/AuthRedirection';
import axios from "axios";
import Image from 'next/image'


export const getStaticProps = async () => {
  const response = await fetch(`${server}/api/events_buy`)
  const data = await response.json()
  const all_events = data ? data.result : []

  // filter events for those on or after current date
  const upcoming_events = all_events.filter(event => {
    // adjust for time zone differences:
    // date from db is being converted to central (or browser's) time from UST by subtracting hours (6 in case of CST)
    var now = new Date();
    var today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    var event_date = new Date(event.date)
    event_date.setDate(event_date.getDate() + 1)
    return event_date.getTime() >= today.getTime();
  })
  return {
    props: { currentEvents: upcoming_events }
  }
}

const Sell = ({ currentEvents, existingTickets }) => {

  const [createEventMessage, setCreateEventMessage] = useState('');
  const [eventDate, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  //const eventData = new Map();
  const existingEventNames = [];
  const [medianPrice, setMedianPrice] = useState('');
  //const [allPricesForEvent, setAllPrices] = useState('')

  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [imgConfirm, setImgConfirm] = useState('');
  const [imgData, setImgData] = useState('');
  const [imgError, setImageError] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [file, setFile] = useState('');
  const [uploadingStatus, setUploadingStatus] = useState('');
  const [uploadedFile, setUploadedFile] = useState('');

  const [showMe, setShowMe] = useState(true);

  const BUCKET_URL = "https://partyticketsimages.s3.us-east-2.amazonaws.com/";

  // potentially we just need to store this in db? do we want manual entry

  //iterate through events. parse each event object for its name. 
  // create an array with the names
  const json = JSON.stringify(currentEvents)
  var objs = JSON.parse(json);

  for (let i = 0; i < objs.length; i++) {
    //come back to this to also populate date
    //eventData.set(objs.result[i].name, objs.result[i].date)
    existingEventNames.push(objs[i].name)
  }

  async function handleChange(e) {
    e.preventDefault();
    var currentEvent = e.target.value;
    setEventName(e.target.value);

    const testPrice = await findMedianPrice(currentEvent);
    setMedianPrice(testPrice)
    console.log("TEST HERE SHOWME:" + e.target.value)
    if (e.target.value.length == 0) {
      setShowMe(true);
      document.getElementById("eventName").readOnly = false;

    }
    else {
      setShowMe(false);
      document.getElementById("eventName").readOnly = true;
    }


  };
  async function findMedianPrice(eventName) {
    console.log(JSON.stringify({
      eventName: eventName
    }))
    const averagePrice_res = await fetch(`${server}/api/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: eventName
      }),
    })
    const priceData = await averagePrice_res.json()
    const parsedAvg = priceData["averagePrice"]

    return parsedAvg

  }


  const handleOTHERChange = (event) => {
    if (!event.target.files[0]) {
      alert("Make sure Image is selected");
      return;
    }
    setImageError('');
    console.log(event.target.files[0]);
    setImgData(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]))
    setFile(event.target.files[0]);
    //handleClick(event);

  }

  async function findSellerID() {
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
          alert(data.message);
          setImageError(data.message);
          return;
        }
        if (data && !data.ticket) {
          //set cookie
          console.log("success")
          setText(text);
          setImgConfirm("image chosen")
          //cookie.set('token', data.token, {expires: 2});


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
            .then((data) => {
              if (!data || data.error) {
                alert("Error sending the event");
                return;
              }

              fetch('/api/tickets', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  eventName,
                  eventDescription,
                  ticketPrice,
                  text,
                  ownerID,
                  uploadedFile
                }),
              })
                .then((data) => {
                  console.log("finding out what the data is: " + data.message);
                  console.log("finding out what the data is: " + JSON.stringify(data));
                  if (!data || data.error) {
                    alert("Error sending the ticket");
                    return;
                  }
                  if (data) {
                    alert("Ticket Uploaded!");
                    setText('');
                    setImage('');
                    setEventName('');
                    setEventDescription('');
                    setFile('');
                    setDate('');
                    setMedianPrice('');
                    setTicketPrice('');
                    setImageError('');
                    setImgConfirm('');
                    Router.push('/buy');
                  }
                });
            })

        }
      });

  }

  const handleClick = (e) => {
    e.preventDefault();

    if (!image) {
      alert("No image selected");
      return;
    }

    const x = document.getElementById("textExtract");
    x.style.display = "block";
    console.log("handling this click !");

    console.log("contents of image: " + image);

    Tesseract.recognize(
      image, 'eng',
      {
        logger: m => console.log(m)
      }
    )
      .catch(err => {
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

        setUploadingStatus("uploading to backend...");
        fetch('/api/s3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
          }),
        })
          .then((r) => {
            return r.json();
          })
          .then(async (data) => {
            console.log("DATA!: " + JSON.stringify(data));
            const url = data.url;
            let { data: newData } = await axios.put(url, file, {
              headers: {
                "Content-type": file.type,
                "Access-Control-Allow-Origin": "*",
              },
            });

            setUploadedFile(BUCKET_URL + file.name);
            x.style.display = "none";
            setFile(null);
          });

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
              console.log(data.message);
              alert("This ticket is already being sold. Select a new ticket.")
              setText('');
              setImgConfirm('');
              return;
              //setImageError(data.message);
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

  return (
    

    <div>
      <AuthRedirection />
      <div class="bg-image">
        <div style={{
          zIndex: -1,
          position: "absolute",
          width: "100vw",
          height: "200vh"
        }}>
          <Image
            src="/topbackground.webp"
            alt="Party Picture"
            layout="fill"
            objectFit='cover'
          />
        </div>
      </div>
      <br />
      <h1 class="pt-4 text-light " >Sell Ticket</h1>
      <br />
      {/* <div class="container w-50 rounded bg-dark p-3 shadow"> */}
      <div class = "container w-50 shadow p-3 mb-5 bg-dark rounded">
      <p class="text-white">Please select (or create) an event, and fill in the ticket details below: </p>
      <label htmlFor="eventName" class="text-white" display="inline-block">Existing Events: &emsp;
      <br />
        <center>
        <select onChange={handleChange} name="eventName">
          {/* <option value="" /> */}
          <option value="">Create New Event</option>
          {existingEventNames.map((eventName) => (
            <option>{eventName}</option>))}
        </select>
        </center>
      </label>
      <center>
      
      <form onSubmit={handleSubmit}>
        
          
        {showMe && (
          <>
          <br />
            
            <label class="text-white" htmlFor="date" display="inline-block">
              Ticket Date: &emsp;
              <br />
              <input
                value={eventDate}
                onChange={(e) => setDate(e.target.value)}
                name="eventDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </label>
            <br />
          </>
        )}
        <label class="text-white" htmlFor="eventName" display="inline-block">
        <br />
          Event Name: &emsp;
          <br />
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            id="eventName"
            name="eventName"
            type="eventName"
            required
          />

        </label>

        <br />

        {showMe && (
          <>
          <br />
            <label class="text-white" htmlFor="eventDescription">
              Event Description: &emsp;
              <br />
              <input
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                name="eventDescription"
                type="eventDescription"
              />
            </label>
            <br />
          </>
        )}

        <label class="text-white" htmlFor="ticketPrice">
        <br />
          Ticket Price: &emsp;
          <br />
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

        <br />

        {!showMe && (
          <>
            <label htmlFor="medianPrice" class="text-white">
            <br />
              Suggested Price: &emsp;
              <br />
              <input type="text"
                value={medianPrice}
                class="field left"
                readonly="readonly"
              ></input>
            </label>
            <br />
          </>
        )}



        <div className="App">
          <main className="App-main">
            <br></br>
            <br />
            {/* <h4>Upload Ticket:</h4> */}
            <p class="text-white">Upload your ticket in the format of <i>bmp, jpg, png, pbm, or webp.</i> Confirm below.</p>
            <p class="text-white"><small><i>Note:</i> Only the QR/bar code and numeric value under it should be visible</small></p>
            
            {/* <img src={image} className="App-logo" alt="logo"/> */}
            <img src={image} />
            <br />

            <div className="text-box">
              {/* <p> {text} </p> */}
            </div>
            <label htmlFor='ticketFile' class="text-white"> Ticket Document: &emsp;
            
            <input class="form-control center" type="file" name="ticketFile" onChange={handleOTHERChange} />
            </label>
            <br />
            <button class="text-white" onClick={handleClick}>CONFIRM TICKET</button>
            

            <div class="spinner-border text-success" role="status" id="textExtract">
            </div>
            {imgConfirm && <p style={{ color: 'green' }}> {imgConfirm}</p>}
            {imgError && <p style={{ color: 'red' }}> {imgError}</p>}
            <br />

            {/* {uploadingStatus && <p>{uploadingStatus}</p>} */}
            
            <div>
              <p class="text-white">
              Please check that the numbers below match those on your ticket below the QR / bar code.
              </p>
              <p class="text-white">
              <small><i><strong>Correct these numbers if they do not match: </strong></i></small>
              </p>
            </div>
            
            <label htmlFor="extracted Text" class="text-white" >
              Extracted Values: &emsp; 
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                id="eventName"
                name="eventName"
                type="eventName"
                required
                size={text.length + 2}
              />

            </label>
          </main>
        </div>
        

        <input type="submit" value="Create Ticket" class="btn btn-primary mt-3" />
        {createEventMessage && <p style={{ color: 'red' }}>{createEventMessage}</p>}


      </form>
      
      </center>
      
      </div>

      <br />


    </div>




    //this will prepopulate the event spot, user still has to enter their own info
  );


}
export default Sell;
