const API_KEY = "XhFSfYgaP9EhpQ0Gnc0G4m1T9N1vOEGUwxA99%2BZa%2Bvgfv8W8noI75dshtF25Jbwt6MVy1rBMk%2FG2ixt4XdnNtw%3D%3D";

function onGeoOk(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log("You live in ", lat, lon);
    const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=종로구&dataTerm=month&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}`;
    fetch(url)
    .then(res => res.json())
    .then(data =>{
        document.querySelector("#꽃가루지수").innerText = data.response.body.totalCount;
    });
}
function onGeoError(){
    alert("위치 정보를 허용하지 않으면 서울 정보가 표시됩니다.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
