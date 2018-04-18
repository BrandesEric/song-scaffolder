import { RhythmPattern } from "./rhythm";
import * as AbletonJs from "ableton-js";
import { TrackKind } from "../state/tracks";
import { Note } from "./note";
import { Phrase } from "./phrase";
import { NoteLength } from "./note-length";
import { MidiNote } from "./midi-note";
import { MidiClip } from "ableton-js";
import { SongConfig } from "../config/song.config";
import * as Tonal from "tonal";
import { orderBy } from "lodash";

export class PhraseBuilder {

    private previousNotes: {
        note: Note,
        length: NoteLength
    }[] = [];

    private useSourceNotesPercentage = 70;

    private pitchDirectionsMelody = [{
        weight: 20,
        direction: PitchDirection.Up
    }, {
        weight: 20,
        direction: PitchDirection.Down
    }, {
        weight: 20,
        direction: PitchDirection.RepeatLast
    }]

    private pitchDirectionsBass = [{
        weight: 20,
        direction: PitchDirection.Up
    }, {
        weight: 20,
        direction: PitchDirection.Down
    }, {
        weight: 40,
        direction: PitchDirection.RepeatLast
    }]

    private pitchDistancesMelody = [{
        weight: 30,
        distance: 1,
    }, {
        weight: 20,
        distance: 2
    }, {
        weight: 10,
        distance: 3,
    }, {
        weight: 10,
        distance: 4,
    }, {
        weight: 10,
        distance: 5,
    }, {
        weight: 10,
        distance: 6,
    }, {
        weight: 20,
        distance: 7,
    }, {
        weight: 10,
        distance: 8,
    }]

    private pitchDistancesBass = [{
        weight: 30,
        distance: 1,
    }, {
        weight: 20,
        distance: 2
    }, {
        weight: 10,
        distance: 3,
    }, {
        weight: 10,
        distance: 4,
    }, {
        weight: 10,
        distance: 5,
    }]

    private scale: string[];

    private startOctavesBass = 1;
    private bassMinOctave = 1;
    private bassMaxOctave = 2;
    private startOctavesMelody = 4;
    private melodyMinOctave = 3;
    private melodyMaxOctave = 5;

    constructor(public rhythmPattern: RhythmPattern, public sourceNotes: AbletonJs.MidiNote[], public phraseType: TrackKind) {
        this.sourceNotes = sourceNotes || [];
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
    }

    generatePhrase(name: string): Phrase {
        var phrase = new Phrase(this.rhythmPattern.lengthInBars, name);
        var currentTimeInBeats = 0;
        for (var i = 0; i < this.rhythmPattern.parts.length; i++) {
            var note = this.getNextMidiNote(i, currentTimeInBeats);
            currentTimeInBeats += note.durationInBeats;
            phrase.addMidiNote(note)
        }

        return phrase;
    }

    getNextMidiNote(rhythmIndex: number, currentTimeInBeats: number): MidiNote {
        var noteLength = this.rhythmPattern.parts[rhythmIndex];
        var sourceNotesAtTime = this.getNotesAtTime(currentTimeInBeats, this.sourceNotes);
        var note = this.getNextNote(sourceNotesAtTime)
        while(note.octave > this.maxOctave) {
            note = note.subtractOctave();
        }
        while(note.octave < this.minOctave) {
            note = note.addOctave();
        }
        this.previousNotes.push({
            note: note,
            length: noteLength
        });
        return MidiNote.fromNoteName(note.fullName, currentTimeInBeats, noteLength);
    }

    getNextNote(sourceNotesAtTime: AbletonJs.MidiNote[]): Note {
        var pitchDirection = this.getNextPitchDirection();
        var pitchDistance = this.getNextPitchMovementDistance();
        var previousNote = this.getPreviousNote();
        var note: Note;
        if(previousNote){
            if(pitchDirection === PitchDirection.RepeatLast) {
                return previousNote;
            }
            else if(previousNote) {
                var direction = pitchDirection === PitchDirection.Down ? -1 : 1;
                var relativeDistance = pitchDistance * direction;
                var interval = Tonal.Interval.build({ step: pitchDistance, alt: 0 /* Major vs. Minor.  -1 is minor */, oct: 0, dir: direction })
                if(sourceNotesAtTime.length > 0 && this.shouldPlayFromSourceNotesIfAvailable()) {
                    var availableNames = sourceNotesAtTime.map(x => Note.fromMidi(x.pitch).noteName);
                    var possibleValue = previousNote.transposeBy(interval)
                    if(availableNames.indexOf(possibleValue.noteName) >= 0) {
                        return possibleValue;
                    }
                    var availableNotes = availableNames.map(x => Note.fromString(`${x}${possibleValue.octave}`));
                    availableNotes = orderBy(availableNotes, (x) => x.distanceToInSemitones(possibleValue));

                    return availableNotes[0];   
                }
                else {
                    return previousNote.transposeBy(interval);
                }
            }
        }
        else if(sourceNotesAtTime.length > 0) {
            // pick a random source note
            var random = this.getRandomInt(0, sourceNotesAtTime.length - 1);
            var sourceNote = Note.fromMidi(sourceNotesAtTime[random].pitch);
            return Note.fromString(`${sourceNote.noteName}${this.startOctave}`);
        }
        else {
            // pick a random scale note
            var random = this.getRandomInt(0, this.scale.length - 1);
            return Note.fromString(`${this.scale[random]}${this.startOctave}`);
        }     
    }

    getNextPitchDirection() {
        var pitchDirections;
        if(this.phraseType === TrackKind.Melody) {
            pitchDirections = this.pitchDirectionsMelody;
        }
        else {
            pitchDirections = this.pitchDirectionsBass;
        }
        var totalWeight = pitchDirections.reduce((acc, val) => val.weight + acc, 0);
        var random = this.getRandomInt(1, totalWeight);
        var index = 0;
        var direction = pitchDirections[0].direction;
        while(random > pitchDirections[index].weight) {
            random -= pitchDirections[index].weight;
            index++;
            direction = pitchDirections[index].direction;
        }

        return direction;
    }

    getNextPitchMovementDistance() {
        var distances;
        if(this.phraseType === TrackKind.Melody) {
            distances = this.pitchDistancesMelody;
        }
        else {
            distances = this.pitchDistancesBass;
        }
        var totalWeight = distances.reduce((acc, val) => val.weight + acc, 0);
        var random = this.getRandomInt(1, totalWeight);
        var index = 0;
        var distance = distances[0].distance;
        while(random > distances[index].weight) {
            random -= distances[index].weight;
            index++;
            distance = distances[index].distance;
        }

        return distance
    }

    getPreviousNote(): Note {
        if(this.previousNotes.length === 0) {
            return null;
        }
        else {
            return this.previousNotes[this.previousNotes.length - 1].note;
        }
    }

    getPreviousNoteLength(): NoteLength {
        if(this.previousNotes.length === 0) {
            return null;
        }
        else {
            return this.previousNotes[this.previousNotes.length - 1].length;
        }
    }

    shouldPlayFromSourceNotesIfAvailable(): boolean {
        var random = this.getRandomInt(1, 100);

        return random <= this.useSourceNotesPercentage;
    }

    getNotesAtTime(timeInBeats: number, notes: AbletonJs.MidiNote[]): AbletonJs.MidiNote[] {
        notes = notes.sort((a, b) => a.time - b.time);
        var notesAtTime = notes.filter(x => {
            if (x.time === timeInBeats) {
                return true;
            }
            else if (x.time < timeInBeats && x.time + x.duration > timeInBeats) {
                return true;
            }

            return false;
        });

        notesAtTime = notesAtTime.sort((a, b) => a.pitch - b.pitch);

        return notesAtTime;
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    get startOctave(): number {
        if(this.phraseType === TrackKind.Bass) {
            return this.startOctavesBass;
        }
        else {
            return this.startOctavesMelody;
        }
    }

    get minOctave(): number {
        if(this.phraseType === TrackKind.Bass) {
            return this.bassMinOctave;
        }
        else {
            return this.melodyMinOctave;
        }
    }

    get maxOctave(): number {
        if(this.phraseType === TrackKind.Bass) {
            return this.bassMaxOctave;
        }
        else {
            return this.melodyMaxOctave;
        }
    }

}

enum PitchDirection {
    Unspecified,
    Up,
    Down,
    RepeatLast
}