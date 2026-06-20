import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles =
      req.user.role === "super_admin" ? ["admin", "agent"] : ["agent"];

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "Você não pode criar usuários com esse papel" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      company: req.user.company._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      company: req.user.company,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company._id })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, role, active } = req.body;

    const target = await User.findOne({
      _id: req.params.id,
      company: req.user.company._id,
    });

    if (!target) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (target.role === "super_admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    if (name !== undefined) target.name = name;
    if (active !== undefined) target.active = active;
    if (role !== undefined) {
      const allowedRoles =
        req.user.role === "super_admin" ? ["admin", "agent"] : ["agent"];
      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({ message: "Você não pode atribuir esse papel" });
      }
      target.role = role;
    }

    await target.save();

    res.json({
      _id: target._id,
      name: target.name,
      email: target.email,
      role: target.role,
      active: target.active,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const target = await User.findOne({
      _id: req.params.id,
      company: req.user.company._id,
    });

    if (!target) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (target.role === "super_admin") {
      return res
        .status(403)
        .json({ message: "Não é possível remover o super_admin" });
    }

    target.active = false;
    await target.save();

    res.json({ message: "Usuário desativado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
