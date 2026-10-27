const crypto = require("node:crypto");
const { promisify } = require("node:util");
const { userSchema } = require("../validation/userSchema");

const scrypt = promisify(crypto.scrypt);

global.users = global.users || [];
global.user_id = global.user_id || null;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedPassword) {
  if (typeof storedPassword !== "string") return false;

  const parts = storedPassword.split(":");
  if (parts.length !== 2) return false;

  const [salt, storedHash] = parts;

  if (!/^[0-9a-f]+$/i.test(salt) || !/^[0-9a-f]{128}$/i.test(storedHash)) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, 64);
  const expected = Buffer.from(storedHash, "hex");

  return expected.length === derivedKey.length &&
    crypto.timingSafeEqual(expected, derivedKey);
}

function publicUser(user) {
  return { name: user.name, email: user.email };
}

async function register(req, res) {
  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Invalid user data" });
  }

  const { name, email, password } = value;

  if (global.users.some((user) => user.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }

  try {
    const user = {
      name,
      email,
      hashedPassword: await hashPassword(password),
    };

    global.users.push(user);
    global.user_id = user;

    return res.status(201).json(publicUser(user));
  } catch (err) {
    return res.status(500).json({ message: "Unable to register user" });
  }
}

async function logon(req, res) {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password = req.body?.password;

  if (!email || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = global.users.find((item) => item.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  try {
    const passwordMatches = await verifyPassword(
      password,
      user.hashedPassword
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    global.user_id = user;

    return res.status(200).json(publicUser(user));
  } catch (err) {
    return res.status(500).json({ message: "Unable to log on" });
  }
}

function logoff(req, res) {
  global.user_id = null;

  return res.status(200).json({
    message: "Logged off successfully",
  });
}

module.exports = {
  register,
  logon,
  logoff,
};
