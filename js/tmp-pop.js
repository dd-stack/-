// 위부터 읽어야 이해하기 편함

var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)

// 기상청 격자 <-> 위경도 변환 함수 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도, v1:x, v2:y) )
function dfs_xy_conv(code, v1, v2) {
  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs["x"] = v1;
    rs["y"] = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  return rs;
}

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

  const vilage_weather_payload =
    "serviceKey=" +
    import.meta.env.VITE_API_KEY +
    "&dataType=json" +
    "&base_date=" +
    base_date +
    "&base_time=" +
    base_time +
    "&nx=" +
    X +
    "&ny=" +
    Y;

  const standardTime2 = base_time.slice(0, 2);
  document.querySelector(
    "#standardTime"
  ).innerText = `${year}년 ${month}월 ${day}일 ${standardTime2}시 기준`;

  const vilage_weather_url =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?";
  const url = vilage_weather_url + vilage_weather_payload;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tmp = document.querySelector("#weather span:first-child"); //1시간 기온
      const pop = document.querySelector("#weather span:nth-child(2)"); //강수확률, 강수형태
      const 기온 = data.response.body.items.item[0].fcstValue; //1시간 기온
      const 강수확률 = data.response.body.items.item[7].fcstValue; //강수확률
      const 강수형태 = data.response.body.items.item[8].fcstValue; //강수형태

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
        image.src = "img/여름1.png";
      } else if (기온 >= 23 && 기온 < 28) {
        image.src = "img/여름2.png";
      } else if (기온 >= 20 && 기온 < 23) {
        image.src = "img/봄1.png";
      } else if (기온 >= 17 && 기온 < 20) {
        image.src = "img/봄2.png";
      } else if (기온 >= 12 && 기온 < 17) {
        image.src = "img/가을1.png";
      } else if (기온 >= 9 && 기온 < 12) {
        image.src = "img/가을2.png";
      } else if (기온 >= 5 && 기온 < 9) {
        image.src = "img/겨울1.png";
      } else if (기온 < 5) {
        image.src = "img/겨울2.png";
      }
    })
    .catch((error) => {
      console.error(error);
      return alert("날씨 정보(온도, 강수)를 가져오지 못했습니다.");
    });
}

function onGeoError() {
  alert("위치 확인 권한을 허용해 주세요.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
