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

    distancefrom(chordNote: Note): string {
        return Tonal.Distance.interval(chordNote.fullName, this.fullName);
    }

    distanceTo(chordNote: Note): string {
        return Tonal.Distance.interval(this.fullName, chordNote.fullName);
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
}