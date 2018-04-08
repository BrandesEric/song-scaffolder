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
        if (this.bassTrack.useSelectedClip) {

        }
        else {
            var firstClip = (await AbletonJs.getMidiClips(sourceTrack))[0];
            var midiNotes = await AbletonJs.getMidiClipNotes(firstClip);
            for (var i = 0; i < this.bassTrack.numClips; i++) {
                var phrase = this.generateBassLineFromMidiClip(firstClip, midiNotes);
                await AbletonJs.insertMidiClip(track, phrase.toMidiClip())
            }
        }
    }

    generateBassLineFromMidiClip(clip: AbletonJs.MidiClip, notes: AbletonJs.MidiNote[]): Phrase {
        var noteLength = NoteLength.fromBeats(clip.lengthInBeats);
        var rhythm = RhythmPattern.getPatternByRhythmType(noteLength.lengthInBars, RhythmType.Bass);
        var phrase = new Phrase(noteLength.lengthInBars, "Bass Rand");
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
            for(var i = 0; i < this.bassTrack.subtractOctaves; i++) {
                note = note.subtractOctave();
            }

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