import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const buttonClasses =
    "bg-dark-green p-4 rounded-xl font-semibold text-sm w-40 text-center border-[1.25] border-light-green hover:scale-108 justify-self-center";
  return (
    <div className="">
      <main className="text-4xl font-thin">
        <div className="grid h-screen w-[40%] grid-cols-2 place-content-around gap-4 place-self-center">
          <SignedIn>
            <SignOutButton>
              <button className={buttonClasses}>Sign Out</button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link className={buttonClasses} href="/custom-flows/sign-in">
              Custom Sign In
            </Link>
            <Link className={buttonClasses} href="/custom-flows/sign-up">
              Custom Sign Up
            </Link>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
