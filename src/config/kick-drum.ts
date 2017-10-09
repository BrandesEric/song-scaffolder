import { KickDrumIntervalStrategy } from "../strategies/kick-drum-interval.strategy";
import { KickDrumPatternStrategy } from "../strategies/kick-drum-pattern.strategy";

export let KickDrum = {
    defaultClipLengthInBars: 2,
    strategies: [
        new KickDrumIntervalStrategy(),
        new KickDrumPatternStrategy()
    ]
}