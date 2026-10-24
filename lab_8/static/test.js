alert('Loaded test.js!');

const xmlButton = document.getElementById('xml-download');
const jsonButton = document.getElementById('json-download');

const mainContainer = document.getElementById('main_container');
const output = document.getElementById('output');
jsonButton.onclick = async function () {
  try {
    const res = await fetch('/assets/tsconfig.json');

    const json = await res.json();
    output.textContent = JSON.stringify(json, null, 2);
  } catch (e) {
    throw new Error(e);
  }
};

xmlButton.onclick = async function () {
  try {
    const res = await fetch('/assets/config.xml');
    const raw = await res.text();

    output.textContent = raw;
  } catch (e) {
    throw new Error(e);
  }
};
