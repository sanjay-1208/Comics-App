import { useState } from "react";
import md5 from "md5";
import "../styles/Search.css";
import Characters from "./characters";
import Comics from "./comics";

export default function Search() {
  const [characterData, setCharacterData] = useState(null);
  const [comicData, setComicData] = useState(null);
  const [characterName, setCharacterName] = useState("");

  const privateKey = "de6a5a981d21d8e1febeeaa7a017ed026cdd326d";
  const publicKey = "79465082ce2bf65c6b64f7121e6e7a71";

  const handleSubmit = (event) => {
    event.preventDefault();

    getCharacterData();
  };

  const getCharacterData = () => {
    setCharacterData(null);
    setComicData(null);

    const timeStamp = new Date().getTime();
    const hash = generateHash(timeStamp);

    const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}&limit=100`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setCharacterData(result.data);
        console.log(result.data);
      })
      .catch(() => {
        console.log("error while getting character data");
      });
  };

  const getComicData = (characterId) => {
    window.scrollTo({ top: 0, left: 0 });

    const timeStamp = new Date().getTime();
    const hash = generateHash(timeStamp);

    const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setComicData(result.data);
        console.log(result.data);
      })
      .catch(() => {
        console.log("error while getting comic data");
      });
  };

  const handleChange = (event) => {
    setCharacterName(event.target.value);
  };

  const generateHash = (timeStamp) => {
    return md5(timeStamp + privateKey + publicKey);
  };

  const handleReset = () => {
    setCharacterName("");
    setCharacterData(null);
    setComicData(null);
  };

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ENTER CHARACTER NAME"
          onChange={handleChange}
        />
        <div className="buttons">
          <button type="submit">SEARCH</button>
          <button type="reset" className="reset" onClick={handleReset}>
            RESET
          </button>
        </div>
      </form>

      {!comicData && characterData && characterData.results[0] && (
        <Characters data={characterData.results} onClick={getComicData} />
      )}

      {comicData && comicData.results[0] && (
        <Comics data={comicData.results} onClick={() => {}} />
      )}
    </>
  );
}