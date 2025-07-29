import { useAuthContext } from "../context/useAuth";

const Profile = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1 className="text-xl font-bold">Your Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default Profile;
