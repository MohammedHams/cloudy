const router = require('express').Router()
const bodyParser = require('body-parser')
const check = require('express-validator').check
const authController = require('../controllers/auth.controller')



router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin)

router.post('/login', bodyParser.urlencoded({extended: true}), authController.postLogin)
router.post('/signup', bodyParser.urlencoded({ extended: true }),
    check('username').not().isEmpty().withMessage('Username is requird'),
    check('email').not().isEmpty().withMessage('Email is requird').isEmail().withMessage('Invalid Format'),
    check('password').not().isEmpty().withMessage("password is requird").isLength({ min: 6 }).withMessage("Password must be at last 6 charachters"),
    check('confirmPassword').custom((value, { req }) => {
        if (value === req.body.password) return true
        else
          throw 'Password not equal Confirmpassword'}),
    authController.postSignup);


router.get('/index', authController.getIndex)
router.all('/logout', authController.logout)

module.exports = router;
