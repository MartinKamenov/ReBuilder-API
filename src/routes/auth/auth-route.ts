import controller from "./auth-controller";
import constants from "../../constants/constants";

const { Router } = require('express');
const passport = require('passport');

const attach = (app, userRepository, messengerRepository) => {
    const router = new Router();

    router
        .post('/login', passport.authenticate('local', { 
            successRedirect: '/auth/login/successfull',
            failureRedirect: '/auth/login/unsuccessfull',
            failureFlash: true
        }))
        .post('/logout', (req, res) => {
            const result = controller.logout(req);
            res.status(constants.SUCCESS_STATUS_CODE).send(result);
        })
        .post('/register', passport.authenticate('local', {
            successRedirect: '/auth/register/successfull',
            failureRedirect: '/auth/register/unsuccessfull',
            failureFlash: true
        }))
        .get('/login/successfull', (req, res) => {
            res.status(constants.SUCCESS_STATUS_CODE).send('Successfull login');
        })
        .get('/register/successfull', (req, res) => {
            res.status(constants.SUCCESS_STATUS_CODE).send('Successfull register');
        })
        .get('/login/unsuccessfull', (req, res) => {
            res.status(constants.UNSUCCESS_STATUS_CODE).send('Unsuccessfull login');
        })
        .get('/register/unsuccessfull', (req, res) => {
            res.status(constants.UNSUCCESS_STATUS_CODE).send('Unsuccessfull register');
        });

    app.use('/auth', router);
};

module.exports = attach;