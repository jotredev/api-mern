import express from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware.js";
import { TicketController } from "../../controllers/ticket.controller.js";

export const ticketRoutes = express.Router();

// Crear ticket
ticketRoutes.post("/", checkAuth, TicketController.createTicket);
// Obtener todos los tickets
ticketRoutes.post("/get-all", checkAuth, TicketController.getAllTickets);
// Obtener ticket por ID
ticketRoutes.get("/:ticketId", checkAuth, TicketController.getTicketById);
// Actualizar ticket
ticketRoutes.put("/:ticketId", checkAuth, TicketController.updateTicket);
// Eliminar ticket
ticketRoutes.delete("/:ticketId", checkAuth, TicketController.deleteTicket);
// Asignar tecnico de soporte
ticketRoutes.put(
  "/assign/:ticketId",
  checkAuth,
  TicketController.assignUserSupport
);
// Isertar fecha comprmiso y actualizar el status del ticket a inProcesss
ticketRoutes.put(
  "/in-process/:ticketId",
  checkAuth,
  TicketController.ticketInProcess
);
// Cerrar ticket
ticketRoutes.put(
  "/close-ticket/:ticketId",
  checkAuth,
  TicketController.closeTicket
);
// Contador de tickets
ticketRoutes.get("/count/total", checkAuth, TicketController.countTickets);
