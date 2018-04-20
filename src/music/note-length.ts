export class NoteLength {
    lengthInBeats: number;
    lengthInBars: number;
    name: string;
    isRest: boolean = false;
    private constructor(lengthInBars: number, lengthInBeats: number, isRest = false) {
        this.lengthInBars = lengthInBars;
        this.lengthInBeats = lengthInBeats;
        this.isRest = isRest;
    }

    public doubleTime() {
        return NoteLength.fromBars(this.lengthInBars / 2, this.isRest);
    }

    public halfTime() {
        return NoteLength.fromBars(this.lengthInBars * 2, this.isRest);
    }

    static ThirtySecond = new NoteLength(1 / 32, 1 / 8);
    static TripletSixteenth = new NoteLength( 1/ 24, 1 / 6);
    static Sixteenth = new NoteLength(1 / 16, 1 / 4);
    static TripletEighth = new NoteLength(1/12, 1/3);
    static Eighth = new NoteLength(1 / 8, 1 / 2);
    static DottedEighth = new NoteLength(3/16, 3/4)
    static Quarter = new NoteLength(1 / 4, 1);
    static DottedQuarter = new NoteLength(3/8, 1.5)
    static Half = new NoteLength(1 / 2, 2);
    static DottedHalf = new NoteLength(3/4, 3);
    static Whole = new NoteLength(1, 4);
    static DottedWhole = new NoteLength(1.5, 6);
    static TwoWhole = new NoteLength(2, 8);


    static SixteenthRest = new NoteLength(1 / 16, 1 / 4, true);
    static EighthRest = new NoteLength(1 / 8, 1 / 2, true);
    static QuarterRest = new NoteLength(1 / 4, 1, true);
    static HalfRest = new NoteLength(1 / 2, 2, true);
    static WholeRest = new NoteLength(1, 4, true);

    static fromBeats(beats: number, isRest = false) {
        return new NoteLength(TimePosition.lengthInBars(beats), beats, isRest);
    }

    static fromBars(bars: number, isRest = false) {
        return new NoteLength(bars, TimePosition.lengthInBeats(bars), isRest);
    }

    static doubleTime(noteLengths: NoteLength[]) {
        return noteLengths.map(x => x.doubleTime());
    }

    static halfTime(noteLengths: NoteLength[]) {
        return noteLengths.map(x => x.halfTime());
    }

    public static parse(noteString: string): NoteLength {
        switch(noteString){
            case "x":
                return NoteLength.Sixteenth;
            case "xr":
                return NoteLength.SixteenthRest;
            case "e":
                return NoteLength.Eighth;
            case "er":
                return NoteLength.EighthRest;
            case "e.": 
                return NoteLength.DottedEighth;
            case "q":
                return NoteLength.Quarter;
            case "q.":
                return NoteLength.DottedQuarter;
            case "qr":
                return NoteLength.QuarterRest;
            case "h":
                return NoteLength.Half;
            case "h.":
                return NoteLength.DottedHalf;
            case "hr":
                return NoteLength.HalfRest;
            case "w":
            default:
                return NoteLength.Whole;
            case "wr":
                return NoteLength.WholeRest; 
            case "w.": 
                return NoteLength.DottedWhole;
            case "2w":
                return NoteLength.TwoWhole;
        }
    }
}

export class TimePosition {
    static lengthInBeats(bars: number): number {
        return bars * 4;
    }

    static lengthInBars(beats: number) {
        return beats / 4;
    }
}