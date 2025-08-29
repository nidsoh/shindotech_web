import express from "express";
import open from "open";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:4321/";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

const app = express();

app.get("/", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.send("Pas de code reçu. Ouvre le lien affiché dans le terminal.");
    return;
  }
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  console.log("✅ Refresh Token :", tokens.refresh_token);
  res.send("Token généré avec succès ! Regarde ton terminal.");
  process.exit(0);
});

app.listen(4321, () => {
  console.log("Ouvre ce lien dans ton navigateur pour autoriser l'accès :\n", authUrl);
  open(authUrl);
});
