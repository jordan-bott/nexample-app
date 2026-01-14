import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return (
    <div className="flex w-screen h-[calc(100vh-3.75rem)] place-content-center items-center">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
