 import express from 'express';

const port = 8080
const app = express()



let facts = [

    { id: 1 , fact: "Cheetahs are the fastest land animals, capable of reaching speeds up to 75 mph."} , 
    { id: 2 , fact: "A cheetah's tail helps with balance and steering at high speeds."} ,
    { id: 3 , fact: "Cheetah cubs have a mantle of long hair that helps camouflage them in grass."}

];

let sightings= [

    { id: 1 , habitat: "Serengeti National Park" , date: "2023-05-15" , count: 3} ,
    { id: 2 , habitat: "masai mara" , date: "2023-09-1" , count: 5} ,
    { id: 3 , habitat: "Dasht-e Kavir" , date: "2022-08-19" , count: 1} ,
    { id: 4 , habitat: "Botswana" , date: "2018-02-02" , count: 2}

];

let organizations = [

    { id: 1 , name: "Cheetah Conservation Fund" , location: "Namibia" , focus: "Research and Conservation"} ,
    { id: 2 , name: "Action for Cheetahs in Kenya" , location: "Kenya" , focus: "Community Engagement"} ,
    { id: 3 , name: "Iranian Cheetah Society" , location: "Iran" , focus: "Asiatic Cheetah Protection"}

];





app.get("/facts" , (req , res) => {
    console.log("Facts Reached")
    res.json(facts)
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