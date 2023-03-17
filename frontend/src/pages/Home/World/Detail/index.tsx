import Map from "./Map";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";

export type TContinent = {
  name: string;
  cpos: string;
  lpos: string;
};

function Detail() {
  const [continent, setContinent] = useState<TContinent>({
    name: "",
    cpos: "",
    lpos: "",
  });
  return (
    <div>
      <Header continent={continent} />
      <Map setContinent={setContinent} />
      <Footer />
    </div>
  );
}

export default Detail;
