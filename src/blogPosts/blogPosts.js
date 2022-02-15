import express from "express";
import BlogPostsModel from "./blogPostsSchema.js";
import { basicAuthMiddleware } from "../auth/basicAuth.js";

const blogPostsRouter = express.Router();

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const blogPost = new BlogPostsModel(req.body);
    const { _id } = await blogPost.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error, "post error");
  }
});

blogPostsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get(
  "/:blogPostsId",
  basicAuthMiddleware,
  async (req, res, next) => {
    try {
      const blogPost = await BlogPostsModel.findById(req.params.blogPostsId);
      if (blogPost) {
        res.send(blogPost);
      } else {
        next(
          createHttpError(
            404,
            `blogPost with id ${req.params.blogPostsId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.put(
  "/:blogPostsId",
  basicAuthMiddleware,
  async (req, res, next) => {
    try {
      const blogPost = await BlogPostsModel.findByIdAndUpdate(
        req.params.blogPostsId
      );
      if (blogPost) {
        res.send(blogPost);
      } else {
        next(
          createHttpError(
            404,
            `blogPost with id ${req.params.blogPostsId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.delete(
  "/:blogPostsId",
  basicAuthMiddleware,
  async (req, res, next) => {
    try {
      const blogPost = await BlogPostsModel.findByIdAndDelete(
        req.params.blogPostsId
      );
      if (blogPost) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `blogPost with id ${req.params.blogPostsId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostsRouter;
