import { Config } from "./config/index";
import { KickDrumGenerator } from "./generators/kick-drum.generator";

function generateKickDrum() {
    var kickDrumGenerator = new KickDrumGenerator();
    kickDrumGenerator.clearClips();
    kickDrumGenerator.generate();
}

generateKickDrum();