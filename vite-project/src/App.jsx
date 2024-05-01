import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const BASE_URL = "http://localhost:3000/api/v1";
  const [res, setRes] = useState("");
  const [image, setImage] = useState();
  const [serverError, setServerError] = useState(false);

  const requestImage = async () => {
    const response = await axios.get(`${BASE_URL}/image`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(response.data);
    setImage(url);
  };
  useEffect(() => {
    const func = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setRes(response.data.msg);
      } catch (er) {
        setServerError(true);
      }
    };
    func();
  }, []);
  return (
    <>
      <section style={{ filter: serverError ? "blur(5px)" : "none" }}>
        <span>{res}</span>
        <h1>REQUEST IMAGE</h1>
        <button onClick={requestImage}>click</button>
        {image ? <img src={image} /> : <p>click on request to an image </p>}
      </section>

      {serverError ? (
        <div className="errorBox">
          <div className="box">
            <h1>server is facing some issues pls try again later</h1>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default App;
