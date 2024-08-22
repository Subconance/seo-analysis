import express from "express";
import 'dotenv/config'
import routes from "./routes/index.js"

const app = express();
const PORT = process.env.PORT || 12000;

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Seo Analyze API");
});

app.listen(PORT, () => {
    console.log("SEO Analysis API started on port: " + PORT);
})