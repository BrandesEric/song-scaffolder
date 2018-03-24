import { ChordTrack } from "./tracks";

export class ApplicationState {
    public deviceActive: boolean;
    public tempo: number;
    public chordTracks: ChordTrack[] = [];

    public updateChordTrack(chordTrack: ChordTrack) {
        var index = this.chordTracks.findIndex(x => x.id === chordTrack.id);
        this.chordTracks[index] = chordTrack;
    }
}