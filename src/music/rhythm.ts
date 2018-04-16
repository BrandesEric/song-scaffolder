import { isNumber } from "util";
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

    static getPatternByRhythmType(desiredLengthInBars: number, rhythmType: RhythmType) {
        var lengths = [];
        var lastPattern;
        var currentLengthInBars = 0;
        while(currentLengthInBars < desiredLengthInBars) {
            if(lengths.length === 0 || !this.shouldRepeatPattern()){
                var pattern = this.getWeightedRhythmPattern(rhythmType);
                lengths = lengths.concat(pattern);
                lastPattern = pattern;
            }
            else {
                lengths = lengths.concat(lastPattern);
            }
            currentLengthInBars += lastPattern.reduce((length, x) => x.lengthInBars + length, 0);
        }

        
        return this.generateFromNoteLengths(desiredLengthInBars, lengths);
    }

    static shouldRepeatPattern(): boolean {
        return this.getRandomInt(0, 100) <= 50;
    }

    static getWeightedRhythmPattern(rhythmType: RhythmType): NoteLength[] {
        var rhythms: WeightedRhythmPattern[];
        if(rhythmType === RhythmType.Bass) {
            rhythms = bassRhythms;
        }
        else if (rhythmType == RhythmType.ChordCommon){
            rhythms = chordCommonRhythms;
        }
        else if (rhythmType == RhythmType.ChordRandom) {
            rhythms = chordRandomRhythms;
        }
        else if(rhythmType === RhythmType.Melody) {
            rhythms = melodyRhythms
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
        var lengths = this.parseRhythmString(pattern);

        return lengths;
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

    private static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    private static parseRhythmString(pattern: string): NoteLength[] {
        var noteLengths = []; 
        var patternParts = pattern.split(" ");
        patternParts.forEach(lengthString => {
            var length = NoteLength.parse(lengthString);
            noteLengths.push(length);
        });

        return noteLengths;
    } 
}

const bassRhythms: WeightedRhythmPattern[] = [
    {
        weight: 10,
        pattern: "q q q q"
    },{
        weight: 10,
        pattern: "h h"
    },{
        weight: 10,
        pattern: "w"
    },{
        weight: 10,
        pattern: "q q h"
    },{
        weight: 10,
        pattern: "h q q"
    },{
        weight: 10,
        pattern: "q q q qr"
    },{
        weight: 10,
        pattern: "h. qr"
    },{
        weight: 10,
        pattern: "h. q"
    }
]

const chordCommonRhythms: WeightedRhythmPattern[] = [{
        weight: 10,
        pattern: "h w h w w"
    },{
        weight: 10,
        pattern: "w w w w"
    },{
        weight: 10,
        pattern: "w h h w h h"
    },{
        weight: 10,
        pattern: "h. h. h. h. w"
    },{
        weight: 10,
        pattern: "h h. h. w w"
    }
]

const chordRandomRhythms: WeightedRhythmPattern[] = [
    {
        weight: 3,
        pattern: "h"
    },{
        weight: 10,
        pattern: "w"
    },{
        weight: 3,
        pattern: "h."
    },{
        weight: 10,
        pattern: "w."
    }
]

const melodyRhythms: WeightedRhythmPattern[] = [{
    weight: 10,
    pattern: "e e e er"
},{
    weight: 10,
    pattern: "x x"
},{
    weight: 10,
    pattern: "x e x"
},{
    weight: 10,
    pattern: "x xr x xr"
},{
    weight: 10,
    pattern: "e e."
},{
    weight: 10,
    pattern: "x e x er"
},{
    weight: 10,
    pattern: "x e xr e"
},{
    weight: 20,
    pattern: "qr"
},{
    weight: 20,
    pattern: "er"
},{
    weight: 10,
    pattern: "er."
}
]

export enum RhythmType {
    Unspecified,
    ChordCommon,
    ChordRandom,
    Bass,
    Melody
}

type WeightedRhythmPattern = {
    weight: number,
    pattern: string
}