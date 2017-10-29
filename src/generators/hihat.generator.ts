import { Config } from "../config/index";
import { Phrase } from "../music/phrase";
import * as tonal from "tonal";
import { Note, NoteDuration } from "../music/note";
import * as AbletonJs from "ableton-js";
import { Track } from "ableton-js";
import { IClipGenerationStrategy } from "../strategies/iclip-generation-strategy";

export class HiHatGenerator {

    public static TRACK_NAME = "AJS Hihats";

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(HiHatGenerator.TRACK_NAME);
        for (var i = 0; i < Config.HiHat.strategies.length; i++) {
            var strategy = Config.HiHat.strategies[i];
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

        var track = await AbletonJs.getTrackByName(HiHatGenerator.TRACK_NAME);
        if(track){
            await AbletonJs.deleteAllMidiClips(track);
        }

        return;
    }
}