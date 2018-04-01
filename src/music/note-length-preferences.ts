import { NoteLength } from "./note";

export class NoteLengthPreferences {

    public lengths: WeightedNoteLength[] = [];
    public noteWeight: number;
    public restWeight: number;
    public name: string;

    constructor(noteWeight = 80, restWeight = 20, name = ""){
        this.noteWeight = noteWeight;
        this.restWeight = restWeight;
        this.name = name;
    }

    public getRandomNoteLength(): NoteLength {
        var totalWeight = this.lengths.reduce((weight, length) => weight + length.weight, 0);
        var randomVal = this.getRandomInt(1, totalWeight);
        var index = 0;
        var weightedLength = this.lengths[index];
        while(randomVal > weightedLength.weight) {
            randomVal -= weightedLength.weight;
            index++;
            weightedLength = this.lengths[index];
        }
        var noteLength = weightedLength.length;
        noteLength.isRest = this.isRest();

        return noteLength;
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    private isRest(): boolean {
        var totalWeight = this.restWeight + this.noteWeight;
        var random = this.getRandomInt(1, totalWeight);
        return random > this.noteWeight;
    }

    public static shortNotes(noteWeight = 80, restWeight = 20): NoteLengthPreferences{
        var preferences = new NoteLengthPreferences();
        preferences.name = "short"
        preferences.noteWeight = noteWeight;
        preferences.restWeight = restWeight;
        preferences.lengths = [
            new WeightedNoteLength(NoteLength.Sixteenth, 10),
            new WeightedNoteLength(NoteLength.Eighth, 10),
            new WeightedNoteLength(NoteLength.DottedEighth, 3),
            new WeightedNoteLength(NoteLength.Quarter, 7),
            new WeightedNoteLength(NoteLength.DottedQuarter, 3),
            new WeightedNoteLength(NoteLength.Half, 1)
        ];

        return preferences;
    }

    public static mediumNotes(noteWeight = 80, restWeight = 20): NoteLengthPreferences{
        var preferences = new NoteLengthPreferences();
        preferences.name = "medium";
        preferences.noteWeight = noteWeight;
        preferences.restWeight = restWeight;
        preferences.lengths = [
            new WeightedNoteLength(NoteLength.Sixteenth, 1),
            new WeightedNoteLength(NoteLength.Eighth, 3),
            new WeightedNoteLength(NoteLength.DottedEighth, 5),
            new WeightedNoteLength(NoteLength.Quarter, 10),
            new WeightedNoteLength(NoteLength.DottedQuarter, 7),
            new WeightedNoteLength(NoteLength.Half, 10),
            new WeightedNoteLength(NoteLength.DottedHalf, 7),
            new WeightedNoteLength(NoteLength.Whole, 2)
        ];

        return preferences;
    }

    public static longNotes(noteWeight = 80, restWeight = 20): NoteLengthPreferences{
        var preferences = new NoteLengthPreferences();
        preferences.name = "long";
        preferences.noteWeight = noteWeight;
        preferences.restWeight = restWeight;
        preferences.lengths = [
            new WeightedNoteLength(NoteLength.Half, 5),
            new WeightedNoteLength(NoteLength.DottedHalf, 5),
            new WeightedNoteLength(NoteLength.Whole, 10),
            new WeightedNoteLength(NoteLength.DottedWhole, 10),
            new WeightedNoteLength(NoteLength.TwoWhole, 2)
        ];

        return preferences;
    }
}

export class WeightedNoteLength {
    constructor(public length: NoteLength, public weight: number){}
}

