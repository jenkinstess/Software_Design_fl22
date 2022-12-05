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

  // const response2 = await fetch(`${server}/api/ticketPrices`)
  // const data2 = await response2.json()
  return {
    props: { currentEvents: upcoming_events }
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
    console.log("12:47 TEST" + testPrice)
    //   fetch(`${server}/api/prices`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       currentEvent
    //     }),
    // }) 
    //   .then((r) => {
    //     //console.log("DATA " + r)
    //     return r.json();
    //   })
    //   .then((data2) => {
    //     console.log("logging data2: " + data2);
    //   });

    // const data2 = await response.json()
    // console.log("DATA@ " + data2)

    //findEventMedianPrice(e.target.value);
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
    // console.log("ANYTHING")
    const priceData = await averagePrice_res.json()

    // const final_average = JSON.stringify(averagePrice, ["averagePrice"])
    // const parsedAvg = JSON.parse(final_average).averagePrice
    //JSON.stringify(row, ["id"])
    // var avgObjs = JSON.parse(averagePrice_string);
    // console.log("avg price " + avgObjs)
    // var finalAvg = avgObjs.result[0].averagePrice
    // console.log("result is: " + JSON.stringify(result));
    // console.log("text is: " + averagePrice_string);
    // const averagePrice_obj = JSON.parse(averagePrice_string)
    //const final_average = averagePrice_string.getSelection()[0]
    const parsedAvg = priceData["averagePrice"]

    return parsedAvg

  }


  const handleOTHERChange = (event) => {
    if (!event.target.files[0]) {
      alert("Make sure Image is selected");
      return;
    }
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
          height: "15vh"
        }}>
          <Image
            src="/topbackground.webp"
            alt="Party Picture"
            layout="fill"
            objectFit='cover'
          />
        </div>
      </div>
      <h1 class="pt-4 text-light">Sell Ticket</h1>
      <p class="text-light">Please select (or create) an event, and fill in the ticket details below: </p>
      <label htmlFor="eventName" class="my-3">Existing Events: &emsp;
        <select onChange={handleChange} name="eventName">
          {/* <option value="" /> */}
          <option value="">Create New Event</option>
          {existingEventNames.map((eventName) => (
            <option>{eventName}</option>))}
        </select>
      </label>
      <form onSubmit={handleSubmit}>

        {showMe && (
          <>
            <label class="mb-3" htmlFor="date">
              Ticket Date: &emsp;
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

        <label class="mb-3" htmlFor="eventName">
          Event Name: &emsp;

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
            <label class="mb-3" htmlFor="eventDescription">
              Event Description: &emsp;
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

        <label class="mb-3" htmlFor="ticketPrice">
          Ticket Price: &emsp;
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
            <label htmlFor="medianPrice">
              Suggested Price: &emsp;
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
            {/* <h4>Upload Ticket:</h4> */}
            <p>Now, upload your ticket in the format of <i>bmp, jpg, png, pbm, or webp.</i> Confirm below.</p>
            <p><i>Note:</i> Only the QR/bar code and numeric value under it should be visible</p>
            
            {/* <img src={image} className="App-logo" alt="logo"/> */}
            <img src={image} />

            <div className="text-box">
              {/* <p> {text} </p> */}
            </div>
            <label htmlFor='ticketFile' class=""> Ticket Document: &emsp;
            <input type="file" name="ticketFile" onChange={handleOTHERChange} />
            </label>
            <br />
            <button class="mb-3" onClick={handleClick}>CONFIRM TICKET</button>

            <div class="spinner-border" role="status" id="textExtract">
            </div>

            {/* {uploadingStatus && <p>{uploadingStatus}</p>} */}
            {imgConfirm && <p style={{ color: 'green' }}> {imgConfirm}</p>}
            {imgError && <p style={{ color: 'red' }}> {imgError}</p>}
            <div>
              <p>
              Please check that the numbers below match those on your ticket below the QR / bar code.
              </p>
              <p>
              Correct these numbers if they do not match:
              </p>
            </div>
            
            <label htmlFor="extracted Text" >
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

      <br />


    </div>




    //this will prepopulate the event spot, user still has to enter their own info
  );


}
export default Sell;
