import Route from '../contracts/Route';
import controller from './auth-controller';
import constants from '../../constants/constants';
import { Application } from 'express';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInterface from '../../models/server/ResponseInterface';
import LogoutRequest from './contracts/LogoutRequest';
import UserRepository from '../../models/repositories/UserRepository';

const { Router } = require('express');

class AuthRoute implements Route {
    constructor(private app: Application, private userRepository: UserRepository) {}
    public attach = () => {
        const router = new Router();

        router
            .post('/login', async (req, res: ResponseInterface) => {
                const result = await controller.logIn(req, this.userRepository);
                res.json(result);
            })
            .post('/register', async (req, res: ResponseInterface) => {
                const result = await controller.register(req, this.userRepository);
                res.json(result);
            })
            .post('/user', async (req, res: ResponseInterface) => {
                const result = await controller.getUser(req, this.userRepository);
                res.json(result);
            })
            .post('/user/update', async (req, res: ResponseInterface) => {
                const result = await controller.updateUser(req, this.userRepository);
                res.json(result);
            });

        this.app.use('/auth', router);
    }
};

export default AuthRoute;
