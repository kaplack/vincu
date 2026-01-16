const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Business } = require("../models");

/**
 * Helper to sign JWT
 */
function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign(
    {
      userId: user.id,
      businessId: user.businessId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/register
 * Body: { businessName, fullName, email, password }
 */
exports.register = async (req, res) => {
  try {
    const { businessName, fullName, email, password } = req.body;

    console.log("Register payload:", req.body);

    if (!businessName || !fullName || !email || !password) {
      return res.status(400).json({
        message: "businessName, fullName, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 1️⃣ Create business
    const business = await Business.create({
      name: businessName.trim(),
    });

    // 2️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3️⃣ Create user (owner)
    const user = await User.create({
      businessId: business.id,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        businessId: user.businessId,
        businessName: business.name,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      where: { email: normalizedEmail },
      include: [{ model: Business }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        businessId: user.businessId,
        businessName: user.Business?.name || null,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/auth/me
 */
exports.me = async (req, res) => {
  const { userId, businessId } = req.user;
  const user = await User.findByPk(userId, { include: [{ model: Business }] });
  if (!user || user.businessId !== businessId) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    businessId: user.businessId,
    businessName: user.Business?.name || null,
  });
};
