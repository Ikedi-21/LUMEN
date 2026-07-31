import { fetchComics } from "./src/services/media/clients/googleBooksComics.js";
import { normalizeComicPage } from "./src/services/media/adapters/googleBooksComics.adapter.js";

async function test() {
  try {
    const raw = await fetchComics(1);
    console.log("Raw items length:", raw.items.length);
    const normalized = normalizeComicPage(raw);
    console.log("Normalized items:", JSON.stringify(normalized.items.slice(0, 2), null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
