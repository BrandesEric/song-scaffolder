import * as tonal from "tonal";

export class Note {
    name: string;
    pitch: number;
    duration: NoteDuration;
    timeStartInBeats: number;

    get durationInBeats(): number {
        return this.duration.lengthInBeats;
    }

    clone(): Note {
        var note = new Note();
        note.name = this.name;
        note.pitch = this.pitch;
        note.duration = this.duration
        note.timeStartInBeats = this.timeStartInBeats;

        return note;
    }

    static fromNoteName(name: string, timeStartInBeats: number, duration: NoteDuration): Note {
        var note = new Note();
        note.name = name;
        note.pitch = tonal.note.midi(note.name) + 12;
        note.timeStartInBeats = timeStartInBeats;
        note.duration = duration;

        return note;
    }
}


export class NoteDuration {
    lengthInBeats: number;
    lengthInBars: number;
    name: string;
    private constructor(lengthInBars: number, lengthInBeats: number) {
        this.lengthInBars = lengthInBars;
        this.lengthInBeats = lengthInBeats;
    }
    static ThirtySecond = new NoteDuration(1 / 32, 1 / 8);
    static Sixteenth = new NoteDuration(1 / 16, 1 / 4);
    static Eighth = new NoteDuration(1 / 8, 1 / 2);
    static Quarter = new NoteDuration(1 / 4, 1);
    static Half = new NoteDuration(1 / 2, 2);
    static Whole = new NoteDuration(1, 4);
}