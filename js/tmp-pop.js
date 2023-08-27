import dfs_xy_conv from "../util/dfs_xy_conv.js";
import { getVilageWeather } from "../api/getVilageWeather.js";

function onGeoOk(position) {
  const lat = position.coords.latitude; //위도
  const lon = position.coords.longitude; //경도
  const liveIn = dfs_xy_conv("toXY", lat, lon);
  const X = liveIn.x; //X좌표
  const Y = liveIn.y; //Y좌표

  let date = new Date();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const time = Number(hours + minutes); //현재 시간

  let standardTime = "";
  if (210 <= time && time < 510) {
    standardTime = "0200";
  } else if (510 <= time && time < 810) {
    standardTime = "0500";
  } else if (810 <= time && time < 1110) {
    standardTime = "0800";
  } else if (1110 <= time && time < 1410) {
    standardTime = "1100";
  } else if (1410 <= time && time < 1710) {
    standardTime = "1400";
  } else if (1710 <= time && time < 2010) {
    standardTime = "1700";
  } else if (2010 <= time && time < 2310) {
    standardTime = "2000";
  } else if (2310 <= time) {
    standardTime = "2300";
  } else {
    date = new Date(new Date().setDate(new Date().getDate() - 1)); //어제
    standardTime = "2300";
  }

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const base_date = `${year}${month}${day}`; //출력 예시 => '20230212'
  const base_time = `${standardTime}`; //발표 기준 시간으로 변환

  document.querySelector(
    "#standardTime"
  ).innerText = `${year}년 ${month}월 ${day}일 ${base_time.slice(0, 2)}시 기준`;

  getVilageWeather(base_date, base_time, X, Y).then((response) => {
    if (response !== "fail") {
      const tmp = document.querySelector("#weather span:first-child");
      const pop = document.querySelector("#weather span:nth-child(2)");
      const 기온 = response.response.body.items.item[0].fcstValue; //1시간 기온
      const 강수확률 = response.response.body.items.item[7].fcstValue;
      const 강수형태 = response.response.body.items.item[8].fcstValue;

      let 강수이모지 = "";
      if (강수확률 >= 50 || [1, 2, 3, 4].includes(강수형태)) {
        //강수확률 50% 이상이거나
        //강수형태가 0(강수없음)이 아닐 때 (비: 1, 비/눈: 2, 눈: 3, 소나기: 4)
        강수이모지 = "☂️";
      } else {
        강수이모지 = "🌈";
      }
      tmp.innerText = `${기온}℃`;
      pop.innerText = 강수이모지;

      // 이미지의 src 속성을 기온에 따라 변경
      const image = document.querySelector("#image");
      if (기온 >= 28) {
        image.src = "./img/summer1.png";
      } else if (기온 >= 23 && 기온 < 28) {
        image.src = "./img/summer2.png";
      } else if (기온 >= 20 && 기온 < 23) {
        image.src = "./img/spring1.png";
      } else if (기온 >= 17 && 기온 < 20) {
        image.src = "./img/spring2.png";
      } else if (기온 >= 12 && 기온 < 17) {
        image.src = "./img/fall1.png";
      } else if (기온 >= 9 && 기온 < 12) {
        image.src = "./img/fall2.png";
      } else if (기온 >= 5 && 기온 < 9) {
        image.src = "./img/winter1.png";
      } else if (기온 < 5) {
        image.src = "./img/winter2.png";
      }
    }
    if (response === "fail") {
      return alert("날씨 정보를 가져오지 못했습니다.");
    }
  });
}

function onGeoError() {
  alert("위치 확인 권한을 허용해 주세요.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
