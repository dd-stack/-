import "./style.css";
import "./js/tmp-pop.js";
import "./js/pm.js";

document.querySelector("#app").innerHTML = `
  <div class="main">
    <span id="standardTime"></span>
    <h1>날씨별 추천 옷차림</h1>
    <div id="weather">
      <span id="temp"></span>
      <span class="icon"></span>
      <span class="icon"></span>
    </div>
    <img id="image" src="" />
  </div>
`;
