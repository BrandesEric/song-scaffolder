import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration } from "../music/note";
import { SongConfig } from "../config/song.config";

export class SnareDrumCommonStrategy implements IClipGenerationStrategy {
    numberOfClips;

    private currentPatternIndex = 0;

    patterns = [
        new Pattern("--x---x---x---x-",  NoteDuration.Sixteenth ,"MidBeat"),
        new Pattern("----x-------x---",  NoteDuration.Sixteenth ,"OffBeat"),
        new Pattern("----x--xx-x-x---",  NoteDuration.Sixteenth ,"Fancier"),
        new Pattern("--------x-----x---x-----x-------",  NoteDuration.ThirtySecond ,"Trap"),
        new Pattern("xxxx", NoteDuration.ThirtySecond, "Roll") 
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
                var note = Note.fromNoteName(`${SongConfig.key}3`, i * pattern.individualNoteDuration.lengthInBeats, pattern.individualNoteDuration);
                phrase.addNote(note);
            }
        }

        return phrase;
    } 
}