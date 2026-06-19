import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerCompany = async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    const slug = companyName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const existingCompany = await Company.findOne({ slug });
    if (existingCompany) {
      return res.status(400).json({ message: "Empresa já cadastrada" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const company = await Company.create({ name: companyName, slug });

    const user = await User.create({
      name,
      email,
      password,
      role: "super_admin",
      company: company._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: { _id: company._id, name: company.name, slug: company.slug },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, active: true }).populate(
      "company",
      "name slug active",
    );

    if (!user || !user.company.active) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
