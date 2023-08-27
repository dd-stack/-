import {
  getToken,
  xy_tmxy_trans,
  getNearbyMsrstnList,
  getMsrstnAcctoRltmMesureDnsty,
} from "../api/getMsrstnDust";

// 측정소 기준 미세먼지 정보 조회
function getMsrstnDust(msrstn) {
  getMsrstnAcctoRltmMesureDnsty(msrstn).then((response) => {
    if (response !== "fail") {
      const pm = document.querySelector("#weather span:last-child");
      // 가장 최근 정보 (좋음: 1, 보통: 2, 나쁨: 3, 매우나쁨: 4)
      const 미세먼지 = response.response.body.items[0].pm10Grade;
      const 초미세먼지 = response.response.body.items[0].pm25Grade;

      let 미세먼지이모지 = "";
      if (미세먼지 > 2 || 초미세먼지 > 2) {
        // 미세먼지나 초미세먼지가 나쁨, 매우나쁨인 경우
        미세먼지이모지 = "😷";
      } else {
        미세먼지이모지 = "😊";
      }
      pm.innerText = 미세먼지이모지;
    }
    if (response === "fail") {
      return alert("미세먼지 정보를 가져오지 못했습니다.");
    }
  });
}

// 액세스 토큰 발급 -> 위경도-TM 좌표 변환 -> 근접 측정소 목록 조회
function onGeoOk(position) {
  const lat = position.coords.latitude; // 위도(y)
  const lon = position.coords.longitude; // 경도(x)

  // 액세스 토큰 발급
  getToken().then((response) => {
    if (response !== "fail") {
      const access_token = response.result.accessToken;
      // 위경도-TM 좌표 변환
      xy_tmxy_trans(access_token, lat, lon).then((response) => {
        if (response !== "fail") {
          const tmX = response.result.posX;
          const tmY = response.result.posY;
          // 근접 측정소 목록 조회
          getNearbyMsrstnList(tmX, tmY).then((response) => {
            if (response !== "fail") {
              // 가장 가까운 측정소 이름
              const msrstn = response.response.body.items[0].stationName;
              getMsrstnDust(msrstn);
            }
            if (response === "fail") {
              getMsrstnDust("종로구");
              return alert(
                "가까운 미세먼지 측정소 조회에 실패했습니다. 종로구 기준으로 미세먼지가 표시됩니다."
              );
            }
          });
        }
        if (response === "fail") {
          getMsrstnDust("종로구");
          return alert(
            "TM 좌표 변환 api 호출에 실패했습니다. 종로구 기준으로 미세먼지가 표시됩니다."
          );
        }
      });
    }
    if (response === "fail") {
      getMsrstnDust("종로구");
      return alert(
        "TM 좌표 변환 api용 액세스 토큰 발급에 실패했습니다. 종로구 기준으로 미세먼지가 표시됩니다."
      );
    }
  });
}

function onGeoError() {
  alert("위치 확인 권한을 허용해 주세요.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
