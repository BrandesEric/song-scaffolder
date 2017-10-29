import { KickDrumGenerator } from "./generators/kick-drum.generator";
import { SnareDrumGenerator } from "./generators/snare-drum.generator";
import { HiHatGenerator } from "./generators/hihat.generator";
import { ChordGenerator } from "./generators/chord-generator";
import * as tonal from "tonal";

async function generateKickDrum() {
    var kickDrumGenerator = new KickDrumGenerator();
    await kickDrumGenerator.clearClips();
    await kickDrumGenerator.generate();
}

async function generateSnareDrum(){
    var snareDrumGenerator = new SnareDrumGenerator();
    await snareDrumGenerator.clearClips();
    await snareDrumGenerator.generate();
}

async function generateHiHats(){
    var hiHatGenerator = new HiHatGenerator();
    await hiHatGenerator.clearClips();
    await hiHatGenerator.generate();
}

async function generateChords() {
    var chordGenerator = new ChordGenerator();
    await chordGenerator.clearClips();
    await chordGenerator.generate();
}

//  generateKickDrum()
//      .then(() => generateSnareDrum())
//      .then(() => generateHiHats());

generateChords();

// https://plnkr.co/edit/jnmW3dwdDUbAI7NH9Tpa?p=preview
