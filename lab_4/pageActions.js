
export async function getDB() {
  const res =await fetch('http://localhost:5000/api/db') ?? [];
  return res.json();
}

export async function postDB(data) {
  try {
    return await fetch(`http://localhost:5000/api/db`, {
      method: 'POST',
      body:  JSON.stringify(data) ,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    console.log(error);
  }
}

export async function deletDB(id) {
  try {
    return await fetch('http://localhost:5000/api/db?id=' + id, {
      method: "DELETE"
    })
  } catch(error) {
    console.log(error);
  }
}

export async function putDB(row) {
  try {
    return await fetch(`http://localhost:5000/api/db`, {
      method: 'PUT',
      body: JSON.stringify(row),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  catch (error) {
    console.log(error);
  }
}

