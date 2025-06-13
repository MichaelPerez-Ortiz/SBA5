const express = require("express")

const port = 8080
const app = express()



app.get("/facts" , (req , res) => {
    console.log("Facts Reached")
    res.send("Cheetah Facts")
});

app.get("/habitats" , (req , res) => {
    console.log("Habitats Reached")
    res.send("Cheetah Habitats")
});

app.get("/organizations" , (req , res) => {
    console.log("Organizations Reached")
    res.send("Cheetah Organizations")
});


app.listen(port , () => {
    console.log("Server running on port:" , port)
})