import Route from '../contracts/Route';
import controller from "./auth-controller";
import constants from "../../constants/constants";
import { Application } from 'express';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInterface from '../../models/server/ResponseInterface';
import LogoutRequest from './contracts/LogoutRequest';

const { Router } = require('express');
const passport = require('passport');

class AuthRoute implements Route {
    constructor(private app: Application) {}
    attach = () => {
        const router = new Router();
    
        router
            .post('/login', passport.authenticate('local', { 
                successRedirect: '/auth/login/successfull',
                failureRedirect: '/auth/login/unsuccessfull',
                failureFlash: true
            }))
            .post('/logout', (req: LogoutRequest, res: ResponseInterface) => {
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
    
        this.app.use('/auth', router);
    }
};

export default AuthRoute;
