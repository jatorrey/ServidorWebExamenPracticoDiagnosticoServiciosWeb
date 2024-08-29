import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try{
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error){
        console.log(error);
    }
};

const writeData = (data) => {
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error){
        console.log(error);
    }
}

app.get("/", (req, res) => {
    res.send("Mi primer API con Node js!");
});

app.get("/tasks", (req, res) => {
    const data = readData();
    res.json(data.tareas);
})

app.get("/tasks/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const tarea = data.tareas.find((tarea) => tarea.id === id);
    res.json(tarea);
});

app.post("/tasks", (req, res) => {
    const data = readData();
    const body = req.body;
    const newTask = {
        id: data.tareas.length + 1, 
        ...body,
    };
    data.tareas.push(newTask);
    writeData(data);
    res.json(newTask);
})

app.put("/tasks/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const taskIndex = data.tareas.findIndex((tarea) => tarea.id === id);
    data.tareas[taskIndex] = {
        ...data.tareas[taskIndex],
        ...body,
    };
    writeData(data);
    res.json({message: "Tarea actualizada"});
});

app.delete("/tasks/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const taskIndex = data.tareas.findIndex((tarea) => tarea.id === id);
    data.tareas.splice(taskIndex, 1);
    writeData(data);
    res.json({message: "Tarea eliminada"});
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
