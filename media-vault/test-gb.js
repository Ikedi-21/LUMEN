const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
async function fetchComics(page = 1) {
  const startIndex = (page - 1) * 20;
  const query = "subject:comics";
  const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&startIndex=${startIndex}`);
  if (!res.ok) throw new Error(`Google Books request failed (${res.status})`);
  
  const data = await res.json();
  const items = data.items || [];
  return { items, totalItems: data.totalItems || 0, page };
}

fetchComics(1).then(res => {
  console.log(res.items.length);
  if (res.items.length > 0) {
    console.log(res.items[0].volumeInfo.title);
  }
}).catch(console.error);
