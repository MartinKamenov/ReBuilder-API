import { Application } from 'express';

export default interface Route {
    attach: () => void;
};
