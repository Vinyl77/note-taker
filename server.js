const express = require ("express");
const path = require("path");

const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

const fs = require("fs");

const notesData = getNotes();

function getNotes(){
    let data = fs.readFileSync('./db/db.json', 'utf8');

    let notes = JSON.parse(data);

    for (let i = 0; i < notes.length; i++) {
        notes[i].id = '' + i;
    }

    return notes;
};


function writeNote (){

    fs.writeFileSync('./db/db.json', JSON.stringify(notesData));
   
}




app.get("/api/notes", function (req,res){
    res.json(notesData);
});

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
res.json({ok: true})

   //res.json(true);
});
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




    app.get("/notes", function (req, res){
        res.sendFile(path.join (__dirname + "/public/notes.html"));
    });
    app.get("*", function(req, res){
        res.sendFile(path.join(__dirname + "/public/index.html"));
    })
app.listen(PORT, ()=> console.log(`App listening on PORT ${PORT}`))