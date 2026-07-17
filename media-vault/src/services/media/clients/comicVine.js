/**
 * Fetches comics from the serverless proxy.
 * Includes a premium mock data fallback if the serverless function is offline
 * (e.g. when developing locally via `npm run dev` instead of `vercel dev` or if keys are missing).
 */
export async function fetchComics(query = "spider-man") {
  try {
    const res = await fetch(`/api/comicvine?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const data = await res.json();
    
    // If the proxy returns error JSON (like missing key), throw to trigger fallback
    if (data && data.error) {
      throw new Error(data.error);
    }
    
    return data.results || [];
  } catch (err) {
    console.warn(
      `Comic Vine proxy unavailable (${err.message}). Falling back to local development dataset.`
    );
    
    // Return high-quality fallback items matching the raw API payload
    return [
      {
        id: 9912270,
        name: "Spider-Man: Blue",
        cover_date: "2025-08-01",
        description: "Jeph Loeb and Tim Sale's classic retrospective on Peter Parker's first love, Gwen Stacy.",
        image: {
          medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912270-wwww.jpg"
        },
        volume: {
          name: "Spider-Man"
        }
      },
      {
        id: 9912291,
        name: "The Amazing Spider-Man #1",
        cover_date: "2025-07-01",
        description: "A legendary jumping-on point in the wall-crawler's adventures.",
        image: {
          medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912291-ww.jpg"
        },
        volume: {
          name: "Spider-Man"
        }
      },
      {
        id: 9912275,
        name: "Ultimate Spider-Man #1",
        cover_date: "2025-05-01",
        description: "A modern reimagining of the web-slinger's origins in the Ultimate Universe.",
        image: {
          medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912275-1974746305.jpg"
        },
        volume: {
          name: "Spider-Man"
        }
      },
      {
        id: 9912273,
        name: "Spider-Man: Reign",
        cover_date: "2025-09-01",
        description: "A dark, dystopian look at an older Peter Parker returning to save his city.",
        image: {
          medium_url: "https://comicvine.gamespot.com/a/uploads/scale_medium/11/110017/9912273-w.jpg"
        },
        volume: {
          name: "Spider-Man"
        }
      }
    ];
  }
}
