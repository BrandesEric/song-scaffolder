import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { IClipGenerationStrategy } from "../strategies/iclip-generation-strategy";
import { KickDrumCommonStrategy } from "../strategies/kick-drum-common.strategy";
import { KickDrumIntervalStrategy } from "../strategies/kick-drum-interval.strategy";
import { KickDrumPatternStrategy } from "../strategies/kick-drum-pattern.strategy";

export class KickDrumGenerator {

    trackName: string;

    strategies = [
        new KickDrumCommonStrategy(),
        new KickDrumIntervalStrategy(),
        new KickDrumPatternStrategy()
    ]

    constructor(trackName: string) {
        this.trackName = trackName;
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.trackName);
        for (var i = 0; i < this.strategies.length; i++) {
            var strategy = this.strategies[i];
            await this.generatePhraseFromStrategy(track, strategy);
        }
        return track;
    }

   
    async generatePhraseFromStrategy(track: Track, strategy: IClipGenerationStrategy) {
        for(var i = 0; i < strategy.numberOfClips; i++) {
            var phrase = strategy.generate();
            await AbletonJs.insertMidiClip(track, phrase.toMidiClip());
        }
    }

    async clearClips(): Promise<void> {

        var track = await AbletonJs.getTrackByName(this.trackName);
        if(track){
            await AbletonJs.deleteAllMidiClips(track);
        }

        return;
    }
}