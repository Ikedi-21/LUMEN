const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
async function fetchComics(page = 1) {
  const startIndex = (page - 1) * 20;
  const res = await fetch(`${BASE_URL}?q=comics&maxResults=20&startIndex=${startIndex}`);
  console.log(res.status);
  const text = await res.text();
  console.log(text.substring(0, 100));
}
fetchComics(1);
