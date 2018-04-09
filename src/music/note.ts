import * as Tonal from "tonal";

export class Note {
    noteName: string;
    octave: number;

    get fullName(): string {
        return this.noteName + this.octave;
    }

    addOctave(): Note{
        return this.transposeBy("8P");
    }

    subtractOctave(): Note {
        return this.transposeBy("-8P");
    }

    transposeBy(interval: string): Note { 
        var newNoteNameAndOctave = Tonal.Distance.transpose(this.fullName, interval);

        return Note.fromString(newNoteNameAndOctave);
    }

    distancefrom(note: Note): string {
        return Tonal.Distance.interval(note.fullName, this.fullName);
    }

    distanceTo(note: Note): string {
        return Tonal.Distance.interval(this.fullName, note.fullName);
    }

    distancefromInSemitones(note: Note): number {
        return Tonal.Distance.semitones(note.fullName, this.fullName);
    }

    distanceToInSemitones(note: Note): number {
        return Tonal.Distance.semitones(this.fullName, note.fullName);
    }
    
    clone(): Note {
        var chordNote = new Note();
        chordNote.noteName = this.noteName;
        chordNote.octave = this.octave;

        return chordNote;
    }

    toMidi(): number {
        return Tonal.Note.midi(this.fullName) + 12;
    }

    static fromString(note: string): Note{
        var tokens = Tonal.Note.tokenize(note);
        var chordNote = new Note();
        chordNote.noteName = tokens[0];
        chordNote.octave = parseInt(tokens[2]);
        
        return chordNote;
    }

    static fromMidi(note: number) {
        note = note - 12;
        return this.fromString(Tonal.Note.fromMidi(note));
    }
}