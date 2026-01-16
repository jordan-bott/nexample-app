import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationListPage() {
  return (
    <div className="flex w-screen h-[calc(100vh-3.75rem)] place-content-center items-center">
      <OrganizationList />
    </div>
  );
}
