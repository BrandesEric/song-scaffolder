import { Phrase } from "../music/phrase";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { MidiNote } from "../music/midi-note";
import * as AbletonJs from "ableton-js";
import { MidiTrack, MidiClip, createMidiTrackIfNotExists } from "ableton-js";
import { Chord } from "../music/chord";
import { SongConfig } from "../config/song.config";
import { ChordTrack } from "../state/chord-track";
import { RhythmPattern, RhythmType } from "../music/rhythm";
import { BassTrack } from "../state/bass-track";
import { NoteLength } from "../music/note-length";
import { Note } from "../music/note";
import { PhraseBuilder } from "../music/phrase-builder";
import { TrackKind } from "../state/tracks";

export class BassGenerator {

    public bassTrack: BassTrack;
    private scale;
    private chords;

    constructor(bassTrack: BassTrack) {
        this.bassTrack = bassTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName).map(x => x.replace("Maj7", "M").replace("m7", "m").replace("7", ""));
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.bassTrack.name); 
        if(this.bassTrack.clearClips){
            await this.clearClips(track)
        } 

        var sourceTrack = await AbletonJs.getTrackByName(this.bassTrack.sourceTrack);
        var clip: AbletonJs.MidiClip;
        if (this.bassTrack.useSelectedClip) {
            clip = await AbletonJs.getSelectedMidiClip();
        }
        
        if(!clip) {
            clip = (await AbletonJs.getMidiClips(sourceTrack))[0];
        }

        var midiNotes = await AbletonJs.getMidiClipNotes(clip);
        for (var i = 0; i < this.bassTrack.numClips; i++) {
            var phrase = this.generateBassLineFromMidiClip(clip, midiNotes, i);
            await AbletonJs.insertMidiClip(track, phrase.toMidiClip())
        }
    }

    generateBassLineFromMidiClip(clip: AbletonJs.MidiClip, notes: AbletonJs.MidiNote[], index: number): Phrase {
        var noteLength = NoteLength.fromBeats(clip.lengthInBeats);
        var rhythm = RhythmPattern.getPatternByRhythmType(noteLength.lengthInBars, RhythmType.Bass);
        var builder = new PhraseBuilder(rhythm, notes, this.bassTrack.kind);

        var phrase = builder.generatePhrase(`Bass ${index}`);

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