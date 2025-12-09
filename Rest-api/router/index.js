const router = require('express').Router();
const users = require('./users');
const themes = require('./themes');
const posts = require('./posts');
const likes = require('./likes');
const cars = require('./cars');
const test = require('./test');
const garage = require('./garage'); // ✅ добавено
const tracks = require('./tracks'); // ✅ добавено

const { authController } = require('../controllers');
const { getProfileInfo } = require('../controllers/auth');
const authMiddleware = require('../middlewares/authMiddleware');
const { carController } = require('../controllers');
const { trackController } = require('../controllers');
const { postController } = require('../controllers'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/posts', authMiddleware, postController.createPost);


router.get('/users/:id', getProfileInfo);
router.get('/users/me', authMiddleware, authController.getProfileInfo);
router.put('/users/me', authMiddleware, authController.editProfileInfo);
router.get('/api/posts/:id', postController.getPost);

router.use('/users', users);
router.use('/cars', cars);
router.use('/themes', themes);
router.use('/posts', posts);
router.use('/likes', likes);
router.use('/test', test);
router.use('/garage', garage); // ✅ добавено
router.use('/tracks', tracks); // ✅ добавено


module.exports = router;
