import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/helpers/ssgHelper";
import { PostView } from "~/components/postview";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getById.useQuery({
    id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data}></PostView>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("No id");
  }

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: JSON.stringify(ssg.dehydrate()),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
