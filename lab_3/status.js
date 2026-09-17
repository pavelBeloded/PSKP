const statusEl = document.getElementById("status");
const eventSource = new EventSource("/events");

eventSource.onmessage = (event) => {
  statusEl.innerText = event.data;
};

eventSource.onerror = () => {
  statusEl.innerText = "Error occurred";
};
