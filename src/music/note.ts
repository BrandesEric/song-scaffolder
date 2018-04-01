import * as tonal from "tonal";

export class Note {
    name: string;
    pitch: number;
    duration: NoteLength;
    timeStartInBeats: number;
    velocity = 127

    get durationInBeats(): number {
        return this.duration.lengthInBeats;
    }

    clone(): Note {
        var note = new Note();
        note.name = this.name;
        note.pitch = this.pitch;
        note.duration = this.duration
        note.timeStartInBeats = this.timeStartInBeats;
        note.velocity = this.velocity;

        return note;
    }

    static fromNoteName(name: string, timeStartInBeats: number, duration: NoteLength, velocity: number = null): Note {
        var note = new Note();
        note.name = name;
        note.pitch = tonal.Note.midi(note.name) + 12;
        note.timeStartInBeats = timeStartInBeats;
        note.duration = duration;
        if(velocity) {
            note.velocity = velocity;
        }

        return note;
    }
}


export class NoteLength {
    lengthInBeats: number;
    lengthInBars: number;
    name: string;
    isRest: boolean = false;
    private constructor(lengthInBars: number, lengthInBeats: number, isRest = false) {
        this.lengthInBars = lengthInBars;
        this.lengthInBeats = lengthInBeats;
        this.isRest = false;
    }
    static ThirtySecond = new NoteLength(1 / 32, 1 / 8);
    static TripletSixteenth = new NoteLength( 1/ 24, 1 / 6);
    static Sixteenth = new NoteLength(1 / 16, 1 / 4);
    static TripletEighth = new NoteLength(1/12, 1/3);
    static Eighth = new NoteLength(1 / 8, 1 / 2);
    static DottedEighth = new NoteLength(3/16, 3/4)
    static Quarter = new NoteLength(1 / 4, 1);
    static DottedQuarter = new NoteLength(3/8, 1.5)
    static Half = new NoteLength(1 / 2, 2);
    static DottedHalf = new NoteLength(3/4, 3);
    static Whole = new NoteLength(1, 4);
    static DottedWhole = new NoteLength(1.5, 6);
    static TwoWhole = new NoteLength(2, 8);


    static SixteenthRest = new NoteLength(1 / 16, 1 / 4, true);
    static EighthRest = new NoteLength(1 / 8, 1 / 2, true);
    static QuarterRest = new NoteLength(1 / 4, 1, true);
    static HalfRest = new NoteLength(1 / 2, 2, true);
    static WholeRest = new NoteLength(1, 4, true);

    static fromBeats(beats: number, isRest = false) {
        return new NoteLength(TimePosition.lengthInBars(beats), beats, isRest);
    }

    static fromBars(bars: number, isRest = false) {
        return new NoteLength(bars, TimePosition.lengthInBeats(bars), isRest);
    }
}

export class TimePosition {
    static lengthInBeats(bars: number): number {
        return bars * 4;
    }

    static lengthInBars(beats: number) {
        return beats / 4;
    }
}