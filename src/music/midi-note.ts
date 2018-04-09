import * as tonal from "tonal";
import { NoteLength } from "./note-length";
import { Note } from "./note";

export class MidiNote {
    name: string;
    pitch: number;
    duration: NoteLength;
    timeStartInBeats: number;
    velocity = 127

    get durationInBeats(): number {
        return this.duration.lengthInBeats;
    }

    clone(): MidiNote {
        var note = new MidiNote();
        note.name = this.name;
        note.pitch = this.pitch;
        note.duration = this.duration
        note.timeStartInBeats = this.timeStartInBeats;
        note.velocity = this.velocity;

        return note;
    }

    static fromNoteName(name: string, timeStartInBeats: number, duration: NoteLength, velocity: number = null): MidiNote {
        var note = new MidiNote();
        note.name = name;
        note.pitch = tonal.Note.midi(note.name) + 12;
        note.timeStartInBeats = timeStartInBeats;
        note.duration = duration;
        if(velocity) {
            note.velocity = velocity;
        }

        return note;
    }

    toNote(): Note {
        return Note.fromString(this.name);
    }
}