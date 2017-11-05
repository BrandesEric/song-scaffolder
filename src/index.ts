import { KickDrumGenerator } from "./generators/kick-drum.generator";
import { SnareDrumGenerator } from "./generators/snare-drum.generator";
import { HiHatGenerator } from "./generators/hihat.generator";
import { ChordGenerator } from "./generators/chord-generator";
import * as tonal from "tonal";
import { RandomChordStrategy } from "./strategies/chord-random.strategy";

async function generateKickDrum() {
    var kickDrumGenerator = new KickDrumGenerator("AJS Kick");
    await kickDrumGenerator.clearClips();
    await kickDrumGenerator.generate();
}

async function generateSnareDrum(){
    var snareDrumGenerator = new SnareDrumGenerator("AJS Snare");
    await snareDrumGenerator.clearClips();
    await snareDrumGenerator.generate();
}

async function generateHiHats(){
    var hiHatGenerator = new HiHatGenerator("AJS Hihat");
    await hiHatGenerator.clearClips();
    await hiHatGenerator.generate();
}

async function generateSimpleChords() {
    var chordGenerator = new ChordGenerator("AJS Simple Chords");
    await chordGenerator.clearClips();
    await chordGenerator.generate();
}

async function generateRandomChords() {
    var chordGenerator = new ChordGenerator("AJS Random Chords", [new RandomChordStrategy(2)]);
    await chordGenerator.clearClips();
    await chordGenerator.generate();
}

//  generateKickDrum()
//       .then(() => generateSnareDrum())
//       .then(() => genyerateHiHats());
 
 //generateSimpleChords();

 generateRandomChords();

// https://plnkr.co/edit/jnmW3dwdDUbAI7NH9Tpa?p=preview
