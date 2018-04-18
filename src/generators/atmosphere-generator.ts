import { Phrase } from "../music/phrase";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { MidiNote } from "../music/midi-note";
import * as AbletonJs from "ableton-js";
import { MidiTrack, MidiClip, createMidiTrackIfNotExists } from "ableton-js";
import { Chord } from "../music/chord";
import { SongConfig } from "../config/song.config";
import { RhythmPattern, RhythmType } from "../music/rhythm";
import { NoteLength } from "../music/note-length";
import { Note } from "../music/note";
import { PhraseBuilder } from "../music/phrase-builder";
import { TrackKind } from "../state/tracks";
import { AtmosphereTrack } from "../state/atmosphere-track";

export class AtmosphereGenerator {

    public atmosphereTrack: AtmosphereTrack;
    private scale;

    constructor(atmosphereTrack: AtmosphereTrack) {
        this.atmosphereTrack = atmosphereTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.atmosphereTrack.name); 
        if(this.atmosphereTrack.clearClips){
            await this.clearClips(track)
        } 

        for (var i = 0; i < this.atmosphereTrack.numClips; i++) {
            var phrase = this.generateAtmosphereLine(i);
            await AbletonJs.insertMidiClip(track, phrase.toMidiClip())
        }
    }

    generateAtmosphereLine(index: number): Phrase {
        var rhythmType = this.atmosphereTrack.rhythmType === "pattern" ? RhythmType.AtmospherePattern:  RhythmType.AtmosphereRandom;
        var rhythm = RhythmPattern.getPatternByRhythmType(this.atmosphereTrack.lengthInBars, rhythmType);
        var builder = new PhraseBuilder(rhythm, null, this.atmosphereTrack.kind);

        var phrase = builder.generatePhrase(`Atmosphere ${index}`);

        return phrase;
    }
    

    async clearClips(track: MidiTrack): Promise<void> {
        await AbletonJs.deleteAllMidiClips(track);
    }
}

enum PitchPreference {
    Unspecified,
    Lowest,
    Highest,
    NotPresent,
    Random
}