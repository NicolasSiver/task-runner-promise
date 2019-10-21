# Task Runner

Task Runner is a service. It has `start` and `stop` methods to process incoming tasks as a FIFO queue.
This runner implementation designed to work with promise-based solutions.

Some of the use cases:

- There are routines where the return value is not critical but it's important to run routines in a sequence.
- Asynchronous handler requires Promise to wait while there is an execution of routines

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
 

- [Example](#example)
- [API](#api)
  - [`Task`](#task)
    - [`constructor(routine)`](#constructorroutine)
    - [`createToken()`](#createtoken)
  - [`TaskRunner`](#taskrunner)
    - [`add(task)`](#addtask)
    - [`isRunning()`](#isrunning)
    - [`start()`](#start)
    - [`stop()`](#stop)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Example

```javascript
const {Task, TaskRunner} = require('task-runner-promise');

let runner = new TaskRunner();
let myTask = new Task(() => console.log('My Task Routine Finished'));
let taskToken = myTask.createToken();

runner.add(myTask);
// Runner could run as a service and you can start before adding new tasks
runner.start();

taskToken.then(() => {
    console.log('Task is complete');
});

// Output:
// "My Task Routine Finished"
// "Task is complete"
```

## API

### `Task`

Abstraction around routine.
The routine could be any function with synchronous code or Promise.

#### `constructor(routine)`

Parameters:

- `routine {Function}`, function which encapsulates execution body for the task

Returns:

- `{Task}`, instance of the Task

Creates instance of the task with the provided routine.

#### `createToken()`

Returns:

- `{Promise}`, pending Promise

The token is based on Promise. This is the tool to be informed about completed work in the provided routine.
It's possible to `catch` errors if the provided routine produces an error.
The result of the routine is not captured by design.

### `TaskRunner`

Task Runner is where orchestration of the tasks happens.
Task Runner designed in a way that could be used as a service.
It's possible to create an instance and have it in memory, just `start()` the service and add new tasks as they arrive.
Task Runner will make sure that tasks are executed in a sequence.
The design also allows to do tasks in batches, you can add multiple tasks and `start()` service and wait when the result of the `start` operation is resolved.

Example for batching:

```javascript
// Tasks: Task 1, Task 2, ..., Task N
tasks.forEach(task => runner.add(task));

runner.start().then(() => console.log('Finished all tasks'));

// Output:
// Finished all tasks
``` 

#### `add(task)`

Parameters:

- `task {Task}`, instance of the task

Adds task to the queue.

#### `isRunning()`

Returns:

- `{Boolean}`, status if Task Runner is active

Check if Task Runner is active. 
Task Runner processes tasks only if it's in an active state.

#### `start()`

Returns:

- `{Promise}`, promise chain for the current queue

Starts processing for the tasks in the queue.
Task Runner awaits for new tasks.
Task Runner processes one task at a time.

#### `stop()`

Stops Task Runner.
Any task which is already running will finish disregarding the fact that runner was stopped.
