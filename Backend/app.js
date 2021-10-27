// Importations
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv").config();

console.log(process.env.PORT)

// Les Routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Connection à MongoDB avec Mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
// Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

// Body-Parser
app.use(express.json());

// Helmet 
app.use(helmet());

// Chemin vers dossier Statique, ici images
app.use('/images', express.static(path.join(__dirname, "images")));

// Utilisation des Routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

// Exportation App.js
module.exports = app;