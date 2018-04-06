import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class BassTrack {
    id: string = uuid();
    name: string = "Bass";
    sourceTrack: string;
    
    kind: TrackKind = TrackKind.Bass;

    numClips = 10;

    public static fromFormPost(form): BassTrack {
        var track = new BassTrack();
        track.id = form.id;
        track.name = form.name;
        track.sourceTrack = form.sourceTrack

        return track;
    }
}