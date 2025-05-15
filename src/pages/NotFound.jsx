import '../app.css';

export default function NotFound() {
  return (
    <div className="flex-center min-height text-center">
      <div className="container">
        <h1 className="text-lg">404 - Page Not Found</h1>
        <p>Oops! Looks like this page doesn’t exist.</p>
        <a href="/" className="button text-sm">Go Back Home</a>
      </div>
    </div>
  );
}