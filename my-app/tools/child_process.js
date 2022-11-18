#!/usr/bin/env node

const childProcess = require('child_process');

function spawnChild(config) {
	const processContext = createChildProcessContext(config);
	const spawned = processContext.execute();

	// Kill spawned process when parent process is canceled
	process.on('SIGINT', onExit);
	process.on('exit', onExit);

	function onExit() {
		processContext.exit();
		process.exit(0);
	}

	return spawned;
}

const CHILD_PROCESS_STATE = {
	UNSTARTED: 0,
	STARTED: 1,
	COMPLETED: 2,
	CANCELLED: -1,
}

function createChildProcessContext(processConfig) {
	// Listen to close/exit events, marking the process as no longer running
	let state = CHILD_PROCESS_STATE.UNSTARTED
	let spawnedProcess;

	return {
		config: processConfig,
		get state() { return state; },
		get process() { return spawnedProcess; },
		execute() {
			if (state === CHILD_PROCESS_STATE.UNSTARTED) {
				state = CHILD_PROCESS_STATE.STARTED;
				spawnedProcess = childProcess.spawn(processConfig.cmd, processConfig.args, processConfig.opts);

				spawnedProcess.on('close', function(code) {
					state = CHILD_PROCESS_STATE.COMPLETED;

					if (processConfig.onClose) {
						// Consider result similar to Grunt (grunt-legacy-util, index.js, ln. 185+)
						processConfig.onClose(code, state === CHILD_PROCESS_STATE.CANCELLED);
					}
				});

				spawnedProcess.on('exit', function() {
					// Close handler executes after, so it will override this when it successfully completes
					state = CHILD_PROCESS_STATE.CANCELLED;
				});

				if (processConfig.onExecute) {
					processConfig.onExecute(spawnedProcess);
				}
			}

			return spawnedProcess;
		},
		exit() {
			if (state === CHILD_PROCESS_STATE.STARTED) {
				spawnedProcess.kill('SIGINT');
			} else if (state === CHILD_PROCESS_STATE.UNSTARTED) {
				state = CHILD_PROCESS_STATE.CANCELLED;
			}
		}
	}
}

function spawnQueue(childProcesses, onExecute) {
	const processContexts = childProcesses.map(function(processConfig) {
		return createChildProcessContext(processConfig);
	});

	function executeNext(i) {
		const processContext = processContexts[i];
		const spawnedChild = processContext.execute().on('close', function(code) {
			if (code) {
				// Handle Error
				process.exit(code);
			} else if (i < processContexts.length - 1) {
				executeNext(i + 1);
			}
		});

		if (onExecute) {
			onExecute(spawnedChild, processContext, i);
		}
	}

	// Kill spawned process when parent process is canceled
	process.on('SIGINT', onExit);
	process.on('exit', onExit);

	function onExit() {
		processContexts.forEach(function(processContext) { processContext.exit(); });
		process.exit(0);
	}

	// Start the queue
	if (processContexts.length) {
		executeNext(0);
	}

	return processContexts;
}

module.exports = {
	spawnChild,
	spawnQueue,
};
