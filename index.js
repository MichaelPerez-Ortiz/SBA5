 import express from 'express';

 import {facts , sightings , organizations} from "./data/info.js"

const port = 8080
const app = express()




app.get("/facts" , (req , res) => {
    let info = facts;
    const { verified } = req.query;

        if (verified === "true") {
             info = info.filter(fact => fact.verified === true);
    } else if (verified === "false") { 
        info = info.filter(fact => fact.verified === false);
    }

    res.json(info)
});


app.get("/sightings" , (req , res) => {
    console.log("Cheetah Sightings")
    res.json(sightings)
});

app.get("/organizations" , (req , res) => {
    console.log("Organizations Reached")
    res.json(organizations)
});


app.listen(port , () => {
    console.log("Server running on port:" , port)
})