import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration } from "../music/note";
import { SongConfig } from "../config/song.config";

export class HiHatCommonStrategy implements IClipGenerationStrategy {
    numberOfClips;

    private currentPatternIndex = 0;

    patterns = [
        new Pattern("x-x-x-x-x-x-x-x-",  NoteDuration.Sixteenth ,"Sixteenths alternating"),
        new Pattern("xxxxxxxxxxxxxxxx",  NoteDuration.Sixteenth ,"Sixteenths"),
    ];

    constructor() {
        this.numberOfClips = this.patterns.length;
    }

    generate(): Phrase {
        var phrase = this.generatePhraseFromPattern(this.patterns[this.currentPatternIndex]);
        phrase = phrase.double();
        this.currentPatternIndex++;
        return phrase;
    }

    private generatePhraseFromPattern(pattern: Pattern) {

        var phrase = new Phrase(pattern.lengthInBars, pattern.name);
        for (var i = 0; i < pattern.patternString.length; i++) {
            var action = pattern.patternString[i];
            if (action === "x") {
                var velocity = this.getRandomInt(75, 127);
                var note = Note.fromNoteName(`${SongConfig.key}3`, i * pattern.individualNoteDuration.lengthInBeats, pattern.individualNoteDuration, velocity);
                phrase.addNote(note);
            }
        }

        return phrase;
    } 

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
}