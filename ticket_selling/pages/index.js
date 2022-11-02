import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Navbar from '../components/navbar'
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
        <title>Party Tix !</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>PARTY TICKETS</h1>
      {loggedIn && (
        <>
          <p>Welcome {data.email}!</p>
          <button
            onClick={() => {
              cookie.remove('token');
              Router.push("/")
              revalidate;
            }}>
            Logout
          </button>
          
          <br /><br />
          <button onClick={() => Router.push('/sell')}>
            Sell Tickets!
          </button>
        </>
      )}
    </div>
  );
  
 }
 
export default Home;