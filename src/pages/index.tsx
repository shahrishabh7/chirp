import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <img className="h-14 w-14 rounded-full" src={user.imageUrl}></img>
      <input
        className="grow bg-transparent outline-none"
        placeholder="Type some emojis!"
      ></input>
    </div>
  );
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;

  return (
    <div className="flex gap-3 border-b border-slate-400 p-4" key={post.id}>
      <img className="h-14 w-14 rounded-full" src={author?.profile_img} />
      <div className="flex flex-col">
        <div className="flex text-slate-400">
          <span>{`@${author?.username} `}</span>
          <span className="font-thin">{`- ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {data.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
