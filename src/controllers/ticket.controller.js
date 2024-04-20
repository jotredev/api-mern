import { Types } from "mongoose";

import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import { TicketEmail } from "../emails/ticket.email.js";

export class TicketController {
  static createTicket = async (req, res) => {
    try {
      const { user } = req;

      const { title, shortDescription, description, category } = req.body;

      if (!title || !shortDescription || !description || !category) {
        return res.status(400).json({
          response: "error",
          message: "Todos los datos son obligatorios",
        });
      }

      const ticket = new Ticket({
        title,
        shortDescription,
        description,
        category,
        createdBy: user._id,
      });

      const savedTicket = await ticket.save();

      // Obtenemos el ticket con los datos del creador
      const ticketWithCreatedBy = await Ticket.findById(
        savedTicket._id
      ).populate({
        path: "createdBy",
        model: "User",
        select: "-password -__v -updatedAt -isActive -isConfirmed",
      });

      // Obtenemos los usuarios que tengan el permiso de soporte
      const usersSupport = await User.find({ permissions: { $in: "support" } });

      // Enviamos el email a todos los usuarios que tengan el permiso de soporte
      if (usersSupport) {
        usersSupport.map(async (support) => {
          await TicketEmail.createTicket({
            ticketId: savedTicket._id,
            name: ticketWithCreatedBy.createdBy.name,
            email: support.email,
            description: savedTicket.description,
          });
        });
      }

      res
        .status(202)
        .json({ response: "success", message: "Ticket creado", ticket });
    } catch (error) {
      console.log("[ERROR_CREATE_TICKET]", error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static getAllTickets = async (req, res) => {
    try {
      const { user } = req;

      let tickets = [];

      if (!user.permissions.includes("support")) {
        tickets = await Ticket.find({ createdBy: user._id })
          .populate({
            path: "createdBy",
            model: "User",
            select: "-password -__v -updatedAt -isActive -isConfirmed",
          })
          .sort({ createdAt: "desc" });
      } else {
        tickets = await Ticket.find()
          .populate({
            path: "createdBy",
            model: "User",
            select: "-password -__v -updatedAt -isActive -isConfirmed",
          })
          .sort({ createdAt: "desc" });
      }

      res.status(200).json(tickets);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static getTicketById = async (req, res) => {
    try {
      const { ticketId } = req.params;

      if (!Types.ObjectId.isValid(ticketId)) {
        return res
          .status(404)
          .json({ response: "error", message: "ID no válido" });
      }

      const ticket = await Ticket.findById(ticketId)
        .populate({
          path: "createdBy",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        })
        .populate({
          path: "assignedTo",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        });

      if (!ticket) {
        return res
          .status(404)
          .json({ response: "error", message: "Ticket no encontrado" });
      }

      res.status(200).json(ticket);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static updateTicket = async (req, res) => {
    try {
      const { user } = req;
      const { ticketId } = req.params;

      if (!Types.ObjectId.isValid(ticketId)) {
        return res
          .status(404)
          .json({ response: "error", message: "ID no válido" });
      }

      const ticket = await Ticket.findById(ticketId).populate({
        path: "createdBy",
        model: "User",
        select: "-password -__v -updatedAt -isActive -isConfirmed",
      });

      if (!ticket) {
        return res
          .status(404)
          .json({ response: "error", message: "Ticket no encontrado" });
      }

      if (user._id.toString() !== ticket.createdBy._id.toString()) {
        return res
          .status(409)
          .json({ response: "error", message: "Sin autorización" });
      }

      const { title, shortDescription, description, category } = req.body;

      ticket.title = title || ticket.title;
      ticket.shortDescription = shortDescription || ticket.shortDescription;
      ticket.description = description || ticket.description;
      ticket.category = category || ticket.category;

      const savedTicket = await ticket.save();

      res.status(200).json({
        response: "success",
        message: "Ticket actualizado",
        ticket: savedTicket,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static deleteTicket = async (req, res) => {
    try {
      const { user } = req;
      const { ticketId } = req.params;

      if (!Types.ObjectId.isValid(ticketId)) {
        return res
          .status(404)
          .json({ response: "error", message: "ID no válido" });
      }

      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        return res
          .status(404)
          .json({ response: "error", message: "Ticket no encontrado" });
      }

      if (user._id.toString() !== ticket.createdBy._id.toString()) {
        return res
          .status(409)
          .json({ response: "error", message: "Sin autorización" });
      }

      await ticket.deleteOne();

      res
        .status(200)
        .json({ response: "success", message: "Ticket eliminado" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static assignUserSupport = async (req, res) => {
    try {
      const { user } = req;
      const { ticketId } = req.params;

      // Validamos que el usuario tengo el permiso de support
      if (!user.permissions.includes("support")) {
        return res
          .status(401)
          .json({ response: "error", message: "Sin autorización" });
      }

      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        return res
          .status(404)
          .json({ response: "error", message: "Ticket no encontrado" });
      }

      // Asignar ticket
      ticket.assignedTo = user._id;

      // Guardar ticket
      await ticket.save();

      // Traer ticket con información del creador y a quien esta asignado
      const ticketWithAssigned = await Ticket.findById(ticketId)
        .populate({
          path: "createdBy",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        })
        .populate({
          path: "assignedTo",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        });

      TicketEmail.assignedUserSupport({
        ticketId,
        title: ticket.title,
        nameUser: ticketWithAssigned.createdBy.name,
        nameUserSupport: ticketWithAssigned.assignedTo.name,
        email: ticketWithAssigned.createdBy.email,
      });

      res.status(200).json({
        response: "success",
        message: "Ticket asignado",
        ticket: ticketWithAssigned,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static ticketInProcess = async (req, res) => {
    try {
      const { user } = req;
      const { ticketId } = req.params;
      const { dueDate } = req.body;

      // Validamos que el usuario tengo el permiso de support
      if (!user.permissions.includes("support")) {
        return res
          .status(401)
          .json({ response: "error", message: "Sin autorización" });
      }

      const ticket = await Ticket.findById(ticketId)
        .populate({
          path: "createdBy",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        })
        .populate({
          path: "assignedTo",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        });

      if (!ticket) {
        return res
          .status(404)
          .json({ response: "error", message: "Ticket no encontrado" });
      }

      ticket.dueDate = dueDate;
      ticket.status = "inProcess";
      const savedTicket = await ticket.save();

      TicketEmail.ticketInProcess({
        ticketId,
        title: ticket.title,
        nameUser: ticket.createdBy.name,
        nameUserSupport: ticket.assignedTo.name,
        email: ticket.createdBy.email,
        dueDate: savedTicket.dueDate,
      });

      res.status(200).json({
        response: "success",
        message: "Ticket en proceso",
        ticket: savedTicket,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };

  static closeTicket = async (req, res) => {
    try {
      const { ticketId } = req.params;

      const ticket = await Ticket.findById(ticketId)
        .populate({
          path: "createdBy",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        })
        .populate({
          path: "assignedTo",
          model: "User",
          select: "-password -__v -updatedAt -isActive -isConfirmed",
        });

      if (!ticket) {
        return res
          .status(404)
          .json({ response: "error", message: "Ticket no encontrado" });
      }

      ticket.status = "completed";
      const savedTicket = await ticket.save();

      TicketEmail.closeTicket({
        ticketId,
        title: ticket.title,
        nameUser: ticket.createdBy.name,
        nameUserSupport: ticket.assignedTo.name,
        email: ticket.createdBy.email,
      });

      res.status(200).json({
        response: "success",
        message: "Ticket cerrado",
        ticket: savedTicket,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "error", message: "Error del servidor" });
    }
  };
}
