import { Config } from "../config/index";
import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";

export class KickDrumGenerator {
    
    clipLength: number;

    track: Track;

    constructor() {
        this.clipLength = Config.KickDrum.clipLength;
    }

    async generate() {
        this.track = await AbletonJs.createMidiTrackIfNotExists("AJS Kick Drum");
        await this.generateFourOnFloor();
    }
    
    async generateFourOnFloor() {
        var phrase = new Phrase(this.clipLength, "4x4");
        var beats = phrase.beats;
        for(var i = 0; i < beats; i++){
            var note = Note.fromNoteName("C3", i, NoteDuration.Sixteenth);
            phrase.addNote(note);
        }


        var clip = phrase.toMidiClip();
        await AbletonJs.insertMidiClip(this.track, clip);
    }
}