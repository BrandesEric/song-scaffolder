import { Config } from "./config/index";
import { KickDrumGenerator } from "./generators/kick-drum.generator";
import { SnareDrumGenerator } from "./generators/snare-drum.generator";
import { HiHatGenerator } from "./generators/hihat.generator";

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

generateKickDrum()
    .then(() => generateSnareDrum())
    .then(() => generateHiHats());

