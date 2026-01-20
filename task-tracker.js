import { argv } from 'node:process';
import { existsSync } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises'; 

let idCount = 0;

// define list of commands
// must equal to 'task-cli'
const rootCommand = argv[2]; 
if (rootCommand !== 'task-cli') { 
    throw new Error("Not a valid command");
}

// legal commands
const subCommands = {
    "add": addTask,
    "update": updateTask,
    "delete": deleteTask,
    "list": listTasks,
    "mark-in-progress": markTaskInProgress,
    "mark-done": markTaskDone,
    "mark-todo": markTaskTodo
};

const subCommand = argv[3];
if (!(subCommand in subCommands)){
    throw new Error("Not a valid subcommand");
}

if(subCommand === "add"){
    const description = argv[4];
    if(description === undefined){
        throw new Error('Error. Perhaps you\'re missing an input?');
    }
    subCommands["add"](description);
}

if(subCommand === "list"){
    const stats = argv[4];
    if(stats === undefined){
        subCommands["list"](); 
    } else {
        subCommands["list"](stats);
    }
}

async function addTask(description){
    const now = new Date().toISOString();
    const task = {
        "id": 0, 
        "description": description,
        "status": 'todo',
        "createdAt": now,
        "updatedAt": now
    };

    let tasks = [];

    let fileExist = existsSync('tasks.json');

    if (!fileExist){
        try {
            tasks.push(task);
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task added successfully. (ID: ${task["id"]})`);
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    } else {
        try {
            const file = await readFile('./tasks.json');
            tasks = JSON.parse(file);
            task["id"] = Object.keys(tasks).filter(key => key === "id").length + 1;
            tasks.push(task);
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task added successfully. (ID: ${task["id"]})`);
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }
}

function updateTask(){
}

function deleteTask(){
}

async function listTasks(status=undefined){
    let tasks = [];
    let fileExist = existsSync('tasks.json');
    if (!fileExist) {
        console.log('Tasks database is empty.');
    } else {
        const file = await readFile('./tasks.json');
        tasks = JSON.parse(file);
        if(!([undefined, "todo", "in-progress", "done"].includes(status))){
            throw new Error('Status not recognized/does not exist.');
        }
        if(status === undefined){
           for (const task of tasks) {
               console.log(`Task ID: ${task["id"]}`);
               console.log(`Task Description: ${task["description"]}`);
               console.log(`Task Status: ${task["status"]}`);
               console.log(`Created at: ${task["createdAt"]}`);
               console.log(`Updated at: ${task["updatedAt"]}`);
               console.log('\n');
           }
        } else {
          for (const task of tasks) {
            if (task["status"] === status){
               console.log(`Task ID: ${task["id"]}`);
               console.log(`Task Description: ${task["description"]}`);
               console.log(`Task Status: ${task["status"]}`);
               console.log(`Created at: ${task["createdAt"]}`);
               console.log(`Updated at: ${task["updatedAt"]}`);
               console.log('\n');

            }
          }
       }
    }
}

function markTaskInProgress(){
}

function markTaskDone(){
}

function markTaskTodo(){
}

