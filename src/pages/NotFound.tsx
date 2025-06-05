import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="flex justify-center px-4 pt-44">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="pb-4">Oops! Looks like this page doesn’t exist.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;