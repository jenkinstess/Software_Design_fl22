import React, {useState} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cookie from 'js-cookie';
//import UserContext from '../components/UserContext';
//import { providers, signIn, getSession, csrfToken } from "next-auth/client";

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //call api
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        console.log("logging data" + JSON.stringify(data));
        if (data && data.error) {
          setLoginError(data.message);
        }
        if (data && data.token) {
          //set cookie
          console.log("!!!!login redirect!!!!!")
          cookie.set('token', data.token, {expires: 2});
          Router.push('/');
        }
      });
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <br></br>
      <label htmlFor='email'>
        Email: &emsp;
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required placeholder="johnDoe@gmail.com"
        />
      </label>
      <br></br>
        <br></br>
      <label htmlFor='password'>
        Password: &emsp;
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br></br>
      <br></br>
      <input type="submit" value="Submit" class="btn btn-primary"/>
      {loginError && <p style={{color: 'red'}}>{loginError}</p>}
    </form>
  );
};

export default Login;