document.queryDatabase = async function queryDatabase(query) {
  const response = await fetch('http://localhost:4201/query', {
    method: 'POST',
    body: JSON.stringify({
      query
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
}