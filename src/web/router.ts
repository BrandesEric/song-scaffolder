import { Application, static as staticMiddleware } from "express";
import * as path from 'path';
import { serveStatic } from "serve-static";
import { currentState } from "../state/current";
import { changeTempo } from "../state/tempo";
import { addChords, generateChords, generateKick, generateSnare, generateHihat, generateBass, generateMelody, addBass, addMelody, addKick, addSnare, addHihat, deleteTrack } from "../state/tracks";
import { KickTrack } from "../state/kick-track";
import { ChordTrack } from "../state/chord-track";
import { SnareTrack } from "../state/snare-track";
import { HihatTrack } from "../state/hihat-track";
import { BassTrack } from "../state/bass-track";
import { MelodyTrack } from "../state/melody-track";

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

        app.post("/add-bass", async(req, res) => {
            await addBass(await currentState());
            res.redirect("/");
        });

        app.post("/add-melody", async(req, res) => {
            await addMelody(await currentState());
            res.redirect("/");
        });

        app.post("/add-kick", async(req, res) => {
            await addKick(await currentState());
            res.redirect("/");
        });

        app.post("/add-snare", async(req, res) => {
            await addSnare(await currentState());
            res.redirect("/");
        });

        app.post("/add-hihat", async(req, res) => {
            await addHihat(await currentState());
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

        app.post("/generate-snare", async (req, res) => {
            var snareTrack = SnareTrack.fromFormPost(req.body);
            var state = await currentState();
            await generateSnare(snareTrack, state);
            res.redirect("/");
        });

        app.post("/generate-hihat", async (req, res) => {
            var hihatTrack = HihatTrack.fromFormPost(req.body);
            var state = await currentState();
            await generateHihat(hihatTrack, state);
            res.redirect("/");
        });

        app.post("/generate-bass", async (req, res) => {
            var bassTrack = BassTrack.fromFormPost(req.body);
            var state = await currentState();
            await generateBass(bassTrack, state);
            res.redirect("/");
        });

        app.post("/generate-melody", async (req, res) => {
            var melodyTrack = MelodyTrack.fromFormPost(req.body);
            var state = await currentState();
            await generateMelody(melodyTrack, state);
            res.redirect("/");
        });

        app.post("/delete-track", async (req, res) => {
            var melodyTrack = MelodyTrack.fromFormPost(req.body);
            var state = await currentState();
            await deleteTrack(req.body.track, req.body.kind, state);
            res.redirect("/");
        });

        // Static content
        var staticPath = path.join(__dirname, 'static');
        app.use("/static", staticMiddleware(staticPath));
    }
}