
import React from 'react';
import { useProfileQuery } from '../../services/authApi';

const Profile: React.FC = () => {
  const { data, error, isLoading } = useProfileQuery();
  console.log(data);
  console.log("Error:", error);

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching profile</div>;
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">User Profile</h2>
      <div className="mt-4">
        <p>
          <strong>Email:</strong> {data?.email}
        </p>
        {/* Add more fields as necessary */}
      </div>
    </div>
  );
};

export default Profile;
