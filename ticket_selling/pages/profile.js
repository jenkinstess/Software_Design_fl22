import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { server } from '../config';
import { QueryTypes, Sequelize } from 'sequelize';
import { StyleRegistry } from 'styled-jsx';
import React, {useState, useRef} from 'react';







  export const getStaticProps = async() =>{
    const response = await fetch(`${server}/api/profile`) //local
    // const response = await fetch('http://ec2-3-141-164-182.us-east-2.compute.amazonaws.com:3000/api/profile') //ec2

    //only absolute urls supported ^^^^^
    const data = await response.json()
    console.log(data)
    return {
      props: {users: data.users, tickets: data.tickets} 
    }
  }


  // const [showMe, setShowMe] = useState(true);
  async function listTicket(ticket_id, new_price) {
    // update ticket's owner to current user 
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

  async function claimTicket(ticket_id) {
    // update ticket's owner to current user 
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

  async function removeTicket(ticket_id) {
    // update ticket's owner to current user 
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

  async function unremoveTicket(ticket_id) {
    // update ticket's owner to current user 
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

  async function confirmTicket(ticket_id) {
    // update ticket's owner to current user 
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
      //transfer owner back to original here
      confirmTicket(ticket_id) //confirm ticket but other user should be banned so they will not get it
      location.reload();


  }

async function viewRemoved(){
  document.getElementById("removed_tix").style.display = "block"
  document.getElementById("remove_button").style.display = "none"
}

async function hideRemoved(){
  document.getElementById("removed_tix").style.display = "none"
  document.getElementById("remove_button").style.display = "block"
}

async function hideTicketSellForm(ticket_id){
  document.getElementById("sell_ticket_form"+ticket_id).style.display = "none"
  document.getElementById("show_sell_ticket_form"+ticket_id).style.display = "block"
}

async function show_sell_ticket_form(ticket_id){
  document.getElementById("show_sell_ticket_form"+ticket_id).style.display = "none"
  document.getElementById("sell_ticket_form"+ticket_id).style.display = "block"
}

const Profile = ({tickets, users}) =>{
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketID, setTicketId] = useState('');
  async function handleTicketSellSubmit(e) {
    e.preventDefault();
    listTicket(ticketID, ticketPrice)
    document.getElementById("sell_ticket_form"+ticketID).style.display = "none"
    }
  let cur_venmo;
  let cur_user_index = 0;
  let user_id = 0;
  let users_tix = []
  let selling_tix = []
  let reported = false;
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
        if (JSON.stringify(users_json.result[i].is_reported).replaceAll('"', '') == 1){
          return (
            <h1>You have been reported. Please contact the admin.</h1>
          )
        }
      }
    }

  //extract users tickets from full list of tickets
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
      
      let ticket = [((JSON.stringify(tickets_json[j].event)).replaceAll('"', '')), JSON.stringify(tickets_json[j].price), 
                    is_sold, JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets), 
                  show_ticket]

      users_tix.push(ticket)
    } else if (data.email == JSON.stringify(tickets_json[j].sold_from).replaceAll('"', '')) {
      let is_confirmed = JSON.stringify(tickets_json[j].is_confirmed).replaceAll('"',  '')
      alert(is_confirmed)
      alert(tickets_json[j].price)
      if (is_confirmed == 0){
        is_confirmed = false
      } else {
        is_confirmed = true //NOTE; this true false is FLIPPED!!! For convenience with the if statement below 
                              //we want to show the ticket when it 
      }    

       let ticket = [((JSON.stringify(tickets_json[j].event)).replaceAll('"', '')), JSON.stringify(tickets_json[j].price),  JSON.stringify(tickets_json[j].is_sold), JSON.stringify(tickets_json[j].event_id), JSON.stringify(tickets_json[j].id_tickets), is_confirmed, JSON.stringify(tickets_json[j].userUserid).replaceAll('"', '')]
       
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
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button id = {"show_sell_ticket_form"+ticket[4]} onClick={()=>show_sell_ticket_form(ticket[4])}>Resell Ticket</button>
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
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
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
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
              <p><a href = {`${server}/event/${ticket[3]}`}><i>Event</i></a>: {ticket[0]}</p>
              <p><i>Price:</i> $<b>{ticket[1]}</b></p>
              <button onClick={()=>confirmTicket(ticket[4])}>Confirm Ticket</button>
              <button onClick={()=>reportUser(ticket[6], ticket[4])}>Report User</button>
            </li>
            // NEED A WAY HERE TO INDICATE IF THE TICKET HAS BEEN SOLD OR NOT.... 
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
             {/* <a href = {`${server}/event/${ticket[3]}`} ><strong>Event:</strong> {ticket[0]}</a> 
              <strong>Event:</strong> {ticket[0]}
            <li><a href = {`${server}/ticket/${ticket[4]}`} >Price: {ticket[1]}</a></li> */}
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
