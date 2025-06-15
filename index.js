import express from "express";

import path from "path";
import { fileURLToPath } from "url";

import {facts , sightings , organizations} from "./data/info.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = 8080;
const app = express();


app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

//Facts

app.get("/facts" , (req , res) => {
  let filteredFacts = facts.map(f => {
    
    if (!info.source || info.source.trim() === "") {
      return { ...info , verified: false , source: "" };
    }
    return info;
  });

  const {verified} = req.query;
  if (verified === "true") filteredFacts = filteredFacts.filter(info => info.verified);
  else if (verified === "false") filteredFacts = filteredFacts.filter(info => !info.verified);

  res.json(filteredFacts);
});




// Sightings

app.get("/sightings" , (req , res) => {
  let filteredSightings = sightings;
  const {habitat , minCount} = req.query;

  if (habitat) {
    filteredSightings = filteredSightings.filter(sight =>
      sight.habitat.toLowerCase().includes(habitat.toLowerCase())
    );
  }
  if (minCount) {
    const minCountNum = parseInt(minCount);
    filteredSightings = filteredSightings.filter(sight => sight.count >= minCountNum);
  }
  res.json(filteredSightings);
});




// Organizations


app.get("/organizations" , (req , res) => {
  let filteredOrgs = organizations;
  const {name, location, focus} = req.query;

  if (name) {
    filteredOrgs = filteredOrgs.filter(org =>
      org.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (location) {
    filteredOrgs = filteredOrgs.filter(org =>
      org.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (focus) {
    filteredOrgs = filteredOrgs.filter(org =>
      org.focus.toLowerCase().includes(focus.toLowerCase())
    );
  }

  res.json(filteredOrgs);

});


// Error Handling

app.use((err , req , res , next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Unknown server error" });
});


app.use((req , res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port , () => {
    console.log("Server running on port:" , port)
})