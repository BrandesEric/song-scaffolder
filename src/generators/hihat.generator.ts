import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { Pattern } from "../music/pattern";
import { WeightedPattern } from "../music/weighted-pattern";
import { SongConfig } from "../config/song.config";
import { HihatTrack } from "../state/hihat-track";

export class HihatGenerator {

    hihatTrack: HihatTrack

    increasingPercentOfHit = 25;
    initialPercentOfHit =  50;
    defaultLengthInBars = 4;

    commonPatterns = [
        new Pattern("x-x-x-x-x-x-x-x-",  NoteDuration.Sixteenth ,"Downbeat"),
        new Pattern("-x-x-x-x-x-x-x-x",  NoteDuration.Sixteenth ,"Upbeat"),
        new Pattern("xxxxxxxxxxxxxxxx",  NoteDuration.Sixteenth ,"EveryBeat"),
        new Pattern("x---x---x---x---", NoteDuration.Sixteenth, "Quarters"),
        new Pattern("x-xxx-x-x-xxx-x-", NoteDuration.Sixteenth, "Rhythm1"),
        new Pattern("x-xxx-x-x-xxx-x-", NoteDuration.Sixteenth, "Rhythm1"),
        new Pattern("xxx-x-xxxxx-x-xx", NoteDuration.Sixteenth, "Rhythm2"),
        new Pattern("x-x-x-xxx-x-x-xx", NoteDuration.Sixteenth, "Rhythm3"),
        new Pattern("xxx-x-x-xxx-x-x-", NoteDuration.Sixteenth, "Rhythm4")
    ];

    partialPatterns: WeightedPattern[] = [
        new WeightedPattern(new Pattern("x-x-"), 60),
        new WeightedPattern(new Pattern("xxxx"), 20),
        new WeightedPattern(new Pattern("-x-x"), 20),
        new WeightedPattern(new Pattern("xxx-"), 10),
        new WeightedPattern(new Pattern("-xxx"), 10),
        new WeightedPattern(new Pattern("x-xx"), 10),
        new WeightedPattern(new Pattern("xx-x"), 10),
    ]


    constructor(hihatTrack: HihatTrack) {
        this.hihatTrack = hihatTrack
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.hihatTrack.name);
        if(this.hihatTrack.clearClips) {
            await this.clearClips(track);
        }
        if(this.hihatTrack.includeBasicHats) {
            for(let i = 0; i < this.commonPatterns.length; i++) {
                var phrase = this.generatePhraseFromPattern(this.commonPatterns[i]);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
        if(this.hihatTrack.includeRandomHats) {
            for(let i = 0; i < this.hihatTrack.numClips; i++) {
                var phrase = this.generateRandomHatPattern(`Random ${i+1}`);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
        if(this.hihatTrack.includeTrapHats) {
            // for(let i = 0; i < this.hihatTrack.numClips; i++) {
            //     var phrase = this.generatePhraseFromIntervals(`Interval ${i+1}`);
            //     await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            // }
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

    generateRandomHatPattern(clipName: string): Phrase { 
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