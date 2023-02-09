import IGame from "@interfaces/IGame";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function FindGameByName(game: IGame) {
  return (
    await axios.get(
      `https://api.igdb.com/v4/games/?fields=*&search=${game.gameName}`,
      {
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID,
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.IGDB_TOKEN}`,
        },
      }
    )
  ).data[0];
}

export async function GetGameCover(igdbId: string) {
  return (
    await axios.post(
      "https://api.igdb.com/v4/games",
      `fields cover.*; where id = ${igdbId};`,
      {
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${process.env.IGDB_TOKEN}`,
        },
      }
    )
  ).data[0].cover;
}

export async function GetToken() {
  return (
    await axios.post(
      "https://id.twitch.tv/oauth2/token",
      `client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
      {
        headers: {
          client_secret: process.env.IGDB_CLIENT_SECRET,
        },
      }
    )
  ).data.access_token;
}
