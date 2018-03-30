import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";

export class ApplicationState {
    public deviceActive: boolean;
    public tempo: number;
    public chordTracks: ChordTrack[] = [];
    public kickTracks: KickTrack[] = [];

    public updateChordTrack(chordTrack: ChordTrack) {
        var index = this.chordTracks.findIndex(x => x.id === chordTrack.id);
        this.chordTracks[index] = chordTrack;
    }

    public updateKickTrack(kickTrack: KickTrack) {
        var index = this.kickTracks.findIndex(x => x.id === kickTrack.id);
        this.kickTracks[index] = kickTrack;
    }
}