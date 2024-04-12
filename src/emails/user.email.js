import { transporter } from '../config/nodemail.config.js';

export class UserEmail {
  static confirmAccount = async ({ name, email, token }) => {
    try {
      await transporter.sendMail({
        from: 'MERN STACK <noreply@mern.com>',
        to: email,
        subject: 'Confirmar cuenta',
        text: 'Confirmar cuenta',
        html: `<div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 1rem; font-family: sans-serif;">
        <h1 style="text-align: center; color: #000; font-size: 2rem; font-weight: 700;">Bienvenido a MERN STACK</h1>
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Hola <span style="font-weight: bold;">${name}</span>, gracias por registrarte en MERN STACK, para confirmar tu cuenta, por favor ingresa al siguiente enlace <a href="#" style="text-decoration: none; color: #000; font-weight: bold;">confirmar cuenta</a> y escribe el código de confirmación:</p>
        <h2 style="text-align: center; color: #000; font-size: 2rem; font-weight: 700;">${token}</h2>  
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Si no has sido tú quien se ha registrado en MERN STACK, por favor ignora este correo.</p>
        <p style="text-align: center; color: #000; font-size: 1.2rem; font-weight: 400;">Saludos, MERN STACK.</p>
    </div>`,
      });
    } catch (error) {
      console.log(`[ERROR_EMAIL_CONFIRM_ACCOUNT]: ${error}`);
    }
  };
}
