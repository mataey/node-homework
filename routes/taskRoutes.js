const express = require("express");
const {
  index,
  show,
  create,
  update,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", create);
router.get("/", index);
router.get("/:id", show);
router.patch("/:id", update);
router.delete("/:id", deleteTask);

module.exports = router;
