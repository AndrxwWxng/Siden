function ServerError() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column' 
    }}>
      <h1 style={{ fontSize: '2rem' }}>500 - Server Error</h1>
      <p>Something went wrong on the server. Please try again later.</p>
      <p>
        <a 
          href="/" 
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Go back to home
        </a>
      </p>
    </div>
  );
}

export default ServerError; 