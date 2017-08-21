import { Config } from "../config/index";
import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";

export class KickDrumGenerator {

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists("AJS Kick Drum");
        //await this.generateFourOnFloor(track);
        //await this.generateDancehall(track);
        for (var i = 0; i < Config.KickDrum.numberOfRandom; i++) {
            await this.generateRandom(track, `Random ${i + 1}`);
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

    async generateRandom(track: Track, name: string = "Random") {
        var phrase = new Phrase(Config.KickDrum.defaultClipLengthInBars, name);
        var beats = phrase.beats;
        var sixteenthNotes = beats * 4;

        for (var i = 0; i < sixteenthNotes; i++) {
            if (i === 0) {
                if (this.shouldHit(Config.KickDrum.initialPercentOfHit)) {
                    phrase.addNote(Note.fromNoteName("C3", i/4, NoteDuration.Sixteenth));
                }
            }
            else {
                var sixteenthsSincePlayed = i - (phrase.lastBeatPlayed * 4);
                var decimalPercent = Config.KickDrum.increasingPercentOfHit / 100;
                var percentChance = (1 - Math.pow(1   - decimalPercent, sixteenthsSincePlayed)) * 100;

                if (this.shouldHit(percentChance)) {
                    phrase.addNote(Note.fromNoteName("C3", i/4, NoteDuration.Sixteenth));
                }

            }
        }

        await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
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

    shouldHit(percentangeChance: number): boolean {
        var rand = Math.random() * 100;
        return rand <= percentangeChance;
    }
}