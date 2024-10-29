import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyAdapter {
    private accessToken: string;
    private tokenExpiration: number;

    constructor(private configService: ConfigService) {}

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && this.tokenExpiration > Date.now()) {
            return this.accessToken;
        }

        const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
        const clientSecret = this.configService.get<string>(
            'SPOTIFY_CLIENT_SECRET',
        );

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
                params: { grant_type: 'client_credentials' },
                headers: {
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        this.accessToken = response.data.access_token;
        this.tokenExpiration = Date.now() + response.data.expires_in * 1000;
        return this.accessToken;
    }

    async searchTracks(query: string): Promise<any> {
        const token = await this.getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: query, type: 'track' },
        });

        return response.data.tracks.items;
    }

    async searchGender(): Promise<any> {
        const token = await this.getAccessToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        return response.data;
    }
}
