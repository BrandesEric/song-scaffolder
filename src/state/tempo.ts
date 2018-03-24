import * as AbletonJs from "ableton-js";

export async function getTempo(): Promise<number> {
    return await AbletonJs.getTempo();
}

export async function changeTempo(newTempo: number): Promise<any> {
    return await AbletonJs.setTempo(newTempo);
}