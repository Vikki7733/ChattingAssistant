import axios from "axios";
import { getQbraidAPIKey } from "./QbraidAPI";

export async function apiRequest<T>(method: string, url: string, data?: any): Promise<T> {
    const apiKey = await getQbraidAPIKey();
    if (!apiKey) throw new Error('API Key is missing.');

    try {
        const config = {
            method,
            url,
            headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
            data,
        };
        const response = await axios(config);
        if (response.data) {
            return response.data;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        throw new Error(`Request failed: ${(error as Error).message}`);
    }

}