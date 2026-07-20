import { useState, useEffect, useRef, useCallback } from "react";
import { getMediaByTypePage } from "@/services/media";

/**
 * Fetches media items for a given type with infinite-scroll pagination.
 *
 * Returns:
 *   items          – accumulated items across all loaded pages
 *   loading        – true while the very first page is loading
 *   isFetchingMore – true while a subsequent page is loading
 *   hasMore        – true if more pages are available
 *   error          – last fetch error (or null)
 *   loadMore       – call to fetch the next page and append results
 *   reset          – call to clear items and start from page 1
 *   setItems       – manual override (kept for backward compat with BrowsePage filters)
 */
export function useMediaFetch(type) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [prevType, setPrevType] = useState(type);

  const pageRef = useRef(1);
  const fetchingRef = useRef(false);
  const activeTypeRef = useRef(type);

  if (type !== prevType) {
    setPrevType(type);
    setItems([]);
    setHasMore(true);
    setError(null);
    setLoading(true);
    setIsFetchingMore(false);
  }

  useEffect(() => {
    if (!type) return;

    activeTypeRef.current = type;
    pageRef.current = 1;
    fetchingRef.current = false;

    let active = true;

    getMediaByTypePage(type, 1)
      .then((result) => {
        if (!active || activeTypeRef.current !== type) return;
        setItems(result.items);
        setHasMore(result.hasMore);
        pageRef.current = result.hasMore ? 2 : 1;
      })
      .catch((err) => {
        console.error(err);
        if (!active || activeTypeRef.current !== type) return;
        setError(err);
        setItems([]);
        setHasMore(false);
      })
      .finally(() => {
        if (!active || activeTypeRef.current !== type) return;
        setLoading(false);
      });

    return () => { active = false; };
  }, [type]);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMore || loading) return;

    fetchingRef.current = true;
    setIsFetchingMore(true);

    try {
      const nextPage = pageRef.current;
      const result = await getMediaByTypePage(type, nextPage);

      if (activeTypeRef.current !== type) return;

      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      pageRef.current = result.hasMore ? nextPage + 1 : nextPage;
    } catch (err) {
      console.error(err);
      if (activeTypeRef.current === type) {
        setError(err);
        setHasMore(false);
      }
    } finally {
      if (activeTypeRef.current === type) {
        setIsFetchingMore(false);
      }
      fetchingRef.current = false;
    }
  }, [type, hasMore, loading]);

  const reset = useCallback(() => {
    setPrevType(null);
    setItems([]);
    setHasMore(true);
    setError(null);
    setLoading(true);
    setIsFetchingMore(false);
    pageRef.current = 1;
    fetchingRef.current = false;
  }, []);

  return {
    items,
    loading,
    isFetchingMore,
    hasMore,
    error,
    loadMore,
    reset,
    setItems,
  };
}
