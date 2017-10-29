import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration } from "../music/note";
import { Scale, Chord } from "tonal";
import { SongConfig } from "../config/song.config";

export class SimpleChordStrategy implements IClipGenerationStrategy {
    numberOfClips: number = 1;

    private scale;
    private chords;

    constructor() {
        this.scale = Scale.notes(SongConfig.key, SongConfig.mode);
        this.chords = this.buildChords(this.scale);
    }
    generate(): Phrase {
        console.log(this.scale);

        return null;
    }


    buildChords(scale) {


    }


}