export enum SocketEvents {
    GETSONGREQUESTLIST = 'GETSONGREQUESTLIST',
    GETUSERSBYROOM = 'GETUSERSBYROOM',
    SENDMESSAGEROOM = 'SENDMESSAGEROOM',
    VOTESONGREQUEST = 'VOTESONGREQUEST',
    SELECTEDSONGREQUEST = 'SELECTEDSONGREQUEST',
    ERRORS = 'ERRORS',
}

/* {
    "GETSONGREQUESTLIST": {
        "emit": "GETSONGREQUESTLIST",
        "data": [socket],
        "on": "GETSONGREQUESTLIST",
        "response": [Type SongRequest]
    },
    "GETUSERSBYROOM": {
        "emit": "GETUSERSBYROOM",
        "data": [socket],
        "on": "GETUSERSBYROOM",
        "response": [{
            id: string;
            fullName: string;
            isActive: boolean;
        
            socket: Socket;
            current_room?: string;
        }]
    },
    "SENDMESSAGEROOM": {
        "emit": "SENDMESSAGEROOM",
        "data": [socket, message: any],
        "on": "SENDMESSAGEROOM",
        "response": message
    }, 
    "VOTESONGREQUEST": {
        "emit": "VOTESONGREQUEST",
        "data": [socket, song_request_id: string],
        "on": "VOTESONGREQUEST",
        "response": song_request_id
    },
    "SELECTEDSONGREQUEST": {
        "emit": "SELECTEDSONGREQUEST",
        "data": [socket, song_request_id: string],
        "on": "SELECTEDSONGREQUEST",
        "response": songRequest
    }
    "ERROR": {
        "on": "ERROR",
        "response": error
    }
} 
*/