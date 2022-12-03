import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { server } from '../config';
import { QueryTypes, Sequelize } from 'sequelize';
import { StyleRegistry } from 'styled-jsx';
import React, {useState, useRef} from 'react';


  //get a list of all users, tickets, and images
  export const getStaticProps = async() =>{
    const response = await fetch(`${server}/api/profile`) //local
    const data = await response.json()
    console.log(data)
    return {
      props: {users: data.users, tickets: data.tickets} 
    }
  }


  // put ticket back on market with a new price
  async function listTicket(ticket_id, new_price) {
    const transfer_res = await fetch(`${server}/api/update_ticket/list_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
        new_price,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  // take ticket off market
  async function claimTicket(ticket_id) {
    const transfer_res = await fetch(`${server}/api/update_ticket/claim_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  // remove ticket from view on profile page
  async function removeTicket(ticket_id) {
    const transfer_res = await fetch(`${server}/api/update_ticket/remove_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  // add ticket back to view on profile page
  async function unremoveTicket(ticket_id) {
    const transfer_res = await fetch(`${server}/api/update_ticket/unremove_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  // previous owner confirm transaction
  async function confirmTicket(ticket_id) {
    const transfer_res = await fetch(`${server}/api/update_ticket/confirm_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      location.reload();
  }

  // previous owner report buyer
  async function reportUser(user_id, ticket_id){
    const report_res = await fetch(`${server}/api/report_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
      });
      //transfer owner back to original here?
      confirmTicket(ticket_id) //confirm ticket but other user should be banned so they will not get it
      location.reload();


  }

// show div with removed tix, hide remove button
async function viewRemoved(){
  document.getElementById("removed_tix").style.display = "block"
  document.getElementById("remove_button").style.display = "none"
}

// hide div with removed tix, show remove button
async function hideRemoved(){
  document.getElementById("removed_tix").style.display = "none"
  document.getElementById("remove_button").style.display = "block"
}

// hide sell ticket form, show the button to access form
async function hideTicketSellForm(ticket_id){
  document.getElementById("sell_ticket_form"+ticket_id).style.display = "none"
  document.getElementById("show_sell_ticket_form"+ticket_id).style.display = "block"
}

// show sell ticket form, hide the button to access form
async function show_sell_ticket_form(ticket_id){
  document.getElementById("show_sell_ticket_form"+ticket_id).style.display = "none"
  document.getElementById("sell_ticket_form"+ticket_id).style.display = "block"
}


const Profile = ({tickets, users}) =>{

  
  //async function to handle reselling a ticket, with const callback vars
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketID, setTicketId] = useState('');
  async function handleTicketSellSubmit(e) {
    e.preventDefault();
    listTicket(ticketID, ticketPrice)
    document.getElementById("sell_ticket_form"+ticketID).style.display = "none"
    }

  //global variables to keep track (some aren't needed, TODO: cleanup)  
  let cur_venmo;
  let cur_user_index = 0;
  let user_id = 0;
  let users_tix = []
  let selling_tix = []
  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  },{refreshInterval:10});
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  
  //extract user information from full list of users
  if (data.email) {
    loggedIn = true;
    let users_json = JSON.parse(users)
    let num_users = (users_json.result).length
    for(let i = 0; i < num_users; i++){
      if ((data.email).localeCompare(JSON.stringify(users_json.result[i].email).replaceAll('"', '')) == 0){
        cur_user_index = i;
        cur_venmo = JSON.stringify(users_json.result[i].venmo).replaceAll('"', '')
        user_id = JSON.stringify(users_json.result[i].userid)
        //if user has been reported, return reported screen
        if (JSON.stringify(users_json.result[i].is_reported).replaceAll('"', '') == 1){
          return (
            <h1>You have been reported. Please contact j.shonfeld@wustl.edu.</h1>
          )
        }
      }
    }

  //extract users tickets from full list of tickets, and images from full list of images
  let tickets_json = JSON.parse(tickets)
  let num_tix = (tickets_json).length
  for (let j = 0; j < num_tix; j++){
    if (user_id == JSON.stringify(tickets_json[j].userUserid).replaceAll('"', '')){
      let is_sold =  JSON.stringify(tickets_json[j].is_sold).replaceAll('"', '')
      if (is_sold == 0){
        is_sold = false
      } else {
        is_sold = true
      }
    let show_ticket = JSON.stringify(tickets_json[j].is_removed).replaceAll('"',  '')
    if (show_ticket == 0){ //show ticket is a variable that holds is_removed
      show_ticket = true 
    } else {
      show_ticket = false
    }    
      let is_confirmed = JSON.stringify(tickets_json[j].is_confirmed).replaceAll('"',  '')
      if (is_confirmed == 0){
        is_confirmed = false
      } else {
        is_confirmed = true //NOTE; this true false is FLIPPED!!! For convenience with the if statement below 
      }  
      let ticket = [((JSON.stringify(tickets_json[j].event)).replaceAll('"', '')), JSON.stringify(tickets_json[j].price), 
                    is_sold, JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets), 
                  show_ticket, JSON.stringify(tickets_json[j].uploaded_img).replaceAll('"',''), is_confirmed, JSON.stringify(tickets_json[j].sold_from).replaceAll('"', '')]
                  //0: event, 1: price, 2: is_sold, 3: event_id, 4: ticket id, 5: show ticket (removed?), 6: img url, 7: is_confirmed, 8: sold from
      users_tix.push(ticket)
    } else if (data.email == JSON.stringify(tickets_json[j].sold_from).replaceAll('"', '')) {  
      let is_confirmed = JSON.stringify(tickets_json[j].is_confirmed).replaceAll('"',  '')
      if (is_confirmed == 0){
        is_confirmed = false
      } else {
        is_confirmed = true //NOTE; this true false is FLIPPED!!! For convenience with the if statement below 
      }  
       let ticket = [((JSON.stringify(tickets_json[j].event)).replaceAll('"', '')), JSON.stringify(tickets_json[j].price),
         JSON.stringify(tickets_json[j].is_sold), JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets),
          is_confirmed, JSON.stringify(tickets_json[j].userUserid).replaceAll('"', ''), JSON.stringify(tickets_json[j].uploaded_img).replaceAll('"', '')]
          //0: event, 1: price, 2: is_sold, 3: event_id, 4: ticket id, 5: is_confirmed, 6: userid, 7: uploaded_img
          
       selling_tix.push(ticket)
       
    }
  }
  }
  
  return (
    <div>
      <h2>Profile</h2>
      {loggedIn && (
        <>
          <p><b>Welcome to the profile page <i>{data.email}!</i></b></p>
          <p>You can find relevant account information here: </p>
          
          <p>Venmo: <i>{cur_venmo}</i></p>
        
      <h5>Your Tickets: </h5>
      <div>
      <div class="card text-center mx-auto" style={{width: '18rem'}}>
        <ul class="list-group list-group-flush">
          {users_tix.map((ticket) =>
             ticket[2] ? ( //is sold?
              ticket[5] && //is removed?
            <li key={ticket} class="list-group-item">
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
            { ticket[7] ? (<a href ={ticket[6]}>View Ticket</a>) : <p>Your payment is pending approval from the seller. You may csontact the seller at {ticket[8]} </p>}
            <br></br>
            {ticket [7] &&  <button id = {"show_sell_ticket_form"+ticket[4]} onClick={()=>show_sell_ticket_form(ticket[4])}>Resell Ticket</button>}
              <button onClick={()=>removeTicket(ticket[4])}>Remove Ticket</button>
              <div id = {"sell_ticket_form"+ticket[4]} style = {{display: "none"}}>
                <h1> How much would you like to sell your ticket for?</h1>
                <form onSubmit={handleTicketSellSubmit}>
                  <input type = "number" placeholder = {ticket[1]} onChange={(e) => (
                    setTicketPrice(e.target.value),
                    setTicketId(ticket[4]))}></input>
                  <button type = "submit" value = "Submit">Submit</button>
                  <button type = "button" onClick={() => hideTicketSellForm(ticket[4])}>Cancel</button>
                </form>
              </div>
            </li>

            
          ) : ticket[5] && //is removed?
          <li key={ticket} class="list-group-item">
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]} | On Market</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>claimTicket(ticket[4])}>Claim Ticket</button>
            </li>
          )}
          </ul>
          </div>
        </div>
        <h5>Recently Sold: </h5>
      <div>
        <br></br>
      <div class="card text-center mx-auto" style={{width: '18rem'}}>
        <ul class="list-group list-group-flush">
          {selling_tix.map((ticket) =>
           ((!ticket[5]) && (                                     //confirmed already?
            <li key={ticket} class="list-group-item">
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>confirmTicket(ticket[4])}>Confirm Ticket</button>
              <button onClick={()=>reportUser(ticket[6], ticket[4])}>Report User</button>
            </li>
          )))}
         
          </ul>
          </div>
        </div>
          <button id = "remove_button" onClick = {() => viewRemoved()}>View Removed Tickets</button>
          <div id = "removed_tix" style = {{
            display: "none"
          }}>
          <div class="card text-center mx-auto" style={{width: '18rem'}}>
           <ul class="list-group list-group-flush">
           {users_tix.map((ticket) =>
              !ticket[5] &&
            <li key={ticket} class="list-group-item">
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>unremoveTicket(ticket[4])}>Unremove Ticket</button>
            </li>

          )}
             </ul>
           </div>
          <button id = "remove_button" onClick = {() => hideRemoved()}>Hide Removed Tickets</button>
          </div>
          <br /><br />
        </>
      )}
    </div>
  );
  
}

export default Profile;
