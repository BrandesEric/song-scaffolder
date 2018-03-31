import { Pattern } from "./pattern";

export class WeightedPattern {
    pattern: Pattern;
    weight: number;
    constructor(pattern: Pattern, weight: number) {
        this.pattern = pattern;
        this.weight = weight;
    }
}