import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Router from 'next/router';

// import UserContext from '../components/UserContext';
const db = require('/config/database');
//test db
// db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log("Error: " + err))


function Home() {
  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  },{refreshInterval:10});
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
    // localStorage.setItem('email', data.email);
    // localStorage.setItem('loggedIn', loggedIn);
  }
  
  return (
    <div>
      <Head>
        <title>WashU Party Tix!</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>WashU Party Tix</h1>
      {loggedIn && (
        <>
          <p>Welcome <i>{data.email}!</i></p>
          <button
            onClick={() => {
              cookie.remove('token');
              Router.push("/")
              revalidate;
            }}>
            Logout
          </button>
          
          <br /><br />
        </>
      )}
    </div>
  );
  
 }
 
export default Home;
