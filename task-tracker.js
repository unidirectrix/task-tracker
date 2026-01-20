import { argv } from 'node:process';

// define list of commands
// must equal to 'task-cli'
const rootCommand = argv[2]; 
if (rootCommand !== 'task-cli') { 
    throw new Error("Not a valid command");
}

// legal commands
const subCommand = {
    "add": addTask,
    "update": updateTask,
    "delete": deleteTask,
    "list": listAllTasks,
    "mark-in-progress": markTaskInProgress,
    "mark-done": markTaskDone,
    "mark-todo": markTaskTodo
};

function addTask(){
}

function updateTask(){
}

function deleteTask(){
}

function listAllTasks(){
}

function markTaskInProgress(){
}

function markTaskDone(){
}

function markTaskTodo(){
}

