import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { KickTrack } from "../state/kick-track";
import { Pattern } from "../music/pattern";
import { SongConfig } from "../config/song.config";

export class KickDrumGenerator {

    kickTrack: KickTrack;

    increasingPercentOfHit = 15;
    initialPercentOfHit =  85;
    defaultLengthInBars = 4;

    commonPatterns = [
        new Pattern("x---x---x---x---",  NoteDuration.Sixteenth ,"FourOnFloor"),
        new Pattern("x--x--x-x--x--x-", NoteDuration.Sixteenth, "Dancehall1"),
        new Pattern("x--x----x--x----", NoteDuration.Sixteenth, "Dancehall2"),
        new Pattern("x-----x---------x-----x-----xxx-", NoteDuration.Sixteenth, "Trap1"),
        new Pattern("x-----x-----x-----x-------x---x-", NoteDuration.Sixteenth, "Trap2"), 
    ];

    constructor(kickTrack: KickTrack) {
        this.kickTrack = kickTrack;
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.kickTrack.name);
        if(this.kickTrack.clearClips) {
            await this.clearClips();
        }
        if(this.kickTrack.includeBasicKicks) {
            for(let i = 0; i < this.commonPatterns.length; i++) {
                var phrase = this.generatePhraseFromPattern(this.commonPatterns[i]);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
            }
        }
        if(this.kickTrack.includeIntervalKicks) {
            for(let i = 0; i < this.kickTrack.numClips; i++) {
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

    shouldHit(percentangeChance: number): boolean {
        var rand = Math.random() * 100;
        return rand <= percentangeChance;
    }

    async clearClips(): Promise<void> {

        var track = await AbletonJs.getTrackByName(this.kickTrack.name);
        if(track){
            await AbletonJs.deleteAllMidiClips(track);
        }

        return;
    }
}