import { Note } from "./note";
import { MidiClip, Note as AbletonJsNote } from "../../../AbletonJS/sdk/index";

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

    toMidiClip(): MidiClip {
        var clip = new MidiClip();
        clip.lengthInBeats = this.duration * 4;
        clip.notes = this._notes.map(x => new AbletonJsNote(x.pitch, x.time, x.durationAsDecimal))

        return clip;
    }
}