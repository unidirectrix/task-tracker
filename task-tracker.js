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

if(subCommand === "update"){
    const id = argv[4];
    const description = argv[5];
    if (id === undefined || description === undefined){
        throw new Error('Error. Perhaps you\'re missing an input?');
    }
    subCommands["update"](id, description);
}

if(subCommand === "delete"){
    const id = argv[4];
    if (id === undefined) {
        throw new Error('Error. Perhaps you\'re missing an input?');
    }
    subCommands["delete"](id);
}

if(subCommand === "mark-in-progress"){
    const id = argv[4];
    if (id === undefined) {
        throw new Error('Error. Perhaps you\'re missing an input?');
    }
    subCommands["mark-in-progress"](id);
}

if(subCommand === "mark-done"){
    const id = argv[4];
    if (id === undefined) {
        throw new Error('Error. Perhaps you\'re missing an input?');
    }
    subCommands["mark-done"](id);

}

if(subCommand === "mark-todo"){
    const id = argv[4];
    if (id === undefined) {
        throw new Error('Error. Perhaps you\'re missing an input?');
    }
    subCommands["mark-todo"](id);

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
            task["id"] = tasks[tasks.length-1]["id"] + 1; 
            tasks.push(task);
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task added successfully. (ID: ${task["id"]})`);
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }
}

async function updateTask(id, description){
    let tasks = [];
    let fileExist = existsSync('tasks.json');
    if (!fileExist) {
        console.log('Tasks database is empty.');
    } else {
        try {
            const file = await readFile('./tasks.json'); 
            tasks = JSON.parse(file);
            const now = new Date().toISOString();
            let idFound = false;
            for (const task of tasks){
              if (task["id"] === parseInt(id)){
                task["description"] = description;
                task["updatedAt"] = now; 
                idFound = true;
              }
            }
            if (!idFound){
                throw new Error('Invalid id/id does not exist.');
            }
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task updated successfully. (ID: ${id})`);
        } catch (err) {
            console.log(err);
        }
    }
}

async function deleteTask(id){
    let tasks = [];
    let fileExist = existsSync('tasks.json');
    if (!fileExist) {
        console.log('Tasks database is empty.');
    } else {
       try {
           const file = await readFile('./tasks.json');
           tasks = JSON.parse(file);
           let idFound = false; 
           const editedTasks = tasks.filter(task => task["id"] !== parseInt(id));
           if (editedTasks.length !== tasks.length) {
              idFound = true; 
           }
           if (!idFound){
               throw new Error('Invalid id/id does not exist.');
           }
           await writeFile('./tasks.json', JSON.stringify(editedTasks));
           console.log(`Output: Task deleted successfully. (ID: ${id})`);
       } catch (err) {
           console.log(err);
       }
    }
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

async function markTaskInProgress(id){
    let tasks = []
    let fileExist = existsSync('tasks.json');
    if (!fileExist) {
        console.log('Tasks database is empty.');
    } else {
        try {
            const file = await readFile('./tasks.json');
            tasks = JSON.parse(file);
            const now = new Date().toISOString();
            let idFound = false; 
            for (const task of tasks) {
                if (task["id"] === parseInt(id)) {
                   task["status"] = 'in-progress'; 
                   idFound = true;
                }
            }
            if (!idFound) {
                throw new Error('Invalid id/id does not exist.');
            }
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task updated successfully. (ID: ${id})`);
        } catch (err) {
            console.log(err);
        }
    }
}

async function markTaskDone(id){
    let tasks = []
    let fileExist = existsSync('tasks.json');
    if (!fileExist) {
        console.log('Tasks database is empty.');
    } else {
        try {
            const file = await readFile('./tasks.json');
            tasks = JSON.parse(file);
            const now = new Date().toISOString();
            let idFound = false; 
            for (const task of tasks) {
                if (task["id"] === parseInt(id)) {
                   task["status"] = 'done'; 
                   idFound = true;
                }
            }
            if (!idFound) {
                throw new Error('Invalid id/id does not exist.');
            }
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task updated successfully. (ID: ${id})`);
        } catch (err) {
            console.log(err);
        }
    }
}

async function markTaskTodo(id){
    let tasks = []
    let fileExist = existsSync('tasks.json');
    if (!fileExist) {
        console.log('Tasks database is empty.');
    } else {
        try {
            const file = await readFile('./tasks.json');
            tasks = JSON.parse(file);
            const now = new Date().toISOString();
            let idFound = false;
            for (const task of tasks) {
                if (task["id"] === parseInt(id)) {
                   task["status"] = 'todo'; 
                   idFound = true;
                }
            }
            if (!idFound) {
                throw new Error('Invalid id/id does not exist.');
            }
            await writeFile('./tasks.json', JSON.stringify(tasks));
            console.log(`Output: Task updated successfully. (ID: ${id})`);
        } catch (err) {
            console.log(err);
        }
    }
}

