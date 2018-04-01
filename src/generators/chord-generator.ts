import { Phrase } from "../music/phrase";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { Note, NoteLength } from "../music/note";
import * as AbletonJs from "ableton-js";
import { MidiTrack } from "ableton-js";
import { Chord } from "../music/chord";
import { SongConfig } from "../config/song.config";
import { ChordTrack } from "../state/chord-track";

type ChordNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ChordWeight = number;
type WeightedChordNumber = [ChordNumber, ChordWeight]
type WeightedChordMap = {
    [key: string]: WeightedChordNumber[]
}

export class ChordGenerator {

    public chordTrack: ChordTrack;
    private scale;
    private chords;

    private progressions = [
        [1, 5, 6, 4],
        [1, 4, 6, 5],
        [1, 6, 4, 5],
        [1, 5, 4, 5],
        [4, 1, 5, 6],
        [5, 6, 4, 1],
        [6, 5, 4, 5],
        [6, 4, 1, 5],
        [1, 2, 3, 4, 5, 6, 7, 1]
    ];


    majorChordStart: WeightedChordNumber[] = [[1, 60], [4, 10], [5, 10], [6, 20]];

    majorChordMap: WeightedChordMap = {
        "1": [
            [1, 4],
            [2, 2],
            [3, 2],
            [4, 10],
            [5, 10],
            [6, 10],
        ],
        "2": [
            [3, 10],
            [5, 10],
            [1, 2],
        ],
        "3": [
            [4, 10],
            [6, 10],
            [1, 4],
        ],
        "4": [
            [2, 10],
            [5, 10],
            [1, 10],
        ],
        "5": [
            [3, 10],
            [6, 10],
            [1, 10],
        ],
        "6": [
            [4, 10],
            [2, 10],
            [1, 5],
        ],
    };

    constructor(chordTrack: ChordTrack) {
        this.chordTrack = chordTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName).map(x => x.replace("Maj7", "M").replace("m7", "m").replace("7", ""));
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.chordTrack.name); 
        if(this.chordTrack.clearClips){
            await this.clearClips(track)
        } 
        if(this.chordTrack.includeBasicChords){
            var phrases = this.generateBasicChordProgressions();
            for(var i = 0; i < phrases.length; i++) {
                await AbletonJs.insertMidiClip(track, phrases[i].toMidiClip());
            } 
        }
        if(this.chordTrack.includeRandomChords){
            for(var i = 0; i < this.chordTrack.numClips; i++) {
                var phrase = this.generateRandomChordProgression();
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
    }
 
    generateRandomChordProgression(): Phrase {
        var progression = [];
        var startingChordNumber = this.getRandomChordStart();
        var currentChordNumber = startingChordNumber; // I, ii, VI etc
        progression.push(startingChordNumber);
        for(var i = 0; i < 3; i++) {
            var nextChordNumber = this.getRandomNextChordNumber(currentChordNumber)
            progression.push(nextChordNumber);
            currentChordNumber = nextChordNumber;
        }
        
        return this.getChordPhraseWithRandomizedDuration(progression);
    }

    generateBasicChordProgressions(): Phrase[] {
        var phrases = [];
        for (var i = 0; i < this.progressions.length; i++) {
            var progression = this.progressions[i];
            var chordNames = progression.map(chordNumber => this.chords[chordNumber - 1]);
            if(this.chordTrack.randomizeChordDuration){
                var phrase = this.getChordPhraseWithRandomizedDuration(progression);
                phrases.push(phrase);
            }
            else {
                var chords = chordNames.map(chordName => new Chord(chordName, NoteLength.Whole, this.chordTrack));
                var phrase = new Phrase(progression.length, progression.toString());
                phrase.addNotesFromChords(chords);
                phrases.push(phrase);
            }
        }

        return phrases;
    }

    private getChordPhraseWithRandomizedDuration(progression: number[]): Phrase {
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

    private getRandomChordStart(): ChordNumber {
        var totalWeight = this.majorChordStart.reduce((accum, current) =>  current[1] + accum , 0);
        var randomChance = this.getRandomInt(1, totalWeight);
        for(var i = 0; i < this.majorChordStart.length; i++) {
            if(randomChance <= this.majorChordStart[i][1]) {
                return this.majorChordStart[i][0];
            }
            else {
                randomChance -= this.majorChordStart[i][1];
            }
        }

        throw new Error("Should always be able to find a starting chord!");
    }

    getRandomNextChordNumber(currentChord: ChordNumber): ChordNumber {
        var weightedMap = this.majorChordMap[currentChord.toString()];
        var totalWeight = weightedMap.reduce((accum, current) =>  current[1] + accum , 0);
        var randomChance = this.getRandomInt(1, totalWeight);
        for(var i = 0; i < weightedMap.length; i++) {
            if(randomChance <= weightedMap[i][1]) {
                return weightedMap[i][0];
            }
            else {
                randomChance -= weightedMap[i][1];
            }
        }

        throw new Error("Should always be able to find a next chord!");
    }

    private getRandomChordDuration(): NoteLength {
        var randomChance = this.getRandomInt(1, 100);
        if(randomChance <= this.quarterNotePercentChance) {
            return NoteLength.Quarter
        }
        randomChance -= this.quarterNotePercentChance;
        if(randomChance <= this.halfNotePercentChance) {
            return NoteLength.Half
        }
        randomChance -= this.halfNotePercentChance;
        if(randomChance <= this.wholeNotePercentChance){
            return NoteLength.Whole;
        }
        randomChance -= this.wholeNotePercentChance;
        if(randomChance <= this.twoWholeNotePercentChance){
            return NoteLength.TwoWhole;
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

    async clearClips(track: MidiTrack): Promise<void> {
        await AbletonJs.deleteAllMidiClips(track);
    }
}