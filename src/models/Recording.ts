import { RecordingSession } from "./recording/RecordingSession";

export type Recording = {
    id: string;
    version: 1 | 2;
    sessions: RecordingSession[];
};
