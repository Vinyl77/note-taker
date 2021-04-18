// dependencies
const express = require ("express");
const path = require("path");
// setting up id dependency
const { v4: uuidv4 } = require('uuid');
// setting up express app
const app = express();
// setting port for server
const PORT = process.env.PORT || 3000;
// sets up the express app to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// set up use for public folder
app.use(express.static("public"));
// setting up the use of require
const fs = require("fs");
// creating a const for the get notes function
const notesData = getNotes();

function getNotes(){
    let data = fs.readFileSync('./db/db.json', 'utf8');
    // this returns the page with notes on page from the database

    let notes = JSON.parse(data);
    // creating an object from the notes data string

    for (let i = 0; i < notes.length; i++) {
        notes[i].id = '' + i;
    }
    // for loop to run through the notes array then returns notes on page   
    return notes;
};

// function to create notes and return them as a string
function writeNote (){

    fs.writeFileSync('./db/db.json', JSON.stringify(notesData));
   
}
// routes to the home page and the notes page
// app.get("/notes", function (req, res){
    // res.sendFile(path.join (__dirname + "/public/notes.html"));
// });
// app.get("*", function(req, res){
    // res.sendFile(path.join(__dirname + "/public/index.html"));
// })


// api routes
// gets the data from api and puts them on the homepage in JSON
app.get("/api/notes", function (req,res){
    res.json(notesData);
});
// allows the user to submit a  note and also creates an id for the note on the server
app.post("/api/notes", function (req, res) {
    let note = req.body;

    let newNote ={
        title: note.title,
        text: note.text,
        id: uuidv4()
    }
    notesData.push(newNote)
    console.log('yooo')
writeNote();
// calling the write note function in the post route
res.json({ok: true})

   //res.json(true);
});
// this allows the user to delete a note from the server
app.delete("/api/notes/:id", function (req, res){
    const requestID = req.params.id;
    console.log(requestID);

    let note = notesData.filter(note =>{
        return note.id === requestID;
    })[0];
    console.log(note);
    const index = notesData.indexOf(note);
    

    notesData.splice(index, 1);


    

    fs.writeFileSync('./db/db.json', JSON.stringify(notesData), 'utf8');

    res.json("Note Deleted");
    
  });



// // routes to the home page and the notes page
    app.get("/notes", function (req, res){
        res.sendFile(path.join (__dirname + "/public/notes.html"));
    });
    app.get("*", function(req, res){
        res.sendFile(path.join(__dirname + "/public/index.html"));
    })
app.listen(PORT, ()=> console.log(`App listening on PORT ${PORT}`))