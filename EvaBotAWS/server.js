const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { response } = require("express");
const fetch = require("node-fetch");
const app = express();

const port = process.env.PORT || 3000;
const bdApi = 'https://0kcpnifldf.execute-api.us-east-2.amazonaws.com/v1/';

// for parsing json
app.use(
  bodyParser.json({
    limit: "20mb",
  })
);
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "20mb",
  })
);

console.log("Carpeta Raiz: " + __dirname);

app.use("/messenger", require("./Facebook/facebookBot"));

app.use("/api", require("./routes/api"));

app.get("/", (req, res) => {
  return res.send("Chatbot Funcionando 👍👍");
});

app.listen(port, () => {
  console.log("Escuchando peticiones en el puerto ", port);
});
