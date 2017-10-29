import { KickDrumIntervalStrategy } from "../strategies/kick-drum-interval.strategy";
import { KickDrumPatternStrategy } from "../strategies/kick-drum-pattern.strategy";
import { KickDrumCommonStrategy } from "../strategies/kick-drum-common.strategy";

export let KickDrum = {
    strategies: [
        new KickDrumCommonStrategy(),
        new KickDrumIntervalStrategy(),
        new KickDrumPatternStrategy()
    ]
}