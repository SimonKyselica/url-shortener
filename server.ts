import express, { Request, Response } from "express";
import db, { UrlRow } from "./db";
import { encodeBase62 } from "./encode";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/shorten", (req: Request, res: Response) => {
    const { url } = req.body as {url?: string};

    let parsed: URL;
    try {
        parsed = new URL(url ?? "");
        if(!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("bad protocol");
        }
    } catch {
        return res.status(400).json({error: "Please enter a valid http(s) URL"});
    }

    const result = db.prepare("INSERT INTO urls (long_url) VALUES (?)").run(parsed.href);
    // ID of last row can be number or bigInt
    const id = Number(result.lastInsertRowid);

    //Short The URL
    const shortCode = encodeBase62(id);
    db.prepare("UPDATE urls SET short_code = ? WHERE id = ?").run(shortCode, id);

    //send the URL back
    res.json({shortCode, shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    longUrl: parsed.href,
});
});

app.get("/:code", (req: Request, res: Response) => {
   const row = db.prepare("SELECT * FROM  urls WHERE short_code = ?").get(req.params.code) as UrlRow | undefined;

   if(!row) {
    return res.status(404).send("Short link not found");
   }

   db.prepare("UPDATE urls SET clicks = clicks + 1 WHERE id = ?").run(row.id);
   res.redirect(302, row.long_url);
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})