import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      company: req.user.company._id,
      createdBy: req.user._id,
    });

    await ticket.populate("createdBy", "name email role");

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const listTickets = async (req, res) => {
  try {
    const { status, priority, assignedTo, page = 1, limit = 20 } = req.query;

    const filter = { company: req.user.company._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Ticket.countDocuments(filter),
    ]);

    res.json({
      tickets,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: req.user.company._id,
    })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Chamado não encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { status, priority, category, assignedTo, title, description } =
      req.body;

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: req.user.company._id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Chamado não encontrado" });
    }

    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (status !== undefined) ticket.status = status;
    if (priority !== undefined) ticket.priority = priority;
    if (category !== undefined) ticket.category = category;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

    await ticket.save();

    await ticket.populate("createdBy", "name email role");
    await ticket.populate("assignedTo", "name email role");

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { body } = req.body;

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: req.user.company._id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Chamado não encontrado" });
    }

    ticket.comments.push({ author: req.user._id, body });
    await ticket.save();

    await ticket.populate("comments.author", "name email role");

    const newComment = ticket.comments[ticket.comments.length - 1];

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: req.user.company._id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Chamado não encontrado" });
    }

    await ticket.deleteOne();

    res.json({ message: "Chamado removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
