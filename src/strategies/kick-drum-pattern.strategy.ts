import { Pattern } from "../music/pattern";
import { Phrase } from "../music/phrase";
import { Note } from "../music/note";
import { SongConfig } from "../config/song.config";

export class KickDrumPatternStrategy {

    numberOfClips = 4;

    name = "KD Pattern";

    numberOfBars = 2;

    private counter = 0;

    patterns: PatternDefinition[] = [
        new PatternDefinition(new Pattern("x---"), 50),
        new PatternDefinition(new Pattern("--x-"), 40),
        new PatternDefinition(new Pattern("x--x"), 20),
        new PatternDefinition(new Pattern("---x"), 20),
    ]

    generate(): Phrase { 
        var pattern = this.getRandomPattern();
        while(pattern.lengthInBars < this.numberOfBars) {
            pattern = pattern.concat(this.getRandomPattern());
        }
        return this.generatePhraseFromPattern(pattern, `${this.name} ${this.counter++}`)
    }

    private generatePhraseFromPattern(pattern: Pattern, name: string = null) {

        var phrase = new Phrase(pattern.lengthInBars, name);
        for (var i = 0; i < pattern.patternString.length; i++) {
            var action = pattern.patternString[i];
            if (action === "x") {
                var note = Note.fromNoteName(`${SongConfig.key}3`, i * pattern.individualNoteDuration.lengthInBeats, pattern.individualNoteDuration);
                phrase.addNote(note);
            }
        }

        return phrase;
    }

    private getRandomPattern(): Pattern {
        var totalWeightOfAllPatterns = this.patterns.reduce((weight, current) => weight + current.weight, 0);
        var randomNumber = this.getRandomInt(0, totalWeightOfAllPatterns);
        var currentPosition = 0;
        var selectedDefinition = this.patterns[0];
        for(var i = 0; i < this.patterns.length; i++){
            var pattern = this.patterns[i];
            var currentRangeMin = currentPosition;
            var currentRangeMax = currentPosition + pattern.weight;
            if(currentRangeMin <= randomNumber && randomNumber <= currentRangeMax) {
                selectedDefinition = pattern;
                break;
            }
            currentPosition = currentRangeMax;
        };

        return selectedDefinition.pattern;
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

}


class PatternDefinition {
    pattern: Pattern;
    weight: number;
    constructor(pattern: Pattern, weight: number) {
        this.pattern = pattern;
        this.weight = weight;
    }
}