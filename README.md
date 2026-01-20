# Task Tracker CLI

This is a basic task tracker cli project from the roadmap.sh projects. The programming language used is JavaScript with the Node.js environment.

## Requirements

The application should run from the command line, accept user actions and input as arguments, and store the tasks in a JSON file. The user should be able to:

- Add, Update, and Delete tasks
- Mark a task as in progress or done
- List all tasks
- List all tasks that are done
- List all tasks that are not done
- List all tasks that are in progress

## Constraints

- Use positional arguments as user inputs.
- Use JSON file to store the tasks in the **same** directory.
- The JSON file should be created if it doesn't exist.
- Use the native filesystem module (in this case from Node.js) to interact with the JSON file.
- DO not use external libraries or frameworks.
- Handle errors and edge cases gracefully.

## Example

```bash
# Adding a new task
npm start task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
npm start task-cli update 1 "Buy groceries and cook dinner"
npm start task-cli delete 1

# Marking a task as in progress or done
npm start task-cli mark-in-progress 1
npm start task-cli mark-done 1

# Listing all tasks
npm start task-cli list

# Listing tasks by status
npm start task-cli list done
npm start task-cli list todo
npm start task-cli list in-progress
```
##### Note

A file called `tasks.json` will be created the first time you use the `add` subcommand. The program will then refer to this JSON file in the current directory to perform the rest of the subcommands.
