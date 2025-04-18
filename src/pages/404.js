function NotFound() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column' 
    }}>
      <h1 style={{ fontSize: '2rem' }}>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
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

export default NotFound; 