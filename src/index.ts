import { Config } from "./config/index";
import { KickDrumGenerator } from "./generators/kick-drum.generator";

async function generateKickDrum() {
    var kickDrumGenerator = new KickDrumGenerator();
    await kickDrumGenerator.clearClips();
    await kickDrumGenerator.generate();
}

generateKickDrum();