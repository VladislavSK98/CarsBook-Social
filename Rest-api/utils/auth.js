const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const {
    userModel,
    tokenBlacklistModel
} = require('../models');

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        let token = req.cookies[authCookieName];

        // 🔥 Ако няма токен в cookie, опитай да го вземеш от Authorization header
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (!token) {
            if (!redirectUnauthenticated) {
                return next();
            }

            return res.status(401).json({ message: 'Unauthorized' });
        }

        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ])
        .then(([data, blacklistedToken]) => {
            if (blacklistedToken) {
                return Promise.reject(new Error('blacklisted token'));
            }

            userModel.findById(data.id)
                .then(user => {
                    if (!user) {
                        return Promise.reject(new Error('User not found'));
                    }
                    req.user = user;
                    req.isLogged = true;
                    next();
                })
        })
        .catch(err => {
            if (!redirectUnauthenticated) {
                next();
                return;
            }
            if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                console.error(err);
                res.status(401).send({ message: "Invalid token!" });
                return;
            }
            next(err);
        });
    }
}


function getUserIdFromRequest(req) {
    return req.user ? req.user._id : null; // Връща _id на потребителя от req.user
}

module.exports = auth;
