import "../styles/NotFound.css";

function NotFound() {
    return (
        <div className="notfound-page">
            <div className="notfound-box">
                <h1 className="notfound-title">404</h1>
                <h2 className="notfound-subtitle">Oops! Page Not Found</h2>
                <p className="notfound-text">The page you're looking for doesn't exist.</p>
                <a href="/" className="notfound-link">Go Home</a>
            </div>
        </div>
    );
}

export default NotFound;
