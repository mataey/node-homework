const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

global.tasks = global.tasks || [];

function validId(id) {
  return typeof id === "string" && /^\d+$/.test(id) && Number(id) > 0;
}

function ownedTask(task, user) {
  return task.userId === user.email;
}

function publicTask(task) {
  return {
    id: task.id,
    title: task.title,
    isCompleted: task.isCompleted,
  };
}

async function create(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { error, value } = taskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  const nextId =
    global.tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) +
    1;

  const task = {
    id: nextId,
    title: value.title,
    isCompleted: value.isCompleted,
    userId: global.user_id.email,
  };

  global.tasks.push(task);

  return res.status(201).json(publicTask(task));
}

async function index(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tasks = global.tasks.filter((task) =>
    ownedTask(task, global.user_id)
  );

  if (tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  return res.status(200).json(tasks.map(publicTask));
}

async function show(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  if (!validId(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = global.tasks.find(
    (item) => Number(item.id) === Number(id) &&
      ownedTask(item, global.user_id)
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json(publicTask(task));
}

async function update(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  if (!validId(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const { error, value } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  const task = global.tasks.find(
    (item) => Number(item.id) === Number(id) &&
      ownedTask(item, global.user_id)
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (value.title !== undefined) task.title = value.title;
  if (value.isCompleted !== undefined) {
    task.isCompleted = value.isCompleted;
  }

  return res.status(200).json(publicTask(task));
}

async function deleteTask(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  if (!validId(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const taskIndex = global.tasks.findIndex(
    (item) => Number(item.id) === Number(id) &&
      ownedTask(item, global.user_id)
  );

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  global.tasks.splice(taskIndex, 1);

  return res.status(200).json({ message: "Task deleted successfully" });
}

module.exports = {
  index,
  show,
  create,
  update,
  deleteTask,
};
