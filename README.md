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

- `routine`, function which encapsulates execution body for the task

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

#### `add(task)`

#### `isRunning()`

#### `start()`

#### `stop()`
