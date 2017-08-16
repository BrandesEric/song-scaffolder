import { Note } from "./note";
import * as AbletonJs from "ableton-js";

export class Phrase {

    private _notes: Note[] = [];

    public duration: number;

    constructor(duration: number) {
        this.duration = duration;
    }

    addNote(note: Note) {
        this._notes.push(note);
    }

    toString(): string {
        return this._notes.map(x => `${x.name}_${x.time}_${x.duration}`).join("  ");
    }

    toMidiClip(): AbletonJs.MidiClip {
        var clip = new AbletonJs.MidiClip();
        clip.lengthInBeats = this.duration * 4;
        clip.notes = this._notes.map(x => new AbletonJs.Note(x.pitch, x.time, x.durationAsDecimal))

        return clip;
    }
}