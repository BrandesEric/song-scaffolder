import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration } from "../music/note";

export class KickDrumCommonStrategy implements IClipGenerationStrategy {
    numberOfClips;

    private currentPatternIndex = 0;

    patterns = [
        new Pattern("x---x---x---x---",  NoteDuration.Sixteenth ,"FourOnFloor"),
        new Pattern("x--x--x-x--x--x-", NoteDuration.Sixteenth, "Dancehall1"),
        new Pattern("x--x----x--x----", NoteDuration.Sixteenth, "Dancehall2")
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
                var note = Note.fromNoteName("C3", i * pattern.individualNoteDuration.lengthInBeats, pattern.individualNoteDuration);
                phrase.addNote(note);
            }
        }

        return phrase;
    } 
}