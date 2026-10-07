import React from "react";
import { Container, Header, Footer } from "../../components";
import { getBlogData, getUserData } from "../../utils";
import { BlogList } from "../../components/blog";
import Pagination, { paginate } from "../../components/pagination";

function TagView({ blogData, profileData, pagination, errors }) {
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

TagView.getInitialProps = async ({ query: { tag, page } }) => {
  const [blogTag] = tag;
  try {
    const [blogData, profileData] = await Promise.all([
      getBlogData(blogTag),
      getUserData()
    ]);
    const pg = paginate((blogData || []).reverse(), page);
    return {
      blogData: pg.posts,
      profileData: profileData || null,
      pagination: { curr: pg.curr, total: pg.total }
    };
  } catch (error) {
    console.log(error);
    return {
      blogData: [],
      profileData: null,
      pagination: { curr: 1, total: 1 },
      errors: error.errors
    };
  }
};

export default TagView;
