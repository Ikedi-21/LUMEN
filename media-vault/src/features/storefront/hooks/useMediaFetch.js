import { useState, useEffect } from "react";
import { getMediaByType } from "@/services/media";

export function useMediaFetch(type) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type) return;
    setLoading(true);
    setError(null);
    getMediaByType(type)
      .then(setItems)
      .catch((err) => {
        console.error(err);
        setError(err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [type]);

  return { items, loading, error, setItems };
}
