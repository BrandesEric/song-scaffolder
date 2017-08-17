import { Note } from "./note";
import * as AbletonJs from "ableton-js";

export class Phrase {

    private _notes: Note[] = [];

    public bars: number;

    public name: string;

    public get beats(): number {
        return this.bars * 4;
    }

    constructor(bars: number, name: string = null) {
        this.bars = bars;
        this.name = name;
    }

    addNote(note: Note) {
        this._notes.push(note);
    }

    toString(): string {
        return this._notes.map(x => `${x.name}_${x.time}_${x.duration}`).join("  ");
    }

    toMidiClip(): AbletonJs.MidiClip {
        var clip = new AbletonJs.MidiClip();
        clip.lengthInBeats = this.beats;
        clip.name = this.name;
        clip.notes = this._notes.map(x => new AbletonJs.Note(x.pitch, x.time, x.durationAsDecimal))
        
        return clip;
    }
}