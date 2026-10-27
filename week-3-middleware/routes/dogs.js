import express from "express";
import dogData from "../dogData.js";

const router = express.Router();

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

router.get("/dogs", (req, res) => {
  res.json(dogData);
});

router.post("/adopt", (req, res, next) => {
  try {
    const { name, address, email, dogName } = req.body || {};

    if (!name || !email || !dogName) {
      throw new ValidationError("Missing required fields");
    }

    const dog = dogData.find(
      (d) => d.name === dogName && d.status === "available",
    );

    if (!dog) {
      throw new NotFoundError(`Dog "${dogName}" not found or not available`);
    }

    return res.status(201).json({
      message: `Adoption request received. We will contact you at ${email} for further details.`,
      application: {
        name,
        address,
        email,
        dogName,
        applicationId: Date.now(),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/error", (req, res, next) => {
  next(new Error("Test error"));
});

export default router;
