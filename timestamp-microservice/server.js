import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line
app.get("/api{/:date}", (req, res) => {
  const givenTimestamp = req.params.date;
  const currentTimestamp = new Date();

  if (!givenTimestamp) {
    res.json({
      unix: +Date.parse(currentTimestamp),
      utc: currentTimestamp.toUTCString(),
    });
  } else {
    let utc = new Date(givenTimestamp);
    let unix = +Date.parse(givenTimestamp);

    if (Number.isInteger(+givenTimestamp)) {
      utc = new Date(+givenTimestamp);
      unix = +givenTimestamp;
    }

    if (Number.isNaN(unix) && utc == "Invalid Date") {
      res.json({ error: "Invalid Date" });
    } else {
      res.json({
        unix: unix,
        utc: utc.toUTCString(),
      });
    }
  }
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
