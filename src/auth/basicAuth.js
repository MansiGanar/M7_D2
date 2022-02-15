import BlogPostsModel from "../blogPosts/blogPostsSchema.js";
import atob from "atob";

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      console.log(error, "Please provide credentials in authorization header!")
    );
  } else {
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const decodedCredentials = atob(base64Credentials);

    const [email, password] = decodedCredentials.split(":");

    const blogPosts = await BlogPostsModel.checkCredentials(email, password);

    if (blogPosts) {
      req.blogPosts = blogPosts;
      next();
    } else {
      console.log(error, " Credentials are not ok");
    }
  }
};
