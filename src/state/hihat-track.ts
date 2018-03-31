import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class HihatTrack {
    id: string = uuid();
    name: string = "Hihat";
    
    kind: TrackKind = TrackKind.Snare;

    numClips = 10;

    includeBasicHats = true;
    includeRandomHats = true;
    includeTrapHats = true;
    clearClips = true;

    public static fromFormPost(form): HihatTrack {
        var track = new HihatTrack();
        track.id = form.id;
        track.name = form.name;

        track.includeBasicHats = form.includeBasicHats && form.includeBasicHats === "true";
        track.includeRandomHats = form.includeRandomHats && form.includeRandomHats === "true";
        track.includeTrapHats = form.includeTrapHats && form.includeTrapHats === "true";
        track.clearClips = form.clearClips && form.clearClips === "true";

        return track;
    }
}