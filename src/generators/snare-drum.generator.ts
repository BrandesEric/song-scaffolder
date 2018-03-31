import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { SnareTrack } from "../state/snare-track";
import { Pattern } from "../music/pattern";
import { WeightedPattern } from "../music/weighted-pattern";
import { SongConfig } from "../config/song.config";

export class SnareDrumGenerator {

    snareTrack: SnareTrack

    increasingPercentOfHit = 25;
    initialPercentOfHit =  50;
    defaultLengthInBars = 4;

    commonPatterns = [
        new Pattern("--x---x---x---x-",  NoteDuration.Sixteenth ,"MidBeat"),
        new Pattern("----x-------x---",  NoteDuration.Sixteenth ,"Downbeat"),
        new Pattern("----x--xx-x-x---",  NoteDuration.Sixteenth ,"Fancier"),
        new Pattern("--------x-----x---x-----x-------",  NoteDuration.ThirtySecond ,"Trap"),
        new Pattern("xxxx", NoteDuration.Sixteenth, "Roll") 
    ];

    partialPatterns: WeightedPattern[] = [
        new WeightedPattern(new Pattern("x---"), 50),
        new WeightedPattern(new Pattern("--x-"), 40),
        new WeightedPattern(new Pattern("-x-x"), 20),
        new WeightedPattern(new Pattern("---x"), 10),
        new WeightedPattern(new Pattern("x-x-"), 10),
        new WeightedPattern(new Pattern("----"), 20),
        new WeightedPattern(new Pattern("xxxx"), 5),
    ]


    constructor(snareTrack: SnareTrack) {
        this.snareTrack = snareTrack
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.snareTrack.name);
        if(this.snareTrack.clearClips) {
            await this.clearClips(track);
        }
        if(this.snareTrack.includeBasicSnares) {
            for(let i = 0; i < this.commonPatterns.length; i++) {
                var phrase = this.generatePhraseFromPattern(this.commonPatterns[i]);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
        if(this.snareTrack.includeRandomSnares) {
            for(let i = 0; i < this.snareTrack.numClips; i++) {
                var phrase = this.generateRandomSnarePattern(`Random ${i+1}`);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
        if(this.snareTrack.includeIntervalSnares) {
            for(let i = 0; i < this.snareTrack.numClips; i++) {
                var phrase = this.generatePhraseFromIntervals(`Interval ${i+1}`);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
    }

    private generatePhraseFromPattern(pattern: Pattern) {
        var phrase = new Phrase(pattern.lengthInBars, pattern.name);
        for (var i = 0; i < pattern.patternString.length; i++) {
            var action = pattern.patternString[i];
            if (action === "x") {
                var note = Note.fromNoteName(`${SongConfig.key}3`, i * pattern.individualNoteDuration.lengthInBeats, pattern.individualNoteDuration);
                phrase.addNote(note);
            }
        }

        return phrase;
    } 

    private generatePhraseFromIntervals(clipName: string): Phrase {
        var phrase = new Phrase(this.defaultLengthInBars/2,  clipName);
        var beats = phrase.numberOfBeats;

        for (var i = 0; i < beats; i+= 0.25) {
            if (i === 0) {
                if (this.shouldHit(this.initialPercentOfHit)) {
                    phrase.addNote(Note.fromNoteName(`${SongConfig.key}3`, i, NoteDuration.Sixteenth));
                } 
            }
            else {
                var sixteenthsSincePlayed = i - phrase.lastBeatPlayed;
                var decimalPercent = this.increasingPercentOfHit / 100;
                var percentChance = (1 - Math.pow(1   - decimalPercent, sixteenthsSincePlayed)) * 100;

                if (this.shouldHit(percentChance)) {
                    phrase.addNote(Note.fromNoteName(`${SongConfig.key}3`, i, NoteDuration.Sixteenth));
                }
            }
        }

        return phrase.double();
    }

    private shouldHit(percentangeChance: number): boolean {
        var rand = Math.random() * 100;
        return rand <= percentangeChance;
    }

    generateRandomSnarePattern(clipName: string): Phrase { 
        var pattern = this.getRandomPattern();
        while(pattern.lengthInBars < (this.defaultLengthInBars / 2)) {
            pattern = pattern.concat(this.getRandomPattern());
        }
        pattern.name = clipName;
        return this.generatePhraseFromPattern(pattern)
    }

    private getRandomPattern(): Pattern {
        var totalWeightOfAllPatterns = this.partialPatterns.reduce((weight, current) => weight + current.weight, 0);
        var randomNumber = this.getRandomInt(0, totalWeightOfAllPatterns);
        for(var i = 0; i < this.partialPatterns.length; i++){
            var pattern = this.partialPatterns[i];
            if(randomNumber <= pattern.weight) {
                return pattern.pattern;
            }
            else {
                randomNumber -= pattern.weight;
            }
        };

        throw new Error("Should always find a random pattern");
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    async clearClips(track: Track): Promise<void> {
        await AbletonJs.deleteAllMidiClips(track);
    }
}