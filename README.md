# Task Runner

Task Runner is a service. It has `start` and `stop` methods to process incoming tasks as a FIFO queue.
This runner implementation designed to work with promise-based solutions.

Some of the use cases:

- There are routines where the return value is not critical but it's important to run routines in a sequence.
- Asynchronous handler requires Promise to wait while there is an execution of routines
