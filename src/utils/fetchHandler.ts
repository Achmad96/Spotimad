import axios from "axios";

export default async function fetchHandler(token: string, endpoint: string, method = "get", args?: object): Promise<any> {
    return await axios({
        url: `https://api.spotify.com${endpoint}`,
        method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        ...args,
    });
}
