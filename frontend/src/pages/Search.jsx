import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MediumThumbnail } from "../components/Thumbnails";
import api from "../api";
import Header from "../components/Header";

function Search() {
  const [searchparams] = useSearchParams();
  const query = searchparams.get("q");

  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`api/search/?q=${query}`);
        setResults(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="body">
      <Header destination="Search" />
      <div>Top Result</div>
      <div className="medium-thumbnails">
        {results.songs?.map((song) => (
          <MediumThumbnail item={song} />
        ))}
      </div>
    </div>
  );
}

export default Search;
