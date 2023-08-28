export const getToken = async () => {
  const auth_url = "https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?";
  const auth_payload =
    "consumer_key=" +
    import.meta.env.VITE_CONSUMER_KEY +
    "&consumer_secret=" +
    import.meta.env.VITE_CONSUMER_SECRET;
  const url = auth_url + auth_payload;

  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
    return "fail";
  }
};

export const xy_tmxy_trans = async (access_token, lat, lon) => {
  const trans_url = "https://sgisapi.kostat.go.kr/OpenAPI3/transformation/transcoord.json?";
  const trans_payload =
    "src=4326&dst=5181" + "&posX=" + lon + "&posY=" + lat + "&accessToken=" + access_token;
  const url = trans_url + trans_payload;

  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
    return "fail";
  }
};

export const getNearbyMsrstnList = async (tmX, tmY) => {
  const msrstn_url = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?";
  const msrstn_payload =
    "tmX=" +
    tmX +
    "&tmY=" +
    tmY +
    "&returnType=json" +
    "&serviceKey=" +
    import.meta.env.VITE_API_KEY;
  const url = msrstn_url + msrstn_payload;

  try {
    const response = await fetch(url, { method: "POST" });
    return response.json();
  } catch (error) {
    console.error(error);
    return "fail";
  }
};

export const getMsrstnAcctoRltmMesureDnsty = async (msrstn) => {
  const dust_url =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";
  const dust_payload =
    "stationName=" +
    msrstn +
    "&dataTerm=DAILY" +
    "&returnType=json" +
    "&serviceKey=" +
    import.meta.env.VITE_API_KEY +
    "&ver=1.0";
  const url = dust_url + dust_payload;

  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
    return "fail";
  }
};
