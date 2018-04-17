import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class BassTrack {
    id: string = uuid();
    name: string = "Bass";
    sourceTrack: string;

    clearClips: boolean = true;
    useSelectedClip: boolean;
    
    kind: TrackKind = TrackKind.Bass;

    numClips = 10;
    subtractOctaves = 2;

    rhythmType: "pattern" | "random" = "pattern";

    public static fromFormPost(form): BassTrack {
        var track = new BassTrack();
        track.id = form.id;
        track.name = form.name;
        track.sourceTrack = form.sourceTrack
        track.useSelectedClip = form.useSelectedClip && form.useSelectedClip === "true";
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.rhythmType = form.rhythmType;

        return track;
    }
}