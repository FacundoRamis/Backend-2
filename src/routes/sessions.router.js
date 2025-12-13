import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";
import {
  forgotPassword,
  resetPassword
} from "../controllers/sessions.controller.js";

const router = Router();

/*REGISTRO*/

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!password) {
      return res.status(400).send({ error: "Password no llegó al backend" });
    }

    const hashedPassword = createHash(password);

    const exists = await UserModel.findOne({ email });
    if (exists)
      return res.status(400).send({ message: "Usuario ya existe" });

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.status(201).send({
      message: "Usuario registrado",
      user: newUser
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/*LOGIN*/

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(400).send({ message: "Usuario no encontrado" });

    if (!isValidPassword(user, password))
      return res.status(401).send({ message: "Contraseña incorrecta" });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res
      .cookie("jwtCookie", token, { httpOnly: true })
      .send({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/*CURRENT (PROTEGIDA)*/

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.send({
      status: "success",
      user: userDTO
    });
  }
);

/*PASSWORD RESET*/

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
