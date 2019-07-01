import Route from '../contracts/Route';
import controller from "./auth-controller";
import constants from "../../constants/constants";
import { Application } from 'express';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInterface from '../../models/server/ResponseInterface';
import LogoutRequest from './contracts/LogoutRequest';
import AuthenticatedRequest from './contracts/AuthentedRequest';
import User from '../../models/contracts/User';
import UserRepository from '../../models/repositories/UserRepository';

const { Router } = require('express');
const passport = require('passport');

class AuthRoute implements Route {
    constructor(private app: Application, private userRepository: UserRepository) {}
    public attach = () => {
        const router = new Router();

        router
            .post('/login', async (req, res: ResponseInterface) => {
                const result = await controller.logIn(req, this.userRepository);
                res.json(result);
            })
            .post('/register', (req, res: ResponseInterface, next) => {
                passport.authenticate('local', (err: Error, user: User) => {
                    if (err) { return next(err); }
                    if (!user) {
                        return res.redirect('/auth/register/unsuccessfull');
                    }
                    req.logIn(user, (err: Error) => {
                        if (err) { return next(err.message); }
                        res.cookie('userid', user.id, { maxAge: 2592000000 });
                        res.send(user);
                    });
                })(req, res, next);
            })
            .post('/logout', (req: LogoutRequest, res: ResponseInterface) => {
                const result = controller.logout(req);
                res.status(constants.SUCCESS_STATUS_CODE).send(result);
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
