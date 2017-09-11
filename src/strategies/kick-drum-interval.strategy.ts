import { Phrase } from "../music/phrase";
import { Note, NoteDuration } from "../music/note";
import { Track } from "../../../AbletonJS/dist/index";
import { IClipGenerationStrategy } from "./iclip-generation-strategy";

export class KickDrumIntervalStrategy implements IClipGenerationStrategy {
    numberOfClips = 4;
    increasingPercentOfHit = 25;
    initialPercentOfHit =  85;
    defaultLengthInBars = 2;
    name = "KD Interval";

    private counter = 0;

    generate(): Phrase {
        var phrase = new Phrase(this.defaultLengthInBars/2,  `${this.name} ${this.counter}`);
        this.counter++;
        var beats = phrase.numberOfBeats;

        for (var i = 0; i < beats; i+= 0.25) {
            if (i === 0) {
                if (this.shouldHit(this.initialPercentOfHit)) {
                    phrase.addNote(Note.fromNoteName("C3", i, NoteDuration.Sixteenth));
                }
            }
            else {
                var sixteenthsSincePlayed = i - phrase.lastBeatPlayed;
                var decimalPercent = this.increasingPercentOfHit / 100;
                var percentChance = (1 - Math.pow(1   - decimalPercent, sixteenthsSincePlayed)) * 100;

                if (this.shouldHit(percentChance)) {
                    phrase.addNote(Note.fromNoteName("C3", i, NoteDuration.Sixteenth));
                }
            }
        }

        return phrase.double();
    }

    shouldHit(percentangeChance: number): boolean {
        var rand = Math.random() * 100;
        return rand <= percentangeChance;
    }
}