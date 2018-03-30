import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { IClipGenerationStrategy } from "../strategies/iclip-generation-strategy";
import { KickDrumCommonStrategy } from "../strategies/kick-drum-common.strategy";
import { KickDrumIntervalStrategy } from "../strategies/kick-drum-interval.strategy";
import { KickDrumPatternStrategy } from "../strategies/kick-drum-pattern.strategy";
import { KickTrack } from "../state/kick-track";
import { Pattern } from "../music/pattern";
import { SongConfig } from "../config/song.config";

export class KickDrumGenerator {

    kickTrack: KickTrack;

    commonPatterns = [
        new Pattern("x---x---x---x---",  NoteDuration.Sixteenth ,"FourOnFloor"),
        new Pattern("x--x--x-x--x--x-", NoteDuration.Sixteenth, "Dancehall1"),
        new Pattern("x--x----x--x----", NoteDuration.Sixteenth, "Dancehall2")
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

    async clearClips(): Promise<void> {

        var track = await AbletonJs.getTrackByName(this.kickTrack.name);
        if(track){
            await AbletonJs.deleteAllMidiClips(track);
        }

        return;
    }
}