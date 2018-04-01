import { NoteLength, RestLength } from "./note";

export class PhrasePreferences {

    public lengths: WeightedNoteLength[] = [];
    public noteWeight: number;
    public restWeight: number;
    public name: string;

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

        return weightedLength.length;
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    public static shortNotes(): PhrasePreferences{
        var preferences = new PhrasePreferences();
        preferences.name = "short"
        preferences.noteWeight = 80;
        preferences.restWeight = 20;
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

    public static mediumNotes(): PhrasePreferences{
        var preferences = new PhrasePreferences();
        preferences.name = "medium";
        preferences.noteWeight = 80;
        preferences.restWeight = 20;
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

    public static longNotes(): PhrasePreferences{
        var preferences = new PhrasePreferences();
        preferences.name = "long";
        preferences.noteWeight = 80;
        preferences.restWeight = 20;
        preferences.lengths = [
            new WeightedNoteLength(NoteLength.Quarter, 5),
            new WeightedNoteLength(NoteLength.DottedQuarter, 4),
            new WeightedNoteLength(NoteLength.Half, 5),
            new WeightedNoteLength(NoteLength.Whole, 10),
            new WeightedNoteLength(NoteLength.DottedWhole, 10),
            new WeightedNoteLength(NoteLength.TwoWhole, 5)
        ];

        return preferences;
    }
}

export class WeightedNoteLength {
    constructor(public length: NoteLength, public weight: number){}
}

