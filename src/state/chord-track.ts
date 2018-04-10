import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";
import { NoteLengthPreferences } from "../music/note-length-preferences";
import { NoteLength } from "../music/note-length";

export type ChordVoicing = "normal" | "open" | "firstInversion" | "secondInversion";

export class ChordTrack {
    id: string = uuid();
    name: string = "Chords";
    
    kind: TrackKind = TrackKind.Chord;
    
    numClips: number = 10;
    clipLengthInBars: number = 4;
    startOctave: number = 3;

    includeBasicChords: boolean = true;
    clearClips: boolean = true;
    includeBassNote: boolean = false;
    includeTwoOctaveBassNote: boolean = false;
    includeRandomChords: boolean = false;

    isArpeggiated = false;
    arpeggiatorLength = "e";
    arpeggiatorDirection: "up" | "down" | "updown" = "updown";

    voicing: ChordVoicing = "normal";
    rhythm: "whole" | "common" | "random" = "whole";

    noteLengthPreferences: NoteLengthPreferences = NoteLengthPreferences.longNotes();
    

    public static fromFormPost(form): ChordTrack {
        var track = new ChordTrack();
        track.id = form.id;
        track.name = form.name;
        
        track.startOctave = form.startOctave;
        track.numClips = form.numClips;
        track.clipLengthInBars = parseInt(form.clipLengthInBars || 4);
        
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.includeBasicChords = !!form.includeBasicChords && form.includeBasicChords === "true";
        track.includeBassNote = !!form.includeBassNote && form.includeBassNote === "true";
        track.includeTwoOctaveBassNote = !!form.includeTwoOctaveBassNote && form.includeTwoOctaveBassNote === "true";
        track.includeRandomChords = !!form.includeRandomChords && form.includeRandomChords === "true";

        track.isArpeggiated = !!form.isArpeggiated && form.isArpeggiated === "true";
        track.arpeggiatorDirection = form.arpeggiatorDirection;
        track.arpeggiatorLength = form.arpeggiatorLength;
        
        track.voicing = form.voicing;
        track.rhythm = form.rhythm;

        return track;
    }
}
