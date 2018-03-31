import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";
import { SnareTrack } from "./snare-track";
import { HihatTrack } from "./hihat-track";

export class ApplicationState {
    public deviceActive: boolean;
    public tempo: number;
    public chordTracks: ChordTrack[] = [];
    public kickTracks: KickTrack[] = [];
    public snareTracks: SnareTrack[] = [];
    public hihatTracks: HihatTrack[] = [];

    public updateChordTrack(chordTrack: ChordTrack) {
        var index = this.chordTracks.findIndex(x => x.id === chordTrack.id);
        this.chordTracks[index] = chordTrack;
    }

    public updateKickTrack(kickTrack: KickTrack) {
        var index = this.kickTracks.findIndex(x => x.id === kickTrack.id);
        this.kickTracks[index] = kickTrack;
    }

    public updateSnareTrack(snareTrack: SnareTrack) {
        var index = this.snareTracks.findIndex(x => x.id === snareTrack.id);
        this.snareTracks[index] = snareTrack;
    }

    public updateHihatTrack(hihatTrack: HihatTrack) {
        var index = this.hihatTracks.findIndex(x => x.id === hihatTrack.id);
        this.hihatTracks[index] = hihatTrack;
    }
}