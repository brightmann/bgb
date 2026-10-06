import config from "../config";

String.prototype.capitalizeWords = function () {
  return this.split(" ")
    .map(function (ele) {
      return ele[0].toUpperCase() + ele.slice(1).toLowerCase();
    })
    .join(" ");
};

const GET_BLOG = (label = "blog") => `
  {
    repository(owner: "${config.username}", name: "${config.repoName}") {
      issues(first: 100, states: OPEN, filterBy: { labels: "${label}", createdBy: "${config.username}" }) {
        nodes {
          title
          bodyText
          number
          labels(first: 100) {
            nodes {
              color
              name
              id
            }
          }
          updatedAt
          createdAt
          id
        }
      }
    }
  }
`;

const GET_SINGLE_BLOG = (number) => `
{
  repository(owner: "${config.username}", name: "${config.repoName}") {
    issue(number: ${number}){
      comments(first: 100) {
        totalCount
        nodes {
          author {
            login
            avatarUrl
          }
          body
          createdAt
          updatedAt
          lastEditedAt
          reactions(first: 100) {
            totalCount
            nodes {
              content
              user {
                login
              }
            }
          }
        }
      }
      title
      body
      bodyHTML
      url
      bodyText
      number
      bodyHTML
      labels(first: 100) {
        nodes {
          color
          name
          id
        }
      }
      updatedAt
      createdAt
      reactions(first: 100) {
        totalCount,
        nodes {
          content
          user {
            login
          }
        }
      }
    }
  }
}
`;

const GET_USER = `
{
  user(login: "${config.username}"){
    bio,
    name,
    email,
    url,
    avatarUrl,
    company,
    location,
    websiteUrl
  }
}
`;
// Native fetch (axios's Node http adapter doesn't run on Cloudflare Workers)
const graphql = async (query) => {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok || data.errors) {
    throw new Error((data.errors || [{ message: `GitHub API ${res.status}` }])[0].message);
  }
  return data.data;
};

const getBlogData = async (label = "blog") => {
  try {
    const data = await graphql(GET_BLOG(label.capitalizeWords()));
    return Promise.resolve(data?.repository?.issues?.nodes);
  } catch (err) {
    return Promise.reject({ error: err.message });
  }
};

const getUserData = async () => {
  try {
    const data = await graphql(GET_USER);
    return Promise.resolve(data?.user);
  } catch (err) {
    return Promise.reject({ error: err.message });
  }
};

const getSingleBlogData = async (number) => {
  try {
    const data = await graphql(GET_SINGLE_BLOG(number));
    return Promise.resolve(data?.repository?.issue);
  } catch (err) {
    return Promise.reject({ error: err.message });
  }
};

export { getBlogData, getUserData, getSingleBlogData };
