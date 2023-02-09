// Create express app
var express = require("express")
var db = require("./database.js")

var app = express()

// Server port
var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.use(express.urlencoded({ extended: true }))
app.use(express.static('../frontend/src'))

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// Insert here other API endpoints

app.get("/api/candidates", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    var SQL = `SELECT votos_cand_estado.cand_nome, votos_cand_estado.cand_status, votos_cand_estado.cargo_nome, votos_cand_estado.cand_votos
        FROM votos_cand_estado`;
    var params = []
    if (req.query.type_query === "position") {
        SQL += " WHERE cargo_nome = ?";
        params = [req.query.position]
    } else if (req.query.type_query === "candidate-name") {
        SQL += " WHERE cand_nome like ?";
        params = [`%${req.query.name}%`]
    }else if(req.query.type_query === "municipalities"){
        SQL = `SELECT votos_cand_municipio.cand_nome, votos_cand_municipio.cand_status as cargo_nome, candidato.status as cand_status, votos_cand_municipio.cand_votos
        FROM votos_cand_municipio INNER JOIN candidato ON muni_nome = ? AND candidato.nome = votos_cand_municipio.cand_nome`
        params = [req.query.municipality]
    }else if(req.query.type_query === "status"){
        SQL += " WHERE cand_status = ?";
        params = [req.query.status]
    }
    SQL += " ORDER BY cand_votos DESC LIMIT 20 OFFSET ?"
    params = [...params, req.query.page]
    db.all(SQL, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "candidates": rows
        })
    });
});


app.get("/api/municipalities/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    SQL = "SELECT nome from municipio;"
    db.all(SQL, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "municipalities": rows
        })
    });
});

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});