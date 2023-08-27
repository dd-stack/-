export const getVilageWeather = async (base_date, base_time, X, Y) => {
  const vilage_weather_url =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?";
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
  const url = vilage_weather_url + vilage_weather_payload;

  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
    return "fail";
  }
};
