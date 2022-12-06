import React, { useState } from 'react';
import { Component } from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';
import axios from "axios";
import Image from "next/image";

const Signup = () => {
  const [signupError, setSignupError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNum, setPhoneNumber] = useState('');
  const [venmo, setVenmo] = useState('');
  const [uploadedPic, setUploadedProfPic] = useState('');
  const [profPic, setProfPic] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const BUCKET_URL = "https://partyticketsimages.s3.us-east-2.amazonaws.com/";

  function checkPW(e) {
    //e.preventDefault();
    if (document.getElementById('password').value ==
      document.getElementById('confirm_password').value) {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').innerHTML = 'matching';
    } else {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').innerHTML = 'not matching';
    }
  }

  const handleChange = (event) => {
    if (!event.target.files[0]) {
      alert("no profile picture was selected");
      return;
    }
    setUploadedProfPic(event.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault(); // tells user agent that if the event (hitting submit) does not get handled, this action (fetching) should not be taken 
    if (!uploadedPic) {
      alert("No profile picture was selected!");
      return;
    }
    fetch('/api/s3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        name: uploadedPic.name,
        type: uploadedPic.type,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then(async (data) => {
        console.log("DATA!: " + JSON.stringify(data));
        const url = data.url;
        let { data: newData } = await axios.put(url, uploadedPic, {
          headers: {
            "Content-type": uploadedPic.type,
            "Access-Control-Allow-Origin": "*",
          },
        });

        setProfPic(BUCKET_URL + uploadedPic.name);

        fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            phoneNum,
            venmo,
            profPic
          }),
        })
          .then((r) => {
            return r.json();
          })
          .then((data) => {
            console.log("logging data: " + data);
            if (data && data.error) {
              console.log("!!!!error w data!!!!!")
              setSignupError(data.message);
            }
            if (data && data.token) {
              console.log("!!!!!good data!!!!")
              //set cookie
              cookie.set('token', data.token, { expires: 2 }); // sets the cookie from the token obtained and sets its expiration for days having the cookie set, whenever
              Router.push('/');                              //   additional requests are made, that cookie is sent to the server as well and then we can decrypt it 
              //   and review if the user has been properly authenticated and that the auth is valid
            }
          });
      });
  }
  return (
    <>
      <div class="bg-image">
        <div style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh"
        }}>
          <Image
            src="/homebackground3.webp"
            alt="Party Picture"
            layout="fill"
            objectFit='cover'
          />
        </div>
      </div>
      <h1 class="py-4 text-white">Signup</h1>
      <div class="container w-50 rounded bg-dark p-3 shadow">
      <h4 class="text-white mt-2">Please create an account by filling in the details below:</h4>
        <form align="center" onSubmit={handleSubmit}>
          <br></br>

          <label htmlFor="email" class="text-white">
            WUSTL email: &emsp;
            <br />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              required placeholder="johnDoe@wustl.edu"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              pattern="[a-z0-9._%+-]+@wustl.edu$"
            />
          </label>

          <br></br>
          <br></br>

          <label htmlFor="firstName" class="text-white">
            First Name: &emsp;
            <br />
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              name="firstName"
              type="firstName"
              required placeholder="John"
            />
          </label>

          <br></br>
          <br></br>

          <label htmlFor="lastName" class="text-white">
            Last Name: &emsp;
            <br />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              name="lastName"
              type="lastName"
              required placeholder="Doe"
            />
          </label>

          <br></br>
          <br></br>

          <label htmlFor="phoneNum" class="text-white">
            Phone Number: &emsp;
            <br />
            <input
              value={phoneNum}
              onChange={(e) => setPhoneNumber(e.target.value)}
              name="phoneNum"
              type="phoneNum"
              required placeholder="xxx xxx xxxx"
              pattern="[0-9]{10}"
            />
          </label>

          <br></br>
          <br></br>

          <label htmlFor="venmo" class="text-white">
            Venmo Username: &emsp;
            <br />
            <input
              value={venmo}
              onChange={(e) => setVenmo(e.target.value)}
              name="venmo"
              type="venmo"
              required placeholder="John_Doe"
            />
          </label>

          <br></br>
          <br></br>

          <label htmlFor="password" class="text-white">
            Password: &emsp;
            <br />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              id="password"
            />
          </label>

          <br></br>
          <br></br>

          <label class="text-white">Confirm Password: &emsp;
          <br />
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              onChange={(e) => checkPW(e.target.value)}
            />
            <span id='message'></span>
          </label>

          <br></br>
          <br></br>
          <label class="text-white"> Upload Profile Picture: &emsp; 
          <br/>
          
          <input type="file" onChange={handleChange}/>
          
          </label>
          <br></br>
          <br></br>

          <input type="submit" value="Submit &rarr;" class="btn btn-primary" />
          {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
        </form>
      </div>
    </>
  );
};

export default Signup;