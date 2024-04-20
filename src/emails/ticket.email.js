import { transporter } from "../config/nodemail.config.js";

export class TicketEmail {
  static createTicket = async ({ ticketId, name, email, description }) => {
    try {
      await transporter.sendMail({
        from: "MERN STACK <noreply@mern.com>",
        to: email,
        subject: "Nuevo ticket",
        text: "Nuevo ticket",
        html: `<div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 1rem; font-family: sans-serif;">
        <h1 style="text-align: center; color: #000; font-size: 2rem; font-weight: 700;">Nuevo ticket</h1>
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Hay nuevo ticket creado por <span style="font-weight: bold;">${name}</span>, ingresa a ticket para más información <a href="${process.env.CLIENT_URL}/tickets/${ticketId}" style="text-decoration: none; color: #000; font-weight: bold;">aquí</a>.</p>
        <div style="max-width: 100%; padding: 16px;">
          ${description}
        </div> 
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Saludos, MERN STACK.</p>
    </div>`,
      });
    } catch (error) {
      console.log(`[ERROR_EMAIL_CREATE_TICKET]: ${error}`);
    }
  };

  static assignedUserSupport = async ({
    ticketId,
    title,
    nameUser,
    nameUserSupport,
    email,
  }) => {
    try {
      await transporter.sendMail({
        from: "MERN STACK <noreply@mern.com>",
        to: email,
        subject: "Ticket asignado",
        text: "Ticket asignado",
        html: `<div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 1rem; font-family: sans-serif;">
        <h1 style="text-align: center; color: #000; font-size: 2rem; font-weight: 700;">Ticket asignado</h1>
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Hola <span style="font-weight: bold;">${nameUser}</span>, tu ticket ${title} ha sido asignado al técnico <strong>${nameUserSupport}</strong> ingresa a tu ticket para más información <a href="${process.env.CLIENT_URL}/tickets/${ticketId}" style="text-decoration: none; color: #000; font-weight: bold;">aquí</a>.</p> 
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Saludos, MERN STACK.</p>
    </div>`,
      });
    } catch (error) {
      console.log(`[ERROR_EMAIL_ASSIGNED_USER_SUPPORT]: ${error}`);
    }
  };

  static ticketInProcess = async ({
    ticketId,
    title,
    nameUser,
    nameUserSupport,
    email,
    dueDate,
  }) => {
    const date =
      dueDate.getDate() +
      "-" +
      (dueDate.getMonth() + 1) +
      "-" +
      dueDate.getFullYear();

    try {
      await transporter.sendMail({
        from: "MERN STACK <noreply@mern.com>",
        to: email,
        subject: "Ticket en proceso",
        text: "Ticket en proceso",
        html: `<div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 1rem; font-family: sans-serif;">
        <h1 style="text-align: center; color: #000; font-size: 2rem; font-weight: 700;">Ticket en proceso</h1>
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Hola <span style="font-weight: bold;">${nameUser}</span>, tu ticket ${title} que fue asignado al técnico <strong>${nameUserSupport}</strong>, ha pasado al estatus de "En Proceso" con una fecha compromiso al día <strong>${date}</strong>, ingresa a tu ticket para más información <a href="${process.env.CLIENT_URL}/tickets/${ticketId}" style="text-decoration: none; color: #000; font-weight: bold;">aquí</a>.</p> 
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Saludos, MERN STACK.</p>
    </div>`,
      });
    } catch (error) {
      console.log(`[ERROR_EMAIL_TICKET_IN_PROCESS]: ${error}`);
    }
  };

  static closeTicket = async ({
    ticketId,
    title,
    nameUser,
    nameUserSupport,
    email,
  }) => {
    try {
      await transporter.sendMail({
        from: "MERN STACK <noreply@mern.com>",
        to: email,
        subject: "Ticket cerrado",
        text: "Ticket cerrado",
        html: `<div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 1rem; font-family: sans-serif;">
        <h1 style="text-align: center; color: #000; font-size: 2rem; font-weight: 700;">Ticket cerrado</h1>
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Hola <span style="font-weight: bold;">${nameUser}</span>, tu ticket ${title} que fue asignado al técnico <strong>${nameUserSupport}</strong>, se ha cerrado correctamente, ingresa a tu ticket para más información <a href="${process.env.CLIENT_URL}/tickets/${ticketId}" style="text-decoration: none; color: #000; font-weight: bold;">aquí</a>.</p> 
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Saludos, MERN STACK.</p>
    </div>`,
      });
    } catch (error) {
      console.log(`[ERROR_EMAIL_CLOSE_TICKET]: ${error}`);
    }
  };
}
