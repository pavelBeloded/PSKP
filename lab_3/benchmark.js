function appendResultLine(text) {
  const el = document.createElement("p");
  el.textContent = text;
  document.querySelector("#results").appendChild(el);
}

async function runBenchmark(endpoint) {
  const startTime = performance.now();

  for (let k = 1; k < 30; k++) {
    const res = await fetch(`${endpoint}?k=${k}`);
    const data = await res.json();
    const elapsed = Math.round(performance.now() - startTime);

    appendResultLine(`${k}. Result: ${elapsed}-${data.k}/${data.fact}`);
  }

  const totalDuration = Math.round(performance.now() - startTime);
  appendResultLine(`Total duration ${totalDuration} ms`);
}

const endpoint = document.currentScript.dataset.endpoint;
runBenchmark(endpoint);
