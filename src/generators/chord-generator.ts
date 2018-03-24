import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { IClipGenerationStrategy } from "../strategies/iclip-generation-strategy";
import { SimpleChordStrategy } from "../strategies/chord-simple.strategy";
import { ChordTrack } from "../state/tracks";

export class ChordGenerator {

    public chordTrack: ChordTrack;

    constructor(chordTrack: ChordTrack) {
        this.chordTrack = chordTrack;
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.chordTrack.name); 
        if(this.chordTrack.clearClips){
            await this.clearClips(track)
        } 
        if(this.chordTrack.includeBasicChords){
            await this.generateSimpleChords(track);
        }
    }
 
    async generateSimpleChords(track: Track){
        var simpleChords = new SimpleChordStrategy(this.chordTrack)
        var phrases = simpleChords.generateAll();
        for(var i = 0; i < phrases.length; i++) {
            await AbletonJs.insertMidiClip(track, phrases[i].toMidiClip());
        }
        
    }

    async clearClips(track: Track): Promise<void> {
        await AbletonJs.deleteAllMidiClips(track);
    }
}