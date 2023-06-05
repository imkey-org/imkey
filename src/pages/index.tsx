import { type NextPage } from "next";
import MainLayout from "@/components/Layout";
import React, { useRef } from "react";
import Hero from "@/components/main/Hero";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <MainLayout>
        <section id="home" className="hero relative bg-white pt-24 lg:pt-18 mb-20 h-full overflow-hidden">
          <Hero servicesRef={aboutRef} />
        </section>
        <section ref={aboutRef} id="aboutAndHistory" className="mt-28 mb-16 mx-6 md:mx-24 lg:mx-36">
        </section>
      </MainLayout>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data } = api.user.getAll.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );
//   console.log(data)

//   return (
//     <h1>dasd</h1>
//     // <div className="flex flex-col items-center justify-center gap-4">
//     //   <p className="text-center text-2xl text-white">
//     //     {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//     //     {secretMessage && <span> - {secretMessage}</span>}
//     //   </p>
//     //   <button
//     //     className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//     //     onClick={sessionData ? () => void signOut() : () => void signIn()}
//     //   >
//     //     {sessionData ? "Sign out" : "Sign in"}
//     //   </button>
//     // </div>
//   );
// };
