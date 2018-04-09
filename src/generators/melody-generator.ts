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
import { MelodyTrack } from "../state/melody-track";
import { PhraseBuilder } from "../music/phrase-builder";

export class MelodyGenerator {

    public melodyTrack: MelodyTrack;
    private scale;
    private chords;

    constructor(melodyTrack: MelodyTrack) {
        this.melodyTrack = melodyTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName).map(x => x.replace("Maj7", "M").replace("m7", "m").replace("7", ""));
    }

    async generate() {
        var track = await AbletonJs.createMidiTrackIfNotExists(this.melodyTrack.name); 
        if(this.melodyTrack.clearClips){
            await this.clearClips(track)
        } 

        var sourceTrack = await AbletonJs.getTrackByName(this.melodyTrack.sourceTrack);
        var clip: AbletonJs.MidiClip;
        if (this.melodyTrack.useSelectedClip) {
            clip = await AbletonJs.getSelectedMidiClip();
        }
        
        if(!clip) {
            clip = (await AbletonJs.getMidiClips(sourceTrack))[0];
        }

        var midiNotes = await AbletonJs.getMidiClipNotes(clip);
        for (var i = 0; i < this.melodyTrack.numClips; i++) {
            var phrase = this.generateMelodyFromMidiClip(clip, midiNotes, i);
            await AbletonJs.insertMidiClip(track, phrase.toMidiClip())
        }
        
    }

    generateMelodyFromMidiClip(clip: AbletonJs.MidiClip, notes: AbletonJs.MidiNote[], index: number): Phrase {
        var noteLength = NoteLength.fromBeats(clip.lengthInBeats);
        var rhythm = RhythmPattern.getPatternByRhythmType(noteLength.lengthInBars, RhythmType.Melody);
        var builder = new PhraseBuilder(rhythm, notes, this.melodyTrack.kind);

        var phrase = builder.generatePhrase(`Melody ${index}`);

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