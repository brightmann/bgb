import React from "react";
import { withRouter } from "next/router";
import { Container, Header, Footer } from "../components";
import { BlogList } from "../components/blog";
import Pagination, { paginate } from "../components/pagination";
import { getBlogData, getUserData } from "../utils";
import Swal from "sweetalert2";

function Blog({ blogData, profileData, pagination, errors, router: { query } }) {
  React.useEffect(() => {
    if (query.notFound) {
      Swal.fire({
        title: "Error",
        text: "Article Not Found",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
      });
      window.history.replaceState(null, null, window.location.pathname);
    }
  });
  return (
    <React.Fragment>
      <Header profile={profileData} />
      <Container>
        <BlogList data={blogData} />
        <Pagination curr={pagination.curr} total={pagination.total} />
        <Footer />
      </Container>
    </React.Fragment>
  );
}

export const getServerSideProps = async ({ query }) => {
  try {
    const [blogData, profileData] = await Promise.all([
      getBlogData(),
      getUserData(),
    ]);

    const pg = paginate((blogData || []).reverse(), query.page);
    return {
      props: {
        blogData: pg.posts,
        profileData: profileData || null,
        pagination: { curr: pg.curr, total: pg.total },
      },
    };
  } catch (error) {
    console.error("getServerSideProps failed:", error);
    return {
      props: {
        blogData: [],
        profileData: null,
        pagination: { curr: 1, total: 1 },
      },
    };
  }
};

export default withRouter(Blog);
