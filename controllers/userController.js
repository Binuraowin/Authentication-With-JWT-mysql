const sequelize = require("../config/database");
const User = require("../model/userModel");
const {registerValidation,loginValidation} = require('../validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    v4: uuidv4
  } = require('uuid');

exports.register = async (req,res,next) => {
   sequelize.sync().then(async result => {
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        id: uuidv4(),
      };

      User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error in data"
        });
      });
   }).catch(err =>{
       console.log(err)
   })
}

exports.user_login = async (req, res, next) => {
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const email = req.query.email;
    var condition = email ? { temailitle: { [Op.like]: `%${email}%` } } : null;


    User.findAll({
        where: condition
      })
      .then(async findResult => {
          if (findResult.length < 0) {
              console.log(findResult)
            res.status(400).send("email not exist")
          } else {
              const checkPassword = await bcrypt.compare(req.body.password, findResult[0].password)
              if(checkPassword){
                  const token = jwt.sign({_id: findResult[0].id},"gkuybbghashafafgyb")
                  res.header('auth-token',token).send(token)
              } else{
                res.send("username or passsword error")
              }
              
          }
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err)
      });
  }

  exports.update = (req, res, next) => {
    const id = req.params.id;
    User.update(req.body, {
        where: { id: id }
      })
      .then(result => {
        if (result == 1) {
            res.send({
              message: "Updated successfully."
            });
          } else {
            res.send({
              message: 'Error in data'
            });
          }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }


  exports.delete = (req, res, next) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id }
      })
      .then(result => {
        if (result == 1) {
            res.send({
              message: "Deleted successfully."
            });
          } else {
            res.send({
              message: 'No valid entry found for provided ID'
            });
          }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
