/**
 * Fetches comics from the serverless proxy.
 * Includes a premium mock data fallback if the serverless function is offline
 * (e.g. when developing locally via `npm run dev` instead of `vercel dev` or if keys are missing).
 */
const FALLBACK_ITEMS = [
  {
    id: 9912270,
    name: "Spider-Man: Blue",
    cover_date: "2025-08-01",
    description: "Jeph Loeb and Tim Sale's classic retrospective on Peter Parker's first love, Gwen Stacy.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912270-wwww.jpg"
    },
    volume: { name: "Spider-Man" }
  },
  {
    id: 9912291,
    name: "The Amazing Spider-Man #1",
    cover_date: "2025-07-01",
    description: "A legendary jumping-on point in the wall-crawler's adventures.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912291-ww.jpg"
    },
    volume: { name: "Spider-Man" }
  },
  {
    id: 9912275,
    name: "Ultimate Spider-Man #1",
    cover_date: "2025-05-01",
    description: "A modern reimagining of the web-slinger's origins in the Ultimate Universe.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912275-1974746305.jpg"
    },
    volume: { name: "Spider-Man" }
  },
  {
    id: 9912273,
    name: "Spider-Man: Reign",
    cover_date: "2025-09-01",
    description: "A dark, dystopian look at an older Peter Parker returning to save his city.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912273-w.jpg"
    },
    volume: { name: "Spider-Man" }
  },
  {
    id: 9912280,
    name: "Spider-Man: Life Story #1",
    cover_date: "2025-04-01",
    description: "What if Peter Parker aged in real time? A saga spanning decades of Spider-Man history.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912280-ww.jpg"
    },
    volume: { name: "Spider-Man" }
  },
  {
    id: 9912285,
    name: "Venom: Lethal Protector #1",
    cover_date: "2025-03-01",
    description: "Eddie Brock becomes San Francisco's protector in this symbiote-fueled limited series.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912285-w.jpg"
    },
    volume: { name: "Venom" }
  },
  {
    id: 9912290,
    name: "Daredevil: Born Again #1",
    cover_date: "2025-02-01",
    description: "Frank Miller's definitive Daredevil story — Karen Page returns and the Kingpin destroys Matt Murdock's life.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912290-ww.jpg"
    },
    volume: { name: "Daredevil" }
  },
  {
    id: 9912295,
    name: "X-Men: Days of Future Past #1",
    cover_date: "2025-01-01",
    description: "The iconic dystopian tale where Sentinels have hunted mutants to near extinction.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912295-w.jpg"
    },
    volume: { name: "X-Men" }
  },
  {
    id: 9912300,
    name: "Batman: The Long Halloween #1",
    cover_date: "2025-06-01",
    description: "A murder mystery spanning twelve months in Gotham, defining the Dark Detective era.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912300-ww.jpg"
    },
    volume: { name: "Batman" }
  },
  {
    id: 9912305,
    name: "Watchmen #1",
    cover_date: "2025-10-01",
    description: "Alan Moore and Dave Gibbons' deconstruction of the superhero genre in an alternate 1985.",
    image: {
      medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912305-w.jpg"
    },
    volume: { name: "Watchmen" }
  }
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchComics(query = "spider-man", offset = 0, limit = 20) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await sleep(1500);
      const res = await fetch(
        `/api/comicvine?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
      );
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      return {
        results: data.results || [],
        total_results: data.number_of_total_results || data.results?.length || 0,
        offset: data.offset || 0,
      };
    } catch (err) {
      if (attempt === 0) continue;
      console.warn(
        `Comic Vine proxy unavailable (${err.message}). Falling back to local development dataset.`
      );
      const paged = FALLBACK_ITEMS.slice(offset, offset + limit);
      return {
        results: paged,
        total_results: FALLBACK_ITEMS.length,
        offset,
      };
    }
  }
}
