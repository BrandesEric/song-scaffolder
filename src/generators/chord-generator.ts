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
        var simpleChords = new SimpleChordStrategy(this.chordTrack.startOctave)
        await simpleChords.generate();
        // for (var i = 0; i < this.strategies.length; i++) {
        //     var strategy = this.strategies[i];
        //     await this.generatePhraseFromStrategy(track, strategy);
        // }
        return track;
    }

   
    async generatePhraseFromStrategy(track: Track, strategy: IClipGenerationStrategy) {
        for(var i = 0; i < strategy.numberOfClips; i++) {
            var phrase = strategy.generate();
            await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
        }
    }

    async clearClips(): Promise<void> {

        var track = await AbletonJs.getTrackByName(this.chordTrack.name);
        if(track){
            await AbletonJs.deleteAllMidiClips(track);
        }

        return;
    }
}