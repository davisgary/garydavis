import Donut from '../components/Donut';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="relative flex justify-center px-4 pt-44 min-h-screen">
      <Donut />
      <div className="relative z-10 max-w-md text-center space-y-4">
        <h1 className="text-5xl font-bold">D'oh! 404</h1>
        <p className="text-xl pb-3">Looks like we landed on a big donut.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-muted transition"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;