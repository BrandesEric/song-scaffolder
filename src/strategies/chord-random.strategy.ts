import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration, TimePosition } from "../music/note";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { SongConfig } from "../config/song.config";
import { Chord } from "../music/chord";

type ChordNumber = number;
type ChordWeight = number;
type WeightedChordNumber = [ChordNumber, ChordWeight]
type WeightedChordMap = {
    [key: string]: WeightedChordNumber[]
}

export class RandomChordStrategy implements IClipGenerationStrategy {

    private scale;
    private chords: string[];
    private startOctave: number;
    private currentProgression = 0;
    private duration: NoteDuration;

    numberOfClips = 5;

    lengthInBars = 2; 

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

    constructor(startOctave = 2, duration: NoteDuration = NoteDuration.Quarter, lengthInBars = 2) {
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.chords = Key.chords(scaleName);
        this.startOctave = startOctave;
        this.duration = duration;
    }

    generate(): Phrase {
        var lengthInBars = 0;
        var prevChord: Chord;
        var chords: Chord[] = [];
        while(lengthInBars < this.lengthInBars){
            var chord: Chord;
            if(prevChord){
                chord = this.getRandomChord(prevChord)
            }
            else {
                chord = new Chord(this.chords[0], this.duration, this.startOctave);
            }

            chords.push(chord);
            prevChord = chord;
            lengthInBars += this.duration.lengthInBars;
        }

        var phrase = new Phrase(this.lengthInBars, "Random Chord");
        phrase.addNotesFromChords(chords);

        return phrase;
    }

    private getRandomChord(prevChord: Chord): Chord {
        var chordNumber = this.chords.indexOf(prevChord.name) + 1;
        var nextChordPossibilities = this.majorChordMap[chordNumber.toString()];
        var nextChordNumber = this.getRandomNextChordNumber(nextChordPossibilities)[0];
        console.log(nextChordNumber);
        var chord = new Chord(this.chords[nextChordNumber - 1], this.duration, this.startOctave);

        return chord;
    }

    private getRandomNextChordNumber(weightedChordNumbers: WeightedChordNumber[]): WeightedChordNumber {
        var totalWeightOfAllChords = weightedChordNumbers.reduce((weight, current) => weight + current[1], 0);
        var randomNumber = this.getRandomInt(0, totalWeightOfAllChords);
        var currentPosition = 0;
        var selectedChord = weightedChordNumbers[0];
        for(var i = 0; i < weightedChordNumbers.length; i++){
            var weightedChord: WeightedChordNumber = weightedChordNumbers[i];
            var currentRangeMin = currentPosition;
            var currentRangeMax = currentPosition + weightedChord[1];
            if(currentRangeMin <= randomNumber && randomNumber <= currentRangeMax) {
                selectedChord = weightedChord;
                break;
            }
            currentPosition = currentRangeMax;
        };
        console.log(selectedChord);
        return selectedChord;
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
} 