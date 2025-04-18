function Error({ statusCode }) {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column' 
    }}>
      <h1 style={{ fontSize: '2rem' }}>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
}

export default Error; 