const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const viewController = require("./controllers/viewController");

const app = express();
const port = 3000;

// Configurar EJS como template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas para views (frontend)
app.get("/", viewController.renderDashboard);
app.get("/users", viewController.renderUsers);
app.get("/spaces", viewController.renderSpaces);
app.get("/reservations", viewController.renderReservations);
app.get("/cleaning", viewController.renderCleaning);
app.get("/employees", viewController.renderEmployees);

// Rotas da API
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Interface web disponível em: http://localhost:${port}`);
  console.log(`API disponível em: http://localhost:${port}/api`);
});
