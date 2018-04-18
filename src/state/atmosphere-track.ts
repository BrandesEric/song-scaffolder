import { TrackKind } from "./tracks";
import * as uuid from "uuid/v4";

export class AtmosphereTrack {
    id: string = uuid();
    name: string = "Atmosphere";

    clearClips: boolean = true;
 
    kind: TrackKind = TrackKind.Atmosphere;

    numClips = 10;
    startOctave = 3;
    lengthInBars = 4;

    rhythmType: "pattern" | "random" = "pattern";

    public static fromFormPost(form): AtmosphereTrack {
        var track = new AtmosphereTrack();
        track.id = form.id;
        track.name = form.name;
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.rhythmType = form.rhythmType;

        return track;
    }
}