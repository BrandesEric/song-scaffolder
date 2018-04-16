import { Phrase } from "../music/phrase";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { MidiNote } from "../music/midi-note";
import * as AbletonJs from "ableton-js";
import { MidiTrack } from "ableton-js";
import { Chord } from "../music/chord";
import { SongConfig } from "../config/song.config";
import { ChordTrack } from "../state/chord-track";
import { RhythmPattern, RhythmType } from "../music/rhythm";
import { NoteLength } from "../music/note-length";
import { Note } from "../music/note";

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
    private maxOctave = 4;
    private minOctave = 2;

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

        return this.getChordPhraseWithRhythm(progression);
    }

    generateBasicChordProgressions(): Phrase[] {
        var phrases = [];
        for (var i = 0; i < this.progressions.length; i++) {
            var progression = this.progressions[i];
            var phrase = this.getChordPhraseWithRhythm(progression);
            phrases.push(phrase);
        }

        return phrases;
    }

    private getChordPhraseWithRhythm(progression: number[]): Phrase {
        var chordNames = progression.map(chordNumber => this.chords[chordNumber - 1]);
        var currentClipLengthInBars = 0;
        var progressionPosition = 0;
        var chords = [];

        var rhythm: RhythmPattern;
        if(this.chordTrack.rhythm === "whole") {
            rhythm = RhythmPattern.generateFromNoteLengths(this.chordTrack.clipLengthInBars, [NoteLength.Whole]);
        }
        else if(this.chordTrack.rhythm === "common") {
            rhythm = RhythmPattern.getPatternByRhythmType(this.chordTrack.clipLengthInBars, RhythmType.ChordCommon);
        }
        else {
            rhythm = RhythmPattern.getPatternByRhythmType(this.chordTrack.clipLengthInBars, RhythmType.ChordRandom);
        }

        var lastChord = null;
        rhythm.parts.forEach(duration => {
            var nextChordName = chordNames[progressionPosition % chordNames.length];
            var chordOctave = this.getChordOctave(lastChord, nextChordName);
            var chord = new Chord(nextChordName, duration, this.chordTrack, chordOctave)
            chords.push(chord);
            lastChord = chord;
            var shouldRepeatSameChord = this.getRandomInt(1, 100);
            if(shouldRepeatSameChord > this.chordTrack.percentRepeatChance) {
                progressionPosition++;
            }
        });

        var phrase = new Phrase(this.chordTrack.clipLengthInBars, progression.toString())
        phrase.addNotesFromChords(chords);

        return phrase;
    }

    private getChordOctave(lastChord: Chord, nextChordName: string): number {
        var rand = this.getRandomInt(1, 100);
        if(!lastChord) {
            if(rand < 65) {
                return this.chordTrack.startOctave;
            }
            else {
                return this.chordTrack.startOctave + 1;
            }
        }
        
        var lastNote = lastChord.rootNote;
        if(rand <= 50) {
            return lastNote.octave;
        }
        else {
            var nextRoot = Tonal.Chord.notes(nextChordName)[0];
            var upOctave = Math.min(this.maxOctave, lastNote.octave + 1);
            var upNote = Note.fromString(nextRoot + upOctave);
            var upDistance = Math.abs(lastNote.distanceToInSemitones(upNote));
            var downOctave = Math.max(this.minOctave, lastNote.octave - 1)
            var downNote = Note.fromString(nextRoot + downOctave);
            var downDistance = Math.abs(lastNote.distanceToInSemitones(downNote));
            if(downDistance <= upDistance && downDistance < 8) {
                return downOctave;
            }
            else if(upDistance < 8) {
                return upOctave;
            }   
            else {
                return lastNote.octave;
            }
        }
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
    
    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    async clearClips(track: MidiTrack): Promise<void> {
        await AbletonJs.deleteAllMidiClips(track);
    }
}