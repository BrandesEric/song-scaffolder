import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";
import { SnareTrack } from "./snare-track";
import { HihatTrack } from "./hihat-track";
import { BassTrack } from "./bass-track";
import { MelodyTrack } from "./melody-track";
import { AtmosphereTrack } from "./atmosphere-track";

export class ApplicationState {
    public deviceActive: boolean;
    public tempo: number;
    public existingTracks: string[] = [];
    public chordTracks: ChordTrack[] = [];
    public kickTracks: KickTrack[] = [];
    public snareTracks: SnareTrack[] = [];
    public hihatTracks: HihatTrack[] = [];
    public bassTracks: BassTrack[] = [];
    public melodyTracks: MelodyTrack[] = [];
    public atmosphereTracks: AtmosphereTrack[] = [];

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

    public updateBassTrack(bassTrack: BassTrack) {
        var index = this.bassTracks.findIndex(x => x.id === bassTrack.id);
        this.bassTracks[index] = bassTrack;
    }

    public updateMelodyTrack(melodyTrack: MelodyTrack) {
        var index = this.melodyTracks.findIndex(x => x.id === melodyTrack.id);
        this.melodyTracks[index] = melodyTrack;
    }

    public updateAtmosphereTrack(atmosphereTrack: AtmosphereTrack) {
        var index = this.atmosphereTracks.findIndex(x => x.id === atmosphereTrack.id);
        this.atmosphereTracks[index] = atmosphereTrack;
    }
}