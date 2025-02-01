import { Router } from "express";
import multer from "multer";
import blogController from "./blog.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../../enum/user";

const router: Router = Router();

const upload = multer({});

router
  .route("/")
  .get(blogController.getBlogs)
  .post(
    upload.fields([
      { name: "banner", maxCount: 1 },
      {
        name: "data",
        maxCount: 1,
      },
    ]),
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    blogController.createBlog
  );

router
  .route("/comments")
  .get(blogController.getComments)
  .post(auth(USER_ROLE.ADMIN, USER_ROLE.USER), blogController.createComment);
router
  .route("/replies")
  .get(blogController.getReplies)
  .post(auth(USER_ROLE.USER, USER_ROLE.ADMIN), blogController.createReply);

router
  .route("/categories")
  .get(blogController.getCategories)
  .post(blogController.createCategory);
router
  .route("/categories/:id")
  .get(blogController.getCategory)
  .patch(blogController.updateCategory)
  .delete(blogController.deleteCategory);

router.route("/comments/:id").delete(blogController.deleteComment);
router.route("/replies/:id").delete(blogController.deleteReply);

router
  .route("/:id")
  .get(blogController.getBlogById)
  .patch(
    upload.fields([
      { name: "banner", maxCount: 1 },
      {
        name: "data",
        maxCount: 1,
      },
    ]),
    blogController.updateBlog
  )
  .delete(blogController.deleteBlog);

export { router as blogsRoutes };
