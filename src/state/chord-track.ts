import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";
import { NoteLengthPreferences } from "../music/note-length-preferences";

export type ChordVoicing = "normal" | "open" | "firstInversion" | "secondInversion";

export class ChordTrack {
    id: string = uuid();
    name: string = "Chords";
    
    kind: TrackKind = TrackKind.Chord;
    
    numClips: number = 10;
    clipLengthInBars: number = 4;
    startOctave: number = 3;
    quarterNoteChance: number = 0;
    halfNoteChance: number = 0;
    wholeNoteChance: number = 1;
    twoWholeNoteChance: number = 0;
    percentRepeatChance: number = 0;
    percentRests: number = 0;

    includeBasicChords: boolean = true;
    clearClips: boolean = true;
    includeBassNote: boolean = true;
    includeTwoOctaveBassNote: boolean = false;
    splitChords: boolean = false;
    includeRandomChords: boolean = false;

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
        track.percentRepeatChance = parseInt(form.percentRepeatChance || 0);
        
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.includeBasicChords = !!form.includeBasicChords && form.includeBasicChords === "true";
        track.includeBassNote = !!form.includeBassNote && form.includeBassNote === "true";
        track.includeTwoOctaveBassNote = !!form.includeTwoOctaveBassNote && form.includeTwoOctaveBassNote === "true";
        track.includeRandomChords = !!form.includeRandomChords && form.includeRandomChords === "true";
        track.splitChords = !!form.splitChords && form.splitChords === "true";
        
        track.voicing = form.voicing;
        track.rhythm = form.rhythm;

        var percentRests = parseInt(form.percentRests);
        var percentNotes = 100 - percentRests;

        switch(form.noteLengthPreferences) {
            case "short":
                track.noteLengthPreferences = NoteLengthPreferences.shortNotes(percentNotes, percentRests);
                break;
            case "medium":
                track.noteLengthPreferences = NoteLengthPreferences.mediumNotes(percentNotes, percentRests);
                break;
            default: 
                track.noteLengthPreferences = NoteLengthPreferences.longNotes(percentNotes, percentRests);
                break;
        }

        return track;
    }
}
