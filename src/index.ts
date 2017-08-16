import { Config } from "./config/index";
import { KickDrumGenerator } from "./generators/kick-drum.generator";

function generateKickDrum() {
    new KickDrumGenerator().generate();
}

generateKickDrum();