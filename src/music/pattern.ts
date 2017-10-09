import { NoteDuration } from "./note";

export class Pattern {
    individualNoteDuration: NoteDuration;
    patternString: string;


    get lengthInBars(): number {
        var notes = this.patternString.length;
        return notes * this.individualNoteDuration.lengthInBars;
    }

    constructor(pattern: string, individualNoteDuration = NoteDuration.Sixteenth) {
        this.patternString = pattern;
        this.individualNoteDuration = individualNoteDuration;
    }

    concat(pattern: Pattern): Pattern {
        if (this.individualNoteDuration != pattern.individualNoteDuration) { throw new Error("Can't concat two different pattern durations"); }

        return new Pattern(this.patternString + pattern.patternString, this.individualNoteDuration);
    }
}