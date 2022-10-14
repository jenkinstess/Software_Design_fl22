import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
// import Navbar from '../components/navbar'
const db = require('/config/database');
//test db
// db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log("Error: " + err))

 function Home() {
  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
    localStorage.setItem("loginoutcome", true);
  }
  else{
    localStorage.setItem("loginoutcome", false);
  }
  return (
    <div>
      <Head>
        <title>Welcome to landing page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>PARTY TICKETS</h1>
      {loggedIn && (
        <>
          <p>Welcome {data.email}!</p>
          <button
            onClick={() => {
              cookie.remove('token');
              revalidate();
            }}>
            Logout
          </button>
        </>
      )}
      {!loggedIn && (
        <>
          <Link href="/login">Login</Link>
          <p>or</p>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
 }
 
 function Navbar(){
   this.state = {
        loginoutcome: true
    };
    
       
    return (
        <div className = "Navbar">
                
            <Link href = "/">
                <a>Home</a>
            </Link>   
            {/* {console.log(localStorage.getItem("loginoutcome") === "true")} */}
            {/* {localStorage.getItem("loginoutcome") === "true" ? ( */}
                
            {localStorage.getItem("loginoutcome") === "true" ? (
                <>
                <Link href = "/profile"><a>Profile</a></Link> 
                <Link href = "/buy"><a>Buy</a></Link> 
                <Link href = "/sell"><a>Sell</a></Link> 
                </>
            ):(
        
                <>
                <Link href = "/login"><a>Login</a></Link>
                <Link href = "/signup"><a>Sign Up</a></Link>  
                </>
            )}
        </div>
    )
 }

export default Home;