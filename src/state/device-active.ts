import * as AbletonJs from "ableton-js";

export async function deviceActive(): Promise<boolean> {
    try {
        var tempo = await AbletonJs.getTempo();
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}
