import { NoteLength, RestLength } from "./note";
import { isNumber } from "util";

export class RhythmPattern {
    public parts: NoteLength[]|RestLength[] = [];
    
    constructor(lengths: NoteLength[] | RestLength[]) {
        this.parts = lengths;
    }

    get lengthInBeats() {
        return this.parts.reduce((length, duration) => length + duration.lengthInBeats, 0);
    }

    get lengthInBars() {
        return this.parts.reduce((length, duration) => length + duration.lengthInBars, 0);
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
        NoteLength.Eighth, RestLength.Eighth, 
        NoteLength.Quarter, 
        NoteLength.Quarter 
    ], 
    [ 
        NoteLength.Sixteenth, NoteLength.Sixteenth, NoteLength.Sixteenth, RestLength.Sixteenth,
        NoteLength.Sixteenth, RestLength.Sixteenth, NoteLength.Sixteenth, RestLength.Sixteenth,
        NoteLength.Quarter,
        NoteLength.Quarter
    ]
]