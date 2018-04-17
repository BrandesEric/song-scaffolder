import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class MelodyTrack {
    id: string = uuid();
    name: string = "Melody";
    sourceTrack: string;

    clearClips: boolean = true;
    useSelectedClip: boolean;
    
    kind: TrackKind = TrackKind.Melody;

    numClips = 10;
    startOctave = 3;
    octaveRange = 2;

    rhythmType: "pattern" | "random" = "pattern";

    public static fromFormPost(form): MelodyTrack {
        var track = new MelodyTrack();
        track.id = form.id;
        track.name = form.name;
        track.sourceTrack = form.sourceTrack
        track.useSelectedClip = form.useSelectedClip && form.useSelectedClip === "true";
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.rhythmType = form.rhythmType;

        return track;
    }
}