import { useEffect, useState } from "react";
import { useProfileQuery } from "../../services/authApi";

interface ProfileData {
  email: string;
  name: string; 
}

const Profile = () => {
  const { data, isSuccess, error } = useProfileQuery("userProfile"); // Pass appropriate argument here
  const [user, setUser] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (data && isSuccess) {
      setUser(data.user); // Make sure 'data.user' corresponds to your API response structure
    }
  }, [data, isSuccess]);

  // Function to extract error message safely
  const getErrorMessage = () => {
    if (error) {
      if ("status" in error && "data" in error) {
        return `Error: ${error.status}`;
      } else if ("message" in error) {
        return error.message;
      } else if ("error" in error) {
        return error.error;
      }
    }
    return "An unknown error occurred.";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {error ? (
          <div className="text-red-500">{getErrorMessage()}</div>
        ) : user ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">{user.name}</h1>
            <h2 className="text-lg text-gray-600">{user.email}</h2>
          </>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
