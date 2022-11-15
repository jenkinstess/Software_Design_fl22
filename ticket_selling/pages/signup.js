import React, {useState} from 'react';
import {Component} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

const Signup = () => {
    const [signupError, setSignupError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNum, setPhoneNumber] = useState('');
    const [venmo, setVenmo] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
    function handleSubmit(e) {
      e.preventDefault(); // tells user agent that if the event (hitting submit) does not get handled, this action (fetching) should not be taken 
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
          venmo
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
            cookie.set('token', data.token, {expires: 2}); // sets the cookie from the token obtained and sets its expiration for days having the cookie set, whenever
            Router.push('/');                              //   additional requests are made, that cookie is sent to the server as well and then we can decrypt it 
                                                           //   and review if the user has been properly authenticated and that the auth is valid
          }
        });
    }
    return (
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <br></br>
        
        <label htmlFor="email">
          Email: &emsp;
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            required placeholder="johnDoe@gmail.com"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </label>
  
        <br></br>
        <br></br>

        <label htmlFor="firstName">
          First Name: &emsp;
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

        <label htmlFor="lastName">
          Last Name: &emsp;
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

        <label htmlFor="phoneNum">
          Phone Number: &emsp;
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

        <label htmlFor="venmo">
          Venmo Username: &emsp;
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
  
        <label htmlFor="password">
          Password: &emsp;
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
          />
        </label>
  
        
        <br></br>
        <br></br>
        <input type="submit" value="Submit" class="btn btn-primary"/>
        {signupError && <p style={{color: 'red'}}>{signupError}</p>}
      </form>
    );
  };
  
  export default Signup;