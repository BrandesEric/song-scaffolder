import { Config } from "../config/index";
import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js/sdk";
import { Track } from "ableton-js/sdk";

export class KickDrumGenerator {
    
    bars: number;

    track: Track;

    constructor() {
        this.bars = Config.KickDrum.bars;
    }

    async generate() {
        this.track = await AbletonJs.createMidiTrackIfNotExists("AJS Kick Drum");
        await this.generateFourOnFloor();
    }
    
    async generateFourOnFloor() {
        var hits = this.bars * 4;
        var phrase = new Phrase(this.bars);
        for(var i = 0; i < hits; i++){
            var note = Note.fromNoteName("C3", i, NoteDuration.Sixteenth);
            phrase.addNote(note);
        }

        AbletonJs.insertMidiClip(this.track, phrase.toMidiClip())
    }
}