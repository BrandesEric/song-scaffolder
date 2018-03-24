import { ApplicationState } from "./application-state";
import { deviceActive } from "./device-active";
import { getTempo } from "./tempo";

var state = new ApplicationState();

export async function currentState(): Promise<ApplicationState> {

    state.deviceActive = await deviceActive();
    
    if(state.deviceActive){
        state.tempo = await getTempo(); 
    }
    else {
        state.tempo = null;
    }

    return state;
}