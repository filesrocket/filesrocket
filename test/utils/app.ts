import express from "express";

const app = express();

app.get("/users", (_, res) => {
  res.status(200).json([
    {name: "Ivan"},
    {name: "Jose"},
    {name: "Jonathan"}
  ]);
});

export default app;
