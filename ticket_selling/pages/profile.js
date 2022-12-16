import Head from "next/head";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import { server } from "../config";
import { QueryTypes, Sequelize } from "sequelize";
import { StyleRegistry } from "styled-jsx";
import React, { useState, useRef } from "react";
import Image from "next/image";

//get a list of all users, tickets, and images
export const getStaticProps = async () => {
  const response = await fetch(`${server}/api/profile`); //local
  const data = await response.json();
  console.log(data);
  return {
    props: { users: data.users, tickets: data.tickets, events: data.events },
  };
};

// put ticket back on market with a new price
async function listTicket(ticket_id, new_price) {
  const transfer_res = await fetch(`${server}/api/update_ticket/list_ticket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket_id,
      new_price,
    }),
  })
    .then((r) => r.json())
    .then((data) => {});
  location.reload();
}

// async function editProfPic(user_id, img){
//   //ASK TESS FOR API INFO
// }

// take ticket off market
async function claimTicket(ticket_id) {
  const transfer_res = await fetch(`${server}/api/update_ticket/claim_ticket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket_id,
    }),
  })
    .then((r) => r.json())
    .then((data) => {});
  location.reload();
}

// remove ticket from view on profile page
async function removeTicket(ticket_id) {
  const transfer_res = await fetch(
    `${server}/api/update_ticket/remove_ticket`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket_id,
      }),
    }
  )
    .then((r) => r.json())
    .then((data) => {});
  location.reload();
}

async function hideShowYourTix() {
  let checkbox = document.getElementById("your-tix-checkbox");
  let yourtix = document.getElementById("your-tickets");
  if (checkbox.checked == true) {
    yourtix.style.display = "block";
  } else {
    yourtix.style.display = "none";
  }
}

async function hideShowTixOnMarket() {
  let checkbox = document.getElementById("tix-on-market-checkbox");
  let onmarket = document.getElementById("tix-on-market");
  if (checkbox.checked == true) {
    onmarket.style.display = "block";
  } else {
    onmarket.style.display = "none";
  }
}

async function hideShowRemovedTix(){
  let checkbox = document.getElementById("removed-tix-checkbox");
  let element = document.getElementById("removed-tix");
  if (checkbox.checked == true) {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

// async function hideShowActionCenter(){

// }

// add ticket back to view on profile page
async function unremoveTicket(ticket_id) {
  const transfer_res = await fetch(
    `${server}/api/update_ticket/unremove_ticket`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket_id,
      }),
    }
  )
    .then((r) => r.json())
    .then((data) => {});
  location.reload();
}

// previous owner confirm transaction
async function confirmTicket(ticket_id) {
  const transfer_res = await fetch(
    `${server}/api/update_ticket/confirm_ticket`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket_id,
      }),
    }
  )
    .then((r) => r.json())
    .then((data) => {});
  location.reload();
}

// previous owner report buyer
async function reportUser(user_id, ticket_id) {
  const report_res = await fetch(`${server}/api/report_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
    }),
  })
    .then((r) => r.json())
    .then((data) => {});
  //transfer owner back to original here?
  confirmTicket(ticket_id); //confirm ticket but other user should be banned so they will not get it
  location.reload();
}

// show div with removed tix, hide remove button
async function viewRemoved() {
  document.getElementById("removed_tix").style.display = "block";
  document.getElementById("remove_button").style.display = "none";
}

// hide div with removed tix, show remove button
async function hideRemoved() {
  document.getElementById("removed_tix").style.display = "none";
  document.getElementById("remove_button").style.display = "block";
}

// hide sell ticket form, show the button to access form
async function hideTicketSellForm(ticket_id) {
  document.getElementById("sell_ticket_form" + ticket_id).style.display =
    "none";
  document.getElementById("show_sell_ticket_form" + ticket_id).style.display =
    "block";
}

// show sell ticket form, hide the button to access form
async function show_sell_ticket_form(ticket_id) {
  document.getElementById("show_sell_ticket_form" + ticket_id).style.display =
    "none";
  document.getElementById("sell_ticket_form" + ticket_id).style.display =
    "block";
}

// hide report user modal, show the button to access it
async function hideReportModal(ticket_id) {
  document.getElementById("report_user" + ticket_id).style.display = "none";
}

// show report user modal, hide the button to access form
async function showReportModal(ticket_id) {
  document.getElementById("report_user" + ticket_id).style.display = "block";
}

const Profile = ({ tickets, users, events }) => {
  //async function to handle reselling a ticket, with const callback vars
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketID, setTicketId] = useState("");
  let profile_pic =
    "https://partyticketsimages.s3.us-east-2.amazonaws.com/basic_prof_pic.jpg";
  async function handleTicketSellSubmit(e) {
    e.preventDefault();
    listTicket(ticketID, ticketPrice);
    document.getElementById("sell_ticket_form" + ticketID).style.display =
      "none";
  }

  // async function handleProfPic(e){
  //   e.preventDefault();
  //   editProfPic(userID, profileImg)
  // }

  //global variables to keep track (some aren't needed, TODO: cleanup)
  let cur_venmo;
  let market_tix = [];
  let user_id = 0;
  let users_tix = [];
  let selling_tix = [];
  let cur_user_index = 0;
  let num_action_items = 0;
  const { data, revalidate } = useSWR(
    "/api/me",
    async function (args) {
      const res = await fetch(args);
      return res.json();
    },
    { refreshInterval: 10 }
  );
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;

  //extract user information from full list of users
  if (data.email) {
    loggedIn = true;
    let users_json = JSON.parse(users);
    let num_users = users_json.result.length;
    for (let i = 0; i < num_users; i++) {
      if (
        data.email.localeCompare(
          JSON.stringify(users_json.result[i].email).replaceAll('"', "")
        ) == 0
      ) {
        cur_user_index = i;
        cur_venmo = JSON.stringify(users_json.result[i].venmo).replaceAll(
          '"',
          ""
        );
        user_id = JSON.stringify(users_json.result[i].userid);
        let profile_pic_res = JSON.stringify(users_json.result[i].prof_pic);
        if (
          profile_pic_res != "null" &&
          profile_pic_res != null &&
          profile_pic_res != ""
        ) {
          profile_pic = profile_pic_res.replaceAll('"', "");
        }
        // setUserID(user_id)
        //if user has been reported, return reported screen
        if (
          JSON.stringify(users_json.result[i].is_reported).replaceAll(
            '"',
            ""
          ) == 1
        ) {
          return (
            <div>
              <br></br>
              <h1>
                You have been reported. Please contact j.shonfeld@wustl.edu.
              </h1>
            </div>
          );
        }
      }
    }

    //extract users tickets from full list of tickets, and images from full list of images
    let tickets_json = JSON.parse(tickets);
    let num_tix = tickets_json.length;
    let events_json = JSON.parse(events);
    let num_events = events_json.length;
    let event_date = "";

    for (let j = 0; j < num_tix; j++) {
      let ticket_event_id = JSON.stringify(tickets_json[j].event_id).replaceAll(
        '"',
        ""
      );
      for (let k = 0; k < num_events; k++) {
        if (
          ticket_event_id ==
          JSON.stringify(events_json[k].id).replaceAll('"', "")
        ) {
          event_date = JSON.stringify(events_json[k].date).replaceAll('"', "");
        }
      }

      if (
        user_id ==
        JSON.stringify(tickets_json[j].userUserid).replaceAll('"', "")
      ) {
        let is_sold = JSON.stringify(tickets_json[j].is_sold).replaceAll(
          '"',
          ""
        );
        if (is_sold == 0) {
          is_sold = false;
        } else {
          is_sold = true;
        }
        let show_ticket = JSON.stringify(tickets_json[j].is_removed).replaceAll(
          '"',
          ""
        );
        if (show_ticket == 0) {
          //show ticket is a variable that holds is_removed
          show_ticket = true;
        } else {
          show_ticket = false;
        }
        let is_confirmed = JSON.stringify(
          tickets_json[j].is_confirmed
        ).replaceAll('"', "");
        if (is_confirmed == 0) {
          is_confirmed = false;
        } else {
          is_confirmed = true; //NOTE; this true false is FLIPPED!!! For convenience with the if statement below
        }
        let ticket = [
          JSON.stringify(tickets_json[j].event).replaceAll('"', ""),
          JSON.stringify(tickets_json[j].price),
          is_sold,
          JSON.stringify(tickets_json[j].event_id),
          JSON.stringify(tickets_json[j].id_tickets),
          show_ticket,
          JSON.stringify(tickets_json[j].uploaded_img).replaceAll('"', ""),
          is_confirmed,
          JSON.stringify(tickets_json[j].sold_from).replaceAll('"', ""),
          event_date,
        ];
        //0: event, 1: price, 2: is_sold, 3: event_id, 4: ticket id, 5: show ticket (removed?), 6: img url, 7: is_confirmed, 8: sold from, 9: event date
        if (is_sold) {
          users_tix.push(ticket);
        } else {
          market_tix.push(ticket);
        }
      } else if (
        data.email ==
        JSON.stringify(tickets_json[j].sold_from).replaceAll('"', "")
      ) {
        let is_confirmed = JSON.stringify(
          tickets_json[j].is_confirmed
        ).replaceAll('"', "");
        if (is_confirmed == 0) {
          is_confirmed = false;
        } else {
          is_confirmed = true; //NOTE; this true false is FLIPPED!!! For convenience with the if statement below
        }
        let ticket = [
          JSON.stringify(tickets_json[j].event).replaceAll('"', ""),
          JSON.stringify(tickets_json[j].price),
          JSON.stringify(tickets_json[j].is_sold),
          JSON.stringify(tickets_json[j].event_id),
          JSON.stringify(tickets_json[j].id_tickets),
          is_confirmed,
          JSON.stringify(tickets_json[j].userUserid).replaceAll('"', ""),
          JSON.stringify(tickets_json[j].uploaded_img).replaceAll('"', ""),
          event_date,
        ];
        //0: event, 1: price, 2: is_sold, 3: event_id, 4: ticket id, 5: is_confirmed, 6: userid, 7: uploaded_img, 8: event date

        selling_tix.push(ticket);
        num_action_items = selling_tix.length
      }
      
    }
    
  }

  return (
    <div class="bg-image">
      <div
        style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Image
          class="opacity-50"
          src="/topbackground.webp"
          alt="Party Picture"
          layout="fill"
          objectFit="cover"
        />
      </div>
      {loggedIn && (
        <>
          <div class="container">
            <div class="row">
              <div id = "profile-pic" class="col-2 position-fixed left-0 mx-auto">
                <br></br>
                <br></br>
                <div class="card">
                  <div class="card m-4">
                    <img class="rounded" src={profile_pic}></img>
                  </div>
                  <p>
                    <b>
                      Welcome to the profile page <i>{data.email}!</i>
                    </b>
                  </p>
                  <p>
                    Venmo: <i>{cur_venmo}</i>
                  </p>
                  <div>
                    <p class = "text-danger">Action Items: {num_action_items}</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="your-tix-checkbox"
                      onClick={hideShowYourTix}
                    ></input>
                    <label for="your-tix-checkbox" class="m-1">
                      {" "}
                      Your Tickets
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="tix-on-market-checkbox"
                      onClick={hideShowTixOnMarket}
                    ></input>
                    <label for="tix-on-market-checkbox" class="m-1">
                      {" "}
                      Tickets on the Market
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="removed-tix-checkbox"
                      onClick={hideShowRemovedTix}
                    ></input>
                    <label for="tix-on-market-checkbox" class="m-1">
                      {" "}
                      Hidden Tickets
                    </label>
                  </div>

                </div>
              </div>

              <div class="col-7 offset-4 mt-5" id = "tix-section">

                  
                <div  id="your-tickets" class = "g-1" style={{ display: "none" }}>

                  
                    {users_tix.map(
                      (ticket) =>
                        ticket[5] && ( //is removed?
                          <div id = "your-ticket" class="row-cols-1">
                            <li key={ticket} class="list-group-item">
                              <div class="card text-center shadow p-3 mb-5 w-15">
                                <div>
                                  <a href={`${server}/event/${ticket[3]}`}>
                                    <i>{ticket[0]}</i>
                                  </a>
                                  <p>{ticket[9]}</p>
                                </div>
                                <p>
                                  <i>Price:</i> $<b>{ticket[1]}</b>
                                </p>
                                {ticket[7] ? (
                                  <div class="card border-primary mb-3">
                                    <a
                                      href={ticket[6]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <img
                                        class="card-img-top"
                                        src={ticket[6]}
                                      ></img>
                                    </a>
                                  </div>
                                ) : (
                                  <div class="card border-warning m-3 p-3">
                                    <p>
                                      Your payment is pending approval from the
                                      seller. You may contact the seller at{" "}
                                      <strong>{ticket[8]}</strong>
                                    </p>
                                  </div>
                                )}

                                <br></br>
                                {ticket[7] && (
                                  <button
                                    class="btn btn-primary"
                                    id={"show_sell_ticket_form" + ticket[4]}
                                    onClick={() =>
                                      show_sell_ticket_form(ticket[4])
                                    }
                                  >
                                    Resell Ticket
                                  </button>
                                )}
                                <button
                                  class="btn btn-warning"
                                  onClick={() => removeTicket(ticket[4])}
                                >
                                  Hide Ticket
                                </button>

                                <div
                                  class="modal"
                                  id={"sell_ticket_form" + ticket[4]}
                                  style={{ display: "none" }}
                                >
                                  <div class="modal-content">
                                    <div class="card modal-body">
                                      <h1 class="modal-body text-light">
                                        {" "}
                                        How much would you like to sell your
                                        ticket for?
                                      </h1>
                                      <form
                                        class="modal-body text-light"
                                        onSubmit={handleTicketSellSubmit}
                                      >
                                        <input
                                          type="number"
                                          placeholder={ticket[1]}
                                          onChange={(e) => (
                                            setTicketPrice(e.target.value),
                                            setTicketId(ticket[4])
                                          )}
                                        ></input>
                                        <br></br>
                                        <br></br>
                                        <button
                                          type="submit"
                                          value="Submit"
                                          class="btn btn-success"
                                        >
                                          Sell Ticket
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-danger"
                                          onClick={() =>
                                            hideTicketSellForm(ticket[4])
                                          }
                                        >
                                          Cancel
                                        </button>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </div>
                        )
                    )}

                  {/* <button
                    id="remove_button"
                    class="btn btn-secondary text-center m-5"
                    onClick={() => viewRemoved()}
                  >
                    View Hidden Tickets
                  </button> */}
                  </div>
                  <div
                    id="removed-tix"
                    class="g-1"
                    style={{
                      display: "none",
                    }}
                  >

                    <div class="bg-warning rounded">Hidden Tickets</div>
                    <br />
                    <div class="m-2">
                      <div class="card text-center mx-auto">
                        <ul class="list-group list-group-flush">
                          {users_tix.map(
                            (ticket) =>
                              !ticket[5] && (
                                <li key={ticket} class="list-group-item">
                                  <div>
                                    <a href={`${server}/event/${ticket[3]}`}>
                                      <i>{ticket[0]}</i>
                                    </a>

                                    <p>{ticket[9]}</p>
                                  </div>
                                  <p>
                                    <i>Price:</i> $<b>{ticket[1]}</b>
                                  </p>
                                  <button
                                    class="btn btn-primary"
                                    onClick={() => unremoveTicket(ticket[4])}
                                  >
                                    Show Ticket
                                  </button>
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                

                <div style={{ display: "none" }} id="tix-on-market" class = "g-1 p-5">
                  {/* <div class="bg-light rounded sticky-top border-bottom">
                    <b class="h4">Tickets Being Sold</b>
                  </div> */}
                  <p> </p>
                  {market_tix.map(
                    (ticket) =>
                      ticket[5] && ( //is removed?
                        <div class="m-2">
                          <div class="card text-center mx-auto shadow p-3 mb-5">
                            <li key={ticket} class="list-group-item">
                              <p>
                                <div>
                                  <a href={`${server}/event/${ticket[3]}`}>
                                    <i>{ticket[0]}</i>
                                  </a>
                                  <p>{ticket[9]}</p>
                                </div>
                                {ticket[0]} | On Market
                              </p>
                              <p>
                                <i>Price:</i> $<b>{ticket[1]}</b>
                              </p>
                              <button
                                class="btn btn-primary"
                                onClick={() => claimTicket(ticket[4])}
                              >
                                Take Off Market
                              </button>
                            </li>
                            <br />
                          </div>
                        </div>
                      )
                  )}
                </div>

                <div id="action-center">


                  {selling_tix.map(
                    (ticket) =>
                      !ticket[5] && ( //confirmed already?
                        <div class="m-2">
                          <div class="card text-center mx-auto shadow p-3 mb-5">
                            <div>
                              <a href={`${server}/event/${ticket[3]}`}>
                                <i>{ticket[0]}</i>
                              </a>
                              <p>{ticket[8]}</p>
                            </div>
                            <p>
                              <i>Price:</i> $<b>{ticket[1]}</b>
                            </p>
                            <button
                              class="btn btn-success"
                              onClick={() => confirmTicket(ticket[4])}
                            >
                              Confirm Ticket
                            </button>
                            <button
                              class="btn btn-danger"
                              onClick={() => showReportModal(ticket[4])}
                            >
                              Report User
                            </button>

                            <div
                              class="modal"
                              id={"report_user" + ticket[4]}
                              style={{ display: "none" }}
                            >
                              <div class="card modal-body">
                                <h1 class="modal-body text-light">
                                  {" "}
                                  Are you sure you would like to report this
                                  user?
                                </h1>
                                <p class="text-light">
                                  Only report a user if they have not completed
                                  the venmo transaction.
                                </p>

                                <button
                                  type="submit"
                                  value="Submit"
                                  class="btn btn-danger"
                                  onClick={() =>
                                    reportUser(ticket[6], ticket[4])
                                  }
                                >
                                  Report User
                                </button>
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  onClick={() => hideReportModal(ticket[4])}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                  )}

                  <br></br>

                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
