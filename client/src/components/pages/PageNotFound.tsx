import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PageNotFound = () => {

 useEffect(() => {
  toast.error('404 - Page Not Found!', {
    autoClose: 3000, 
  });
}, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
      <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200">
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
