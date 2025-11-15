import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

const router = Router();

// Mostrar formulario de registro
router.get("/register", (req, res) => {
  res.render("register");
});

// Registro
router.post("/register", async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const { first_name, last_name, email, age, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ message: "Usuario ya existe" });

    const hashedPassword = createHash(password);

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.status(201).send({ message: "Usuario registrado", user: newUser });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).send({ error: error.message }); 
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ message: "Usuario no encontrado" });

    if (!isValidPassword(user, password))
      return res.status(401).send({ message: "Contraseña incorrecta" });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res
      .cookie("jwtCookie", token, { httpOnly: true })
      .send({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Ruta protegida
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({ status: "success", user: req.user });
  }
);

export default router;
