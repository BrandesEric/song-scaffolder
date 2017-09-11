import { Phrase } from "../music/phrase";

export interface IClipGenerationStrategy {
    numberOfClips: number;
    generate(): Phrase;
}