import { Config } from "../config/index";
import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { IClipGenerationStrategy } from "../strategies/iclip-generation-strategy";

export class KickDrumGenerator {

    public static TRACK_NAME = "AJS Kick Drum";

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(KickDrumGenerator.TRACK_NAME);
        //await this.generateFourOnFloor(track);
        //await this.generateDancehall(track);
        for (var i = 0; i < Config.KickDrum.strategies.length; i++) {
            var strategy = Config.KickDrum.strategies[i];
            this.generatePhraseFromStrategy(track, strategy);
        }
        return track;
    }

    async generateFourOnFloor(track: Track) {
        var phrase = this.generatePhraseFromPattern("x---x---x---x---", "FourOnFloor").double();
        await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
    }

    async generateDancehall(track: Track) {
        var phrase = this.generatePhraseFromPattern("x--x--x-x--x--x-", "Dancehall1").double();
        await AbletonJs.insertMidiClip(track, phrase.toMidiClip());

        phrase = this.generatePhraseFromPattern("x--x----x--x----", "Dancehall2 ").double();
        await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
    }

    async generatePhraseFromStrategy(track: Track, strategy: IClipGenerationStrategy) {
        for(var i = 0; i <= strategy.numberOfClips; i++) {
            var phrase = strategy.generate();
            await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
        }
    }

    generatePhraseFromPattern(pattern: string, name: string = null) {
        if (pattern.length % 4 !== 0) { throw new Error("Must be 4/4 time yo"); }
        var sixteenthNotes = pattern.length;
        var beats = sixteenthNotes / 4;
        var bars = beats / 4;
        var phrase = new Phrase(bars, name);
        for (var i = 0; i < sixteenthNotes; i++) {
            var action = pattern[i];
            if (action === "x") {
                var note = Note.fromNoteName("C3", i / 4, NoteDuration.Sixteenth);
                phrase.addNote(note);
            }

        }

        return phrase;
    }  

    async clearClips(): Promise<void> {

        var track = await AbletonJs.getTrackByName(KickDrumGenerator.TRACK_NAME);
        await AbletonJs.deleteAllMidiClips(track);

        return;
    }
}