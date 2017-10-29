import { NoteDuration } from "./note";

export class Pattern {
    individualNoteDuration: NoteDuration;
    patternString: string;
    name: string;


    get lengthInBars(): number {
        var notes = this.patternString.length;
        return notes * this.individualNoteDuration.lengthInBars;
    }

    constructor(pattern: string, individualNoteDuration = NoteDuration.Sixteenth, name: string = null) {
        this.patternString = pattern;
        this.individualNoteDuration = individualNoteDuration;
        this.name = name;
    }

    concat(pattern: Pattern): Pattern {
        if (this.individualNoteDuration != pattern.individualNoteDuration) { throw new Error("Can't concat two different pattern durations"); }

        return new Pattern(this.patternString + pattern.patternString, this.individualNoteDuration, this.name);
    }
}