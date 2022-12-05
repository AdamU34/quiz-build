import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading("loading...");
    setData(null);
    setError(null);

    const fetchData = async () => {
      const res = await fetch(url);
      const json = await res.json();

      setLoading(false);
      setData(json);
    };

    fetchData().catch((err) => {
      setLoading(false);
      setError("An error occurred!");
    });
  }, [url]);

  return { loading, data, error };
};

export default useFetch;
