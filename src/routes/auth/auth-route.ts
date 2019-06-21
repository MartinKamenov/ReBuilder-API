import Route from '../contracts/Route';
import controller from "./auth-controller";
import constants from "../../constants/constants";
import { Application } from 'express';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInterface from '../../models/server/ResponseInterface';
import LogoutRequest from './contracts/LogoutRequest';
import AuthenticatedRequest from './contracts/AuthentedRequest';

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
            .get('/login/successfull', (req: AuthenticatedRequest, res: ResponseInterface) => {
                const user = controller.getUser(req);
                res.status(constants.SUCCESS_STATUS_CODE).send(user);
            })
            .get('/register/successfull', (req: AuthenticatedRequest, res: ResponseInterface) => {
                const user = controller.getUser(req);
                res.status(constants.SUCCESS_STATUS_CODE).send(user);
            })
            .get('/login/unsuccessfull', (req: RequestInterface, res: ResponseInterface) => {
                res.status(constants.UNSUCCESS_STATUS_CODE).send('Unsuccessfull login');
            })
            .get('/register/unsuccessfull', (req: RequestInterface, res: ResponseInterface) => {
                res.status(constants.UNSUCCESS_STATUS_CODE).send('Unsuccessfull register');
            });

        this.app.use('/auth', router);
    }
};

export default AuthRoute;
