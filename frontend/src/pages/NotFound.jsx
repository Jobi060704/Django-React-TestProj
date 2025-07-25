function NotFound() {
    return (
        <div style={{
            textAlign: 'center',
            padding: '50px',
            fontFamily: 'Arial, sans-serif',
            color: '#555'
        }}>
            <h1 style={{ fontSize: '5rem', marginBottom: '10px' }}>404</h1>
            <h2>Oops! Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none'
            }}>Go Home</a>
        </div>
    );
}

export default NotFound;