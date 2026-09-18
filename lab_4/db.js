let DB = [
  {
    "id": 1,
    "name": "Pavel",
    "bday": "22.04.2007"
  },
  {
    "id": 2,
    "name": "Anna",
    "bday": "23.12.1996"
  },
  {
    "id": 3,
    "name": "Dmitry",
    "bday": "23.08.1996"
  },
  {
    "id": 4,
    "name": "Elena",
    "bday": "16.01.2006"
  },
  {
    "id": 5,
    "name": "Maxim",
    "bday": "12.01.1993"
  },
  {
    "id": 6,
    "name": "Olga",
    "bday": "17.05.2008"
  },
  {
    "id": 7,
    "name": "Artem",
    "bday": "15.07.2009"
  },
  {
    "id": 8,
    "name": "Maria",
    "bday": "04.05.2008"
  },
  {
    "id": 9,
    "name": "Ivan",
    "bday": "19.11.1998"
  },
  {
    "id": 10,
    "name": "Svetlana",
    "bday": "13.02.2001"
  },
  {
    "id": 11,
    "name": "Sergey",
    "bday": "23.03.2007"
  },
  {
    "id": 12,
    "name": "Natalia",
    "bday": "26.08.2008"
  },
  {
    "id": 13,
    "name": "Alexey",
    "bday": "01.02.2000"
  },
  {
    "id": 14,
    "name": "Tatiana",
    "bday": "06.05.1993"
  },
  {
    "id": 15,
    "name": "Andrey",
    "bday": "11.06.2003"
  },
  {
    "id": 16,
    "name": "Ekaterina",
    "bday": "23.05.1995"
  },
  {
    "id": 17,
    "name": "Igor",
    "bday": "26.04.1994"
  },
  {
    "id": 18,
    "name": "Irina",
    "bday": "13.02.2008"
  },
  {
    "id": 19,
    "name": "Denis",
    "bday": "08.03.1995"
  },
  {
    "id": 20,
    "name": "Julia",
    "bday": "01.05.2010"
  }
]



const delay = () => new Promise(resolve => setImmediate(resolve))

export async function select() {
  await delay()
  return [...DB]
}

export async function insert(row) {
  await delay();

  const id = DB.length > 0 ? Math.max(...DB.map(r => r.id)) + 1 : 1;

  const newRow = { id, ...row };
  DB.push(newRow);

  return newRow;
}
export async function update(row) {
  await delay();

  const targetId = Number(row.id);
  const index = DB.findIndex(r => r.id === targetId);

  if (index === -1) {
    return null;
  }

  DB[index] = row;
  return row;
}
export async function delet(id) {
  await delay();


  const index = DB.findIndex(r => r.id === +id);

  if (index === -1) {
    return null;
  }

  const [deletedRow] = DB.splice(index, 1);
  return deletedRow;
}