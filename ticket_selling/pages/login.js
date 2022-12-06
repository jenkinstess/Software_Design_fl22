import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
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
          cookie.set('token', data.token, { expires: 2 });
          Router.push('/');
        }
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
      <h1 class="py-4 text-white">Login</h1>
      <div class="container w-50 rounded bg-dark p-3 shadow">
        <h4 class="text-white mt-2">Please enter your login credentials below:</h4>
        <form onSubmit={handleSubmit}>
          
          <br></br>
          <label htmlFor='email' class="text-white">
            Email: &emsp;
            <br />
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required placeholder="johnDoe@wustl.edu"
            />
          </label>
          <br></br>
          <br></br>
          <label htmlFor='password' class="text-white">
            Password: &emsp;
            <br />
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br></br>
          <br></br>
          <input type="submit" value="Submit &rarr;" class="btn btn-primary" />
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </form>
      </div>
    </>
  );
};

export default Login;