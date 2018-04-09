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
        if (this.melodyTrack.useSelectedClip) {

        }
        else {
            var firstClip = (await AbletonJs.getMidiClips(sourceTrack))[0];
            var midiNotes = await AbletonJs.getMidiClipNotes(firstClip);
            for (var i = 0; i < this.melodyTrack.numClips; i++) {
                var phrase = this.generateMelodyFromMidiClip(firstClip, midiNotes);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip())
            }
        }
    }

    generateMelodyFromMidiClip(clip: AbletonJs.MidiClip, notes: AbletonJs.MidiNote[]): Phrase {
        var noteLength = NoteLength.fromBeats(clip.lengthInBeats);
        var rhythm = RhythmPattern.getPatternByRhythmType(noteLength.lengthInBars, RhythmType.Bass);
        var phrase = new Phrase(noteLength.lengthInBars, "Melody Rand");
        var currentTimeInBeats = 0;
        rhythm.parts.forEach(noteLength => {
            var note = this.getPitchAtTimeInBeats(currentTimeInBeats, notes);
            var midiNote = MidiNote.fromNoteName(note.fullName, currentTimeInBeats, noteLength);
            phrase.addMidiNote(midiNote);
            currentTimeInBeats += noteLength.lengthInBeats;
        });

        return phrase;
    }

    getPitchAtTimeInBeats(timeInBeats: number, notes: AbletonJs.MidiNote[], pitch: PitchPreference = PitchPreference.Lowest): Note {
        notes = notes.sort((a, b) => a.time - b.time);
        console.log(notes);
        var notesAtTime = notes.filter(x => {
            if (x.time === timeInBeats) {
                return true;
            }
            else if(x.time < timeInBeats && x.time + x.duration > timeInBeats) {
                return true;
            }

            return false;
        });

        notesAtTime = notesAtTime.sort((a, b) => a.pitch - b.pitch);
        if(pitch === PitchPreference.Lowest) {
            var note = Note.fromMidi(notesAtTime[0].pitch);
            
            return note;
        }
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