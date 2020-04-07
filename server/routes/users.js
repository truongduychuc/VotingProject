const express = require('express');
const router = express.Router();
const cors = require('cors');

// middleware
const authorize = require('../helpers/authorize');
const {upload, validations} = require('../middlewares');

// controllers
const {
  UserController,
  NomineeController,
  RoleController,
  TeamController
} = require('../controllers');


router.use(cors());
router.use(authorize());

require('../database/relationship/user-relations');


/**users/*/

//REGISTER
/**
 * @api 'users/register'
 * */
router.post('/register', validations.registerRequest , UserController.register);
/** @api 'users/authenticate' */
router.post('/authenticate', UserController.authenticate);
//ROLE
router.get('/role', RoleController.index);
//TEAM
router.get('/team', TeamController.index);
//PROFILE
router.get('/profile', UserController.getProfile);
//GET USER BY ID
router.get('/profile/:id', UserController.getProfileById);
//LIST
router.get('/list', UserController.listUser);
//LIST (admin role)
router.get('/list/admin', authorize('admin'), UserController.listUserForAdmin);
//CHANGE_PASSWORD
router.put('/change_password', UserController.changePassword);
//RESET PASSWORD
router.put('/reset_password/:id', authorize('admin'), UserController.resetPassword);
//UPDATE USER INFORMATION
router.put('/update/:id', authorize('admin'), UserController.updateUserInfo);
//UPDATE PERSONAL INFORMATION
router.put('/update_profile', UserController.updatePersonalProfile);
router.post('/upload_avatar', upload.single('avatar'), UserController.uploadAvatar);
//LIST USER FOR NOMINATING
router.get('/list_for_nominating', NomineeController.listUserForNominating);
//LIST USER FOR VOTING
router.post('/list_for_voting', NomineeController.listNomineesForVoting);
//DELETE
router.post('/delete/:id', authorize('admin'), UserController.deleteUser);
//REQUEST EMAIL TO CHANGE PASSWORD
router.post('/forgot_password', UserController.forgotPassword);
//CHANGE TO NEW PASSWORD
router.put('/reset_password', UserController.resetPassword);

module.exports = router;
