import { deletDB, getDB, postDB, putDB } from './pageActions.js';

let db = [];
const listEl = document.getElementById('list');

init();
const addForm = document.getElementById('addForm');
const deleteForm = document.getElementById('deleteForm');
const putForm = document.getElementById('putForm');

let debTimeout;

putForm.querySelector('#putId').addEventListener('input', async (e) => {
  if (debTimeout) {
    clearTimeout(debTimeout);
  }
  debTimeout = setTimeout(() => {
    const formData = new FormData(putForm);
    const id = Number(formData.get('id'));

    const instance = db.find((el) => el.id === id);
    if (!instance) return;
    putForm.elements.name.value = instance.name;
    putForm.elements.birthday.value = instance.bday;

    debTimeout = null;
  }, 300);
});

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addForm);
  const data = {
    name: formData.get('name'),
    bday: formData.get('birthday'),
  };
  console.log(data);
  await postDB(data);
  await refreshDB(addForm);
});

deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const id = formData.get('id');

  await deletDB(id);
  await refreshDB(deleteForm);
});

putForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(putForm);
  const data = {
    id: formData.get('id'),
    name: formData.get('name'),
    bday: formData.get('birthday'),
  };

  await putDB(data);
  await refreshDB(putForm);
});

async function init() {
  try {
    db = await getDB();

    renderList(db);
  } catch (error) {
    console.error('Error by getting db:', error);
  }
}

async function refreshDB(form) {
  const updatedDB = await getDB();
  renderList(updatedDB);
  db = updatedDB;
  if (form) {
    form.reset();
  }
}

function renderList(records) {
  listEl.innerHTML = '';
  records.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.append(createRow(item));
    listEl.appendChild(listItem);
  });
}

function createRow(item) {
  const cont = document.createElement('div');
  cont.className = 'row';
  const id = document.createElement('span');
  id.innerText = item.id;
  const name = document.createElement('span');
  name.innerText = item.name;
  const bday = document.createElement('span');
  bday.innerText = item.bday;

  cont.append(id, name, bday);
  return cont;
}
