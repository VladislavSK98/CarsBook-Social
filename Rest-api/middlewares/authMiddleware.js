// require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const { authCookieName } = require('../app-config');
// const { userModel } = require('../models');

// module.exports = (req, res, next) => {
//     let token = req.cookies[authCookieName];
//     console.log('🛡 Получен токен:', token);
// console.log('🛡 SECRET:', process.env.SECRET);


//     // Ако токенът не е в cookie, проверяваме Authorization header
//     if (!token && req.headers.authorization) {

//         console.log('🛡 Headers:', req.headers);
//         const parts = req.headers.authorization.split(' ');
//         if (parts.length === 2 && parts[0] === 'Bearer') {
//             token = parts[1];
//         }
//     }

//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

    
//     jwt.verify(token, process.env.SECRET, async (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }

//         try {
//             const user = await userModel.findById(decoded.id).select('-password');
//             if (!user) {
//                 return res.status(401).json({ message: 'User not found' });
//             }
//             req.user = user;
//             next();
//         } catch (error) {
//             next(error);
//         }
//     });
// };

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { authCookieName } = require('../app-config');
const { userModel, tokenBlacklistModel } = require('../models');

module.exports = async function (req, res, next) {
    let token = req.cookies[authCookieName];

    // Ако няма токен в cookie, опитай от Authorization header
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const blacklisted = await tokenBlacklistModel.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.isLogged = true;
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

