import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import Image from "next/image";
import { PageLayout } from "~/components/layout";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserbyUsername.useQuery({
    username,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.imageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -m-8 ml-4 -mb-[64px] rounded-full border-4 border-black"
          ></Image>
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No slug");
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserbyUsername.prefetch({ username });

  return {
    props: {
      trpcState: JSON.stringify(ssg.dehydrate()),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
