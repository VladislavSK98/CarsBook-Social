const { userModel, tokenBlacklistModel } = require("../models");

const utils = require("../utils");
const { authCookieName } = require("../app-config");

const bsonToJson = (data) => {
  return JSON.parse(JSON.stringify(data));
};
const removePassword = (data) => {
  const { password, __v, ...userData } = data;
  return userData;
};

function register(req, res, next) {
  const { tel, email, username, password, repeatPassword } = req.body;

  return userModel
    .create({ tel, email, username, password })
    .then((createdUser) => {
      createdUser = bsonToJson(createdUser);
      createdUser = removePassword(createdUser);

      const token = utils.jwt.createToken({ id: createdUser._id });
      if (process.env.NODE_ENV === "production") {
        res.cookie(authCookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: false,
        });
      } else {
        res.cookie(authCookieName, token, { httpOnly: true });
      }
      res.status(200).send(createdUser);
    })
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        let field = err.message.split("index: ")[1];
        field = field.split(" dup key")[0];
        field = field.substring(0, field.lastIndexOf("_"));

        res
          .status(409)
          .send({ message: `This ${field} is already registered!` });
        return;
      }
      next(err);
    });
}

function login(req, res, next) {
    const { email, password } = req.body;

    userModel
        .findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(401).send({ message: "Wrong email or password" });
            }
            return Promise.all([user, user.matchPassword(password)]);
        })
        .then(([user, match]) => {
          if (!match) {
              return res.status(401).send({ message: "Wrong email or password" });
          }
      
          user = bsonToJson(user);
          user = removePassword(user);
      
          const token = utils.jwt.createToken({ id: user._id });
      
          res.cookie(authCookieName, token, {
              httpOnly: true,
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              secure: process.env.NODE_ENV === "production",
          });
      
          res.status(200).send({
              user,
              accessToken: token,
          });
      })
      
        .catch(next);
}


function logout(req, res) {
  const token = req.cookies[authCookieName];

  tokenBlacklistModel
    .create({ token })
    .then(() => {
      res
        .clearCookie(authCookieName)
        .status(204)
        .send({ message: "Logged out!" });
    })
    .catch((err) => res.send(err));
}

function getProfileInfo(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user data found" });
  }
  const { _id } = req.user;
  userModel
    .findOne({ _id }, { password: 0, __v: 0 })
    //finding by Id and returning without password and __v
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
}

function editProfileInfo(req, res, next) {
  const { _id: userId } = req.user;
  const { tel, username, email } = req.body;

  const updatedData = {};
  if (tel) updatedData.tel = tel;
  if (username) updatedData.username = username;
  if (email) updatedData.email = email;

  if (Object.keys(updatedData).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update" });
  }

  userModel
    .findByIdAndUpdate(userId, updatedData, { runValidators: true, new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(removePassword(bsonToJson(updatedUser)));
    })
    .catch(next);
}

module.exports = {
  login,
  register,
  logout,
  getProfileInfo,
  editProfileInfo,
};
