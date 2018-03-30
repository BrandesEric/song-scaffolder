import { Application, static as staticMiddleware } from "express";
import * as path from 'path';
import { serveStatic } from "serve-static";
import { currentState } from "../state/current";
import { changeTempo } from "../state/tempo";
import { addChords, generateChords, generateKick } from "../state/tracks";
import { KickTrack } from "../state/kick-track";
import { ChordTrack } from "../state/chord-track";

export class Router {
    static applyRoutes(app: Application) {

        app.get("/", async (req, res) => {
            var state = await currentState();
            //console.log(state);
            res.render("index.html", {
                currentState: state
            })
        });

        app.post("/change-tempo", async (req, res) => {
            await changeTempo(req.body.tempo);
            res.redirect("/")
        });

        app.post("/add-chords", async(req, res) => {
            await addChords(await currentState());
            res.redirect("/");
        });

        app.post("/generate-chords", async (req, res) => {
            var chordTrack = ChordTrack.fromFormPost(req.body);
            var state = await currentState();
            await generateChords(chordTrack, state);
            res.redirect("/");
        });

        app.post("/generate-kick", async (req, res) => {
            var kickTrack = KickTrack.fromFormPost(req.body);
            var state = await currentState();
            await generateKick(kickTrack, state);
            res.redirect("/");
        });

        // Static content
        var staticPath = path.join(__dirname, 'static');
        app.use("/static", staticMiddleware(staticPath));
    }
}