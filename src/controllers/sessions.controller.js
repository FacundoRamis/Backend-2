import UsersRepository from "../repositories/users.repository.js";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.config.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const usersRepository = new UsersRepository();

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await usersRepository.getByEmail(email);
    if (existingUser) {
      return res.status(400).send({ error: "Usuario ya existe" });
    }

    const hashedPassword = createHash(password);

    const newUser = await usersRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "user"
    });

    res.send({ status: "success", message: "Usuario registrado" });

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usersRepository.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign(
      { email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperar contraseña</h2>
        <p>Hacé click en el botón para restablecer tu contraseña:</p>
        <a href="${resetLink}" target="_blank">
          <button>Restablecer contraseña</button>
        </a>
        <p>Este link expira en 1 hora</p>
      `
    });

    res.json({ message: "Correo enviado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const user = await usersRepository.getByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (isValidPassword(user, newPassword)) {
      return res.status(400).json({
        message: "No podés usar la misma contraseña anterior"
      });
    }

    const hashedPassword = createHash(newPassword);
    await usersRepository.updatePassword(user._id, hashedPassword);

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    res.status(400).json({
      message: "Token inválido o expirado"
    });
  }
};
