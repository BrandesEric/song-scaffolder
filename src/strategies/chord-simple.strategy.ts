import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration, TimePosition } from "../music/note";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { SongConfig } from "../config/song.config";
import { Chord } from "../music/chord";
import { ChordTrack } from "../state/tracks";

export class SimpleChordStrategy {

    private scale;
    private chords;
    private chordTrack: ChordTrack;

    private progressions = [
        [1, 5, 6, 4],
        [1, 4, 6, 5],
        [1, 6, 4, 5],
        [1, 5, 4, 5],
        [4, 1, 5, 6],
        [5, 6, 4, 1],
        [6, 5, 4, 5],
        [6, 4, 1, 5],
    ]

    numberOfClips: number = this.progressions.length;

    constructor(chordTrack: ChordTrack) {
        this.chordTrack = chordTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName).map(x => x.replace("Maj7", "M").replace("m7", "m").replace("7", ""));
    }
    generateAll(): Phrase[] {
        var phrases = [];
        for (var i = 0; i < this.progressions.length; i++) {
            var progression = this.progressions[i];
            var chordNames = progression.map(chordNumber => this.chords[chordNumber - 1]);
            if(this.chordTrack.randomizeChordDuration){
                var phrase = this.getRandomChordPhrase(progression);
                phrases.push(phrase);
            }
            else {
                var chords = chordNames.map(chordName => new Chord(chordName, NoteDuration.Whole, this.chordTrack));
                var phrase = new Phrase(progression.length, progression.toString());
                phrase.addNotesFromChords(chords);
                phrases.push(phrase);
            }
            
        }

        return phrases;
    }

    private getRandomChordPhrase(progression: number[]): Phrase {
        var chordNames = progression.map(chordNumber => this.chords[chordNumber - 1]);
        var currentClipLengthInBars = 0;
        var progressionPosition = 0;
        var chords = [];
        while(currentClipLengthInBars < this.chordTrack.clipLengthInBars){
            var duration = this.getRandomChordDuration();
            var chord = new Chord(chordNames[progressionPosition % chordNames.length], duration, this.chordTrack)
            chords.push(chord);
            var shouldRepeatSameChord = this.getRandomInt(1, 100);
            if(shouldRepeatSameChord > this.chordTrack.percentRepeatChance) {
                progressionPosition++;
            }
            currentClipLengthInBars += duration.lengthInBars;
        }

        var phrase = new Phrase(this.chordTrack.clipLengthInBars, progression.toString())
        phrase.addNotesFromChords(chords);

        return phrase;
    }

    private getRandomChordDuration(): NoteDuration {
        var randomChance = this.getRandomInt(1, 100);
        if(randomChance <= this.quarterNotePercentChance) {
            return NoteDuration.Quarter
        }
        randomChance -= this.quarterNotePercentChance;
        if(randomChance <= this.halfNotePercentChance) {
            return NoteDuration.Half
        }
        randomChance -= this.halfNotePercentChance;
        if(randomChance <= this.wholeNotePercentChance){
            return NoteDuration.Whole;
        }
        randomChance -= this.wholeNotePercentChance;
        if(randomChance <= this.twoWholeNotePercentChance){
            return NoteDuration.TwoWhole;
        }

        throw new Error("ACK, should never not find a note duration!!");
    }
    
    private get totalChances(): number {
        return  this.chordTrack.quarterNoteChance + 
            this.chordTrack.halfNoteChance +
            this.chordTrack.wholeNoteChance +
            this.chordTrack.twoWholeNoteChance
    }

    private get quarterNotePercentChance(): number {
        return Math.floor((this.chordTrack.quarterNoteChance / this.totalChances) * 100);
    }

    private get halfNotePercentChance(): number {
        return Math.floor((this.chordTrack.halfNoteChance / this.totalChances) * 100);
    }

    private get wholeNotePercentChance(): number {
        return Math.floor((this.chordTrack.wholeNoteChance / this.totalChances) * 100);
    }

    private get twoWholeNotePercentChance(): number {
        return Math.floor((this.chordTrack.twoWholeNoteChance / this.totalChances) * 100);
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

} 