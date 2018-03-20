import { Application } from "express";

export class Router {
    static applyRoutes(app: Application) {
        app.get('/', (req, res) => res.render("index.html", {eric: [1, 2]})); 
    }
}