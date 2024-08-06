import  { useEffect, useState } from 'react';
import { getProfile, refreshToken } from '../api';
import { AxiosError } from 'axios';


interface ProfileData {
 name: string;
 email: string;

}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          try {
            await refreshToken();
            const { data } = await getProfile();
            setProfile(data.data);
          } catch (refreshErr: unknown) {
            if (refreshErr instanceof AxiosError) {
              alert('Session expired, please login again');
            }
          }
        } else {
          alert('Error fetching profile');
        }
      }
    };

    fetchProfile();
  }, []);

  return profile ? (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Profile;