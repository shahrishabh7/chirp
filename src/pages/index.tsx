import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();
  const { data } = api.posts.getAll.useQuery();
  console.log(data)

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div>
            {!user.isSignedIn && (<SignInButton/>)}
            {!!user.isSignedIn && (<SignOutButton/>)}
          </div>
          <div>
            {data?.map((post) => (<div key={post.id}>{post.content}</div>))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
