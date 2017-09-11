import * as tonal from "tonal";

export class Note {
    name: string;
    pitch: number;
    duration: NoteDuration;
    timeStartInBeats: number;
    
    get durationInBeats(): number {
        return Note.durationAsBeats(this.duration);
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

    static durationAsBeats(duration: NoteDuration): number {
        switch (duration) {
            case NoteDuration.ThirtySecond:
                return 1 / 8;
            case NoteDuration.Sixteenth:
                return 1 / 4;
            case NoteDuration.Eighth:
                return 1 / 2;
            case NoteDuration.Quarter:
                return 1;
            case NoteDuration.Half:
                return 2;
            case NoteDuration.Whole:
                return 4;
        }
    }
}


export enum NoteDuration {
    Unknown,
    ThirtySecond = "1/32",
    Sixteenth = "1/16",
    Eighth = "1/8",
    Quarter = "1/4",
    Half = "1/2",
    Whole = "1"
}