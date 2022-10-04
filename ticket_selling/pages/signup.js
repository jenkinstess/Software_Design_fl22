import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

const Signup = () => {
    const [signupError, setSignupError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNum, setPhoneNumber] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
    function handleSubmit(e) {
      e.preventDefault();
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
          phoneNum
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.error) {
            setSignupError(data.message);
          }
          if (data && data.token) {
            //set cookie
            cookie.set('token', data.token, {expires: 2});
            Router.push('/');
          }
        });
    }
    return (
      <form onSubmit={handleSubmit}>
        <p>Sign Up</p>
        <label htmlFor="email">
          email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
          />
        </label>
  
        <br />

        <label htmlFor="firstName">
          First Name
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            name="firstName"
            type="firstName"
          />
        </label>

        <br />

        <label htmlFor="lastName">
          Last Name
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            name="lastName"
            type="lastName"
          />
        </label>

        <br />

        <label htmlFor="phoneNum">
          Phone Number
          <input
            value={phoneNum}
            onChange={(e) => setPhoneNumber(e.target.value)}
            name="phoneNum"
            type="phoneNum"
          />
        </label>

        <br />
  
        <label for="password">
          password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
          />
        </label>
  
        <br />
  
        <input type="submit" value="Submit" />
        {signupError && <p style={{color: 'red'}}>{signupError}</p>}
      </form>
    );
  };
  
  export default Signup;