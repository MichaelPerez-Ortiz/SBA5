import express from "express";

import path from "path";
import { fileURLToPath } from "url";

import {facts , sightings , organizations} from "./data/info.js";
import {validateFact} from "./middleware/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const port = 8080;
const app = express();


app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));

////////////////////GET\\\\\\\\\\\\\\\\\\\\\\


app.get("/" , (req , res) => {
    res.render("index.ejs" , {
        facts: facts ,
        sightings: sightings ,
        organizations: organizations
    });
});


//Facts

app.get("/facts" , (req , res) => {
  let filteredFacts = facts;

  const {verified} = req.query;
  if (verified === "true") filteredFacts = filteredFacts.filter(fact => fact.verified);
  else if (verified === "false") filteredFacts = filteredFacts.filter(fact => !fact.verified);

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
  const {name , location , focus} = req.query;

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

                        ////////////////////////////||\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////POST\\\\\\\\\\\\\\\\\\\\\\


app.post("/facts" , validateFact , (req , res) => {

  let newFact = {

        id: facts.length + 1,
        fact: req.body.fact,
        verified: req.body.verified || false,
        source: req.body.source || ""

  };

  facts.push(newFact);
  res.status(201).json(newFact);

});

app.post("/organizations" , (req , res) => {

  let newOrg = {

        id: organizations.length + 1,
        name: req.body.name,
        location: req.body.location,
        focus: req.body.focus

  };

  organizations.push(newOrg);
  res.status(201).json(newOrg);

});


                        ////////////////////////////||\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////PUT/PATCH\\\\\\\\\\\\\\\\\\\\\\

app.put("/facts/:id" , validateFact , (req , res) => {

  let id = parseInt(req.params.id);
  let index = facts.findIndex(fact => fact.id === id);
  
    if (index === -1) {

        return res.status(404).json({ error: "Fact not found" });
  }

  let updatedFact = {

    ...facts[index],
    fact: req.body.fact,
    verified: req.body.verified !== undefined ? req.body.verified : facts[index].verified,
    source: req.body.source || facts[index].source

  };
  
  facts[index] = updatedFact;
  res.json(updatedFact);

});

app.patch("/sightings/:id" , (req , res) => {

  let id = parseInt(req.params.id);
  let sighting = sightings.find(sight => sight.id === id);
  
        if (!sighting) {
          return res.status(404).json({ error: "Sighting not found" });
   }

  Object.keys(req.body).forEach(key => {

        if (sighting[key] !== undefined) {
        sighting[key] = req.body[key];
    }

  });
  
  res.json(sighting);

});

                         ////////////////////////////||\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////DELETE\\\\\\\\\\\\\\\\\\\\\\


app.delete("/facts/:id" , (req , res) => {

  let id = parseInt(req.params.id);
  let index = facts.findIndex(fact => fact.id === id);
  
        if (index === -1) {
            return res.status(404).json({ error: "Fact not found" });
   }
  
  facts.splice(index, 1);
  res.sendStatus(204);

});

app.delete("/organizations/:id" , (req , res) => {

  let id = parseInt(req.params.id);
  let index = organizations.findIndex(org => org.id === id);
  
    if (index === -1) {
        return res.status(404).json({ error: "Organization not found" });
  }
  
  organizations.splice(index, 1);
  res.sendStatus(204);

});




// Error Handling

app.use((err , req , res , next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Unknown server error" });
});


app.use((req , res) => {
  res.status(404).json({ error: "Not found" });
});

                ///|||\\\


app.listen(port , () => {
    console.log("Server running on port:" , port)
})