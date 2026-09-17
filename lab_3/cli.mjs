import readline from "node:readline";

export const SERVER_STATES = ["norm", "stop", "test", "idle"];

export function createStateCli({ onStateChange }) {
  let currentState = SERVER_STATES[0];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function updatePrompt() {
    rl.setPrompt(`${currentState} --> `);
    rl.prompt();
  }

  rl.on("line", (line) => {
    const input = line.trim();

    if (input === "exit") {
      console.log("Stopping the server...");
      process.exit(0);
    }

    if (SERVER_STATES.includes(input)) {
      currentState = input;
      onStateChange(currentState);
    } else {
      console.log(`Error unknown state : ${input}`);
    }

    updatePrompt();
  });

  return {
    getState: () => currentState,
    start: updatePrompt,
  };
}
