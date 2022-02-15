import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const BlogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
);

BlogPostsSchema.pre("save", async function (next) {
  const newBlogPots = this;
  const plainPW = newBlogPots.password;

  if (newBlogPots.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10);
    newBlogPots.password = hash;
  }

  next();
});

BlogPostsSchema.statics.checkCredentials = async function (email, plainPW) {
  const newBlogPots = await this.findOne({ email });

  if (newBlogPots) {
    const isMatch = await bcrypt.compare(plainPW, newBlogPots.password);
    if (isMatch) {
      return newBlogPots;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default model("BlogPosts", BlogPostsSchema);
