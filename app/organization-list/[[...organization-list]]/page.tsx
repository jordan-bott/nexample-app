// import { OrganizationList } from "@clerk/nextjs";

// export default function OrganizationListPage() {
//   return (
//     <div className="flex w-screen h-[calc(100vh-3.75rem)] place-content-center items-center">
//       <OrganizationList />
//     </div>
//   );
// }

"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import CreateOrganization from "../../components/CreateOrganization"; // See https://clerk.com/docs/guides/development/custom-flows/organizations/create-organizations for this component

// List user's organization memberships
export default function OrganizationSwitcher() {
  // const { isLoaded, setActive, userMemberships } = useOrganizationList({
  //   userMemberships: {
  //     // Set pagination parameters
  //     pageSize: 5,
  //     keepPreviousData: true,
  //   },
  // });

  const { userMemberships, isLoaded, setActive } = useOrganizationList({
    userMemberships: { pageSize: 25 },
  });
  const { orgId } = useAuth();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-black">Joined organizations</h1>
      {userMemberships?.data?.length > 0 && (
        <>
          <table className="text-black ">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Organization</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Set as active org</th>
              </tr>
            </thead>
            <tbody>
              {userMemberships?.data?.map((mem) => (
                <tr key={mem.id}>
                  <td>{mem.publicUserData.identifier}</td>
                  <td>{mem.organization.name}</td>
                  <td>{mem.createdAt.toLocaleDateString()}</td>
                  <td>{mem.role}</td>
                  <td>
                    {orgId === mem.organization.id ? (
                      <button
                        onClick={() =>
                          setActive({ organization: mem.organization.id })
                        }
                      >
                        Set as active
                      </button>
                    ) : (
                      <p>Currently active</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button
              disabled={
                !userMemberships?.hasPreviousPage || userMemberships?.isFetching
              }
              onClick={() => userMemberships?.fetchPrevious?.()}
            >
              Previous
            </button>

            <button
              disabled={
                !userMemberships?.hasNextPage || userMemberships?.isFetching
              }
              onClick={() => userMemberships?.fetchNext?.()}
            >
              Next
            </button>
          </div>
        </>
      )}
      {userMemberships?.data?.length === 0 && (
        <div>
          <p>No organizations found</p>
          <CreateOrganization />
        </div>
      )}
    </>
  );
}
