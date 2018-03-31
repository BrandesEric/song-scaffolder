import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class SnareTrack {
    id: string = uuid();
    name: string = "Snare";
    
    kind: TrackKind = TrackKind.Snare;

    numClips = 10;

    includeBasicSnares = true;
    includeRandomSnares = true;
    includeIntervalSnares = true;
    clearClips = true;

    public static fromFormPost(form): SnareTrack {
        var track = new SnareTrack();
        track.id = form.id;
        track.name = form.name;

        track.includeBasicSnares = form.includeBasicSnares && form.includeBasicSnares === "true";
        track.includeRandomSnares = form.includeRandomSnares && form.includeRandomSnares === "true";
        track.includeIntervalSnares = form.includeIntervalSnares && form.includeIntervalSnares === "true";
        track.clearClips = form.clearClips && form.clearClips === "true";

        return track;
    }
}