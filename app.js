const express = require("express");
const { check, body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());

app.get("/error", (req, res) => {
  throw new Error("This is a forced error");
});

app.post(
  "/email",
  [
    check("email")
      .normalizeEmail()
      .trim()
      .isEmail()
      .custom((value, { req }) => {
        if (value !== req.body.confirmEmail) {
          throw new Error("Email and confirm email do not match");
        }
        return true;
      })
      .custom((value, { req }) => {
        // Perform some async validation (like checking if the email already exists in the database)
      }),
    body("confirmEmail", "The confirmation email must be a valid email")
      .isEmail()
      .normalizeEmail()
      .trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: "Email is valid" });
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("I'm catching an error!");
  res.status(500).json({ message: err.message });
});

app.listen(3000);
