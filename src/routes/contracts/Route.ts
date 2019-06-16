import { Application } from "express";

export default interface Route {
    attach: (app: Application, ...repositories: any) => void;
};
