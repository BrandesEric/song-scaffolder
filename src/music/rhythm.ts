import { isNumber } from "util";
import { NoteLengthPreferences } from "./note-length-preferences";
import { NoteLength } from "./note-length";

export class RhythmPattern {
    public parts: NoteLength[] = [];
    
    constructor(lengths: NoteLength[]) {
        this.parts = lengths;
    }

    get lengthInBeats() {
        return this.parts.reduce((length, duration) => length + duration.lengthInBeats, 0);
    }

    get lengthInBars() {
        return this.parts.reduce((length, duration) => length + duration.lengthInBars, 0);
    } 

    static generateRandomPattern(desiredLengthInBars: number, prefs: NoteLengthPreferences): RhythmPattern {
        var currentLengthInBars = 0;
        var lengths = [];
        while(currentLengthInBars < desiredLengthInBars) {
            var duration = prefs.getRandomNoteLength();
            if((currentLengthInBars + duration.lengthInBars) > desiredLengthInBars) {
                duration = NoteLength.fromBars(desiredLengthInBars - currentLengthInBars);
            }

            lengths.push(duration);
            currentLengthInBars += duration.lengthInBars;
        }

        return new RhythmPattern(lengths);
    }

    static getPatternByRhythmType(desiredLengthInBars: number, rhythmType: RhythmType) {
        var rhythms: WeightedRhythmPattern[];
        if(rhythmType === RhythmType.Bass) {
            rhythms = bassRhythms;
        }

        var totalWeight = rhythms.reduce((acc, val) => val.weight + acc, 0);
        var random = RhythmPattern.getRandomInt(1, totalWeight);
        var index = 0;
        var weightedPattern: WeightedRhythmPattern = rhythms[index];
        while(random > weightedPattern.weight) {
            random -= weightedPattern.weight;
            index++;
            weightedPattern = rhythms[index];
        }
        var pattern = weightedPattern.pattern;

        return this.generateFromNoteLengths(desiredLengthInBars, pattern);
    }

    static generateFromNoteLengths(desiredLengthInBars: number, noteLengths: NoteLength[]) {
        var currentLengthInBars = 0;
        var index = 0;
        var lengths = [];
        while(currentLengthInBars < desiredLengthInBars) {
            var duration = noteLengths[index % noteLengths.length];
            if((currentLengthInBars + duration.lengthInBars) > desiredLengthInBars) {
                duration = NoteLength.fromBars(desiredLengthInBars - currentLengthInBars);
            }

            index++;
            lengths.push(duration);
            currentLengthInBars += duration.lengthInBars;
        }

        return new RhythmPattern(lengths);
    }

    static getCommonRhythm(desiredLengthInBars: number, prefs: NoteLengthPreferences): RhythmPattern {

        var index = this.getRandomInt(0, commonRhythms.length);
        var pattern = commonRhythms[index]
        if(prefs.name === "medium") {
            pattern = NoteLength.halfTime(pattern);
        }
        else if(prefs.name === "long") {
            pattern = NoteLength.halfTime(NoteLength.halfTime(pattern));
        }
        
        return this.generateFromNoteLengths(desiredLengthInBars, pattern);
    }

    private static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
}

const commonRhythms: NoteLength[][] = [
    [ 
        NoteLength.Quarter, 
        NoteLength.Quarter, 
        NoteLength.Quarter, 
        NoteLength.Eighth, NoteLength.Eighth 
    ],
    [ 
        NoteLength.Eighth, NoteLength.Eighth, 
        NoteLength.Eighth, NoteLength.EighthRest, 
        NoteLength.Quarter, 
        NoteLength.Quarter 
    ], 
    [ 
        NoteLength.Sixteenth, NoteLength.Sixteenth, NoteLength.Sixteenth, NoteLength.SixteenthRest,
        NoteLength.Sixteenth, NoteLength.SixteenthRest, NoteLength.Sixteenth, NoteLength.SixteenthRest,
        NoteLength.Quarter,
        NoteLength.Quarter
    ]
]

const bassRhythms: WeightedRhythmPattern[] = [
    {
        weight: 20,
        pattern: [NoteLength.Quarter, NoteLength.Quarter, NoteLength.Quarter, NoteLength.Quarter]
    },{
        weight: 10,
        pattern: [NoteLength.Half, NoteLength.Half]
    },{
        weight: 10,
        pattern: [NoteLength.Whole]
    },{
        weight: 10,
        pattern: [NoteLength.Quarter, NoteLength.Quarter, NoteLength.Half]
    },{
        weight: 10,
        pattern: [NoteLength.Half, NoteLength.Quarter, NoteLength.Quarter]
    }
]

export enum RhythmType {
    Unspecified,
    Chord,
    Bass
}

type WeightedRhythmPattern = {
    weight: number,
    pattern: NoteLength[]
}