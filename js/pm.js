// 아래부터 읽어야 이해하기 편함

function getMsrstnAcctoRltmMesureDnsty(msrstn) {
  const dust_url =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";
  const dust_payload =
    "stationName=" +
    msrstn +
    "&dataTerm=DAILY" +
    "&returnType=json" +
    "&serviceKey=" +
    API_KEY1 +
    "&ver=1.0";
  const url = dust_url + dust_payload;

  // 미세먼지 정보 조회
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const pm = document.querySelector("#weather span:last-child");
      const 미세먼지 = data.response.body.items[0].pm10Grade; // 가장 최근 정보 (좋음: 1, 보통: 2, 나쁨: 3, 매우나쁨: 4)
      const 초미세먼지 = data.response.body.items[0].pm25Grade; // 가장 최근 정보 (좋음: 1, 보통: 2, 나쁨: 3, 매우나쁨: 4)

      let 미세먼지이모지 = "";
      if (미세먼지 > 2 || 초미세먼지 > 2) {
        //미세먼지나 초미세먼지가 나쁨, 매우나쁨인 경우
        미세먼지이모지 = "😷";
      } else {
        미세먼지이모지 = "😊";
      }
      pm.innerText = 미세먼지이모지;
    })
    .catch((error) => {
      console.error(error);
      return alert("미세먼지 정보를 가져오지 못했습니다.");
    });
}

// 근접 측정소 목록 조회 후 미세먼지 정보 조회
function getNearbyMsrstnList(tmX, tmY) {
  const msrstn_url = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?";
  const msrstn_payload =
    "tmX=" + tmX + "&tmY=" + tmY + "&returnType=json" + "&serviceKey=" + API_KEY2;
  const url = msrstn_url + msrstn_payload;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const msrstn = data.response.body.items[0].stationName;
      getMsrstnAcctoRltmMesureDnsty(msrstn);
    })
    .catch((error) => {
      console.error(error);
      getMsrstnAcctoRltmMesureDnsty("종로구");
      return alert(
        "가까운 미세먼지 측정소 조회에 실패했습니다. 종로구 기준으로 미세먼지가 표시됩니다."
      );
    });
}

// 위경도 -> TM 좌표 변환 후 근접 측정소 목록 조회
function xy_tmxy_trans(access_token, lat, lon) {
  const trans_url = "https://sgisapi.kostat.go.kr/OpenAPI3/transformation/transcoord.json?";
  const trans_payload =
    "src=4326&dst=5181" + "&posX=" + lon + "&posY=" + lat + "&accessToken=" + access_token;
  const url = trans_url + trans_payload;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tmX = data.result.posX;
      const tmY = data.result.posY;
      getNearbyMsrstnList(tmX, tmY);
    })
    .catch((error) => {
      console.error(error);
      getMsrstnAcctoRltmMesureDnsty("종로구");
      return alert("TM 좌표 변환 api 호출에 실패했습니다. 종로구 기준으로 미세먼지가 표시됩니다.");
    });
}

function onGeoOk(position) {
  const lat = position.coords.latitude; //위도(y)
  const lon = position.coords.longitude; //경도(x)

  const auth_url = "https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?";
  const auth_payload = "consumer_key=" + consumer_key + "&consumer_secret=" + consumer_secret;
  const url = auth_url + auth_payload;

  // 액세스 토큰 발급 후 위경도 -> TM 좌표 변환
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const access_token = data.result.accessToken;
      xy_tmxy_trans(access_token, lat, lon);
    })
    .catch((error) => {
      console.error(error);
      getMsrstnAcctoRltmMesureDnsty("종로구");
      return alert(
        "TM 좌표 변환 api용 액세스 토큰 발급에 실패했습니다. 종로구 기준으로 미세먼지가 표시됩니다."
      );
    });
}

function onGeoError() {
  alert("위치 확인 권한을 허용해 주세요.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
