import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class KickTrack {
    id: string = uuid();
    name: string = "Kick";
    
    kind: TrackKind = TrackKind.Kick;

    numClips = 10;

    includeBasicKicks = true;
    includeRandomKicks = true;
    includeIntervalKicks = true;
    clearClips = true;

    public static fromFormPost(form): KickTrack {
        var track = new KickTrack();
        track.id = form.id;
        track.name = form.name;

        track.includeBasicKicks = form.includeBasicKicks && form.includeBasicKicks === "true";
        track.includeRandomKicks = form.includeRandomKicks && form.includeRandomKicks === "true";
        track.includeIntervalKicks = form.includeIntervalKicks && form.includeIntervalKicks === "true";
        track.clearClips = form.clearClips && form.clearClips === "true";

        return track;
    }
}