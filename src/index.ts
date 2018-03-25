import { Application } from "express";
import { Router } from "./web/router";
var path = require("path");
// import { KickDrumGenerator } from "./generators/kick-drum.generator";
// import { SnareDrumGenerator } from "./generators/snare-drum.generator";
// import { HiHatGenerator } from "./generators/hihat.generator";
// import { ChordGenerator } from "./generators/chord-generator";
// import * as tonal from "tonal";
// import { RandomChordStrategy } from "./strategies/chord-random.strategy";

// async function generateKickDrum() {
//     var kickDrumGenerator = new KickDrumGenerator("AJS Kick");
//     await kickDrumGenerator.clearClips();
//     await kickDrumGenerator.generate();
// }

// async function generateSnareDrum(){
//     var snareDrumGenerator = new SnareDrumGenerator("AJS Snare");
//     await snareDrumGenerator.clearClips();
//     await snareDrumGenerator.generate();
// }

// async function generateHiHats(){
//     var hiHatGenerator = new HiHatGenerator("AJS Hihat");
//     await hiHatGenerator.clearClips();
//     await hiHatGenerator.generate();
// }

// async function generateSimpleChords() {
//     var chordGenerator = new ChordGenerator("AJS Simple Chords");
//     await chordGenerator.clearClips();
//     await chordGenerator.generate();
// }

// async function generateRandomChords() {
//     var chordGenerator = new ChordGenerator("AJS Random Chords", [new RandomChordStrategy(2)]);
//     await chordGenerator.clearClips();
//     await chordGenerator.generate();
// }

// //  generateKickDrum()
// //       .then(() => generateSnareDrum())
// //       .then(() => genyerateHiHats());
 
//  //generateSimpleChords();

//  generateRandomChords();

// // https://plnkr.co/edit/jnmW3dwdDUbAI7NH9Tpa?p=preview

const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const app = express() as Application;
var hbs = require('hbs');
hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
app.set('view engine', 'hbs');
app.engine('html', require('hbs').__express);
app.set('views', path.join(__dirname, 'web/views'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
Router.applyRoutes(app);
app.listen(3000, () => console.log('Song Scaffolder started on port 3000!'))
