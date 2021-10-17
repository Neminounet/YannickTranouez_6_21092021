const Sauce = require("../models/Sauce");
const fs = require("fs");

// Requête POST -- Créer Sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  // Requête POST -- Noter Sauce
exports.rateSauce = (req, res, next) => {
  console.log(req.body);
  if(req.body.like == 1) {
    Sauce.updateOne({ _id: req.params.id}, {$inc: {likes : req.body.like} , $push: {usersLiked: req.body.userId} })
    .then(() => res.status(200).json({ message: ' Sauce Liked !'}))
    .catch(error => res.status(400).json({ error }));
  }
  else if(req.body.like == -1 ){
    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -req.body.like}, $push: {usersDisliked: req.body.userId} })
    .then(() => res.status(200).json({ message: ' Sauce Disliked !'}))
    .catch(error => res.status(400).json({ error }));
  }
  else if(req.body.like == 0){
    Sauce.findOne({_id: req.params.id})
      .then(sauce =>{
        if(sauce.usersLiked.includes(req.body.userId)){
          Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId} })
          .then(() => res.status(200).json({ message: 'Like retiré !'}))
          .catch(error => res.status(400).json({ error }));
        }
        else if(sauce.usersDisliked.includes(req.body.userId)){
          Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId} })
          .then(() => res.status(200).json({ message: 'Dislike retiré !'}))
          .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};

//  Requête PUT -- Modifier Sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject})
    .then(() => res.status(200).json({ message: 'Sauce Modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Requête Delete -- Supprimer Sauce
exports.deleteSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, ()=> {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet Supprimé !"}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//  Requête GET -- Afficher une Sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Requête GET -- Afficher Sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => {
      res.status(200).json(sauces)
    })
    .catch(error => {
      res.status(400).json({ error})
    });
  };
