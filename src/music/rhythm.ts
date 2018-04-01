import { NoteLength } from "./note";
import { isNumber } from "util";
import { NoteLengthPreferences } from "./note-length-preferences";

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

    static generateFromNoteLengths(desiredLengthInBars: number, noteLengths: NoteLength[]) {
        var currentLengthInBars = 0;
        var index = 0;
        var lengths = [];
        while(currentLengthInBars < desiredLengthInBars) {
            var duration = noteLengths[index % noteLengths.length];
            if((currentLengthInBars + duration.lengthInBars) > desiredLengthInBars) {
                duration = NoteLength.fromBars(desiredLengthInBars - currentLengthInBars);
            }

            lengths.push(duration);
            currentLengthInBars += duration.lengthInBars;
        }

        return new RhythmPattern(lengths);
    }
}

export let commonRhythms = [
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