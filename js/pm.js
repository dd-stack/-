const API_KEY2 = "XhFSfYgaP9EhpQ0Gnc0G4m1T9N1vOEGUwxA99%2BZa%2Bvgfv8W8noI75dshtF25Jbwt6MVy1rBMk%2FG2ixt4XdnNtw%3D%3D";

const url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=종로구&dataTerm=DAILY&returnType=json&serviceKey=" + API_KEY2;
//종로구 기준
fetch(url)
.then(response => response.json())
.then(data =>{
    const pm = document.querySelector("#weather span:last-child");
    const 미세먼지 = data.response.body.items[0].pm10Grade;  // (좋음: 1, 보통: 2, 나쁨: 3, 매우나쁨: 4)
    let 미세먼지이모지 = '';
    if(미세먼지 > 2) {  //미세먼지 나쁨, 매우나쁨의 경우
        미세먼지이모지 = '😷';
    } 미세먼지이모지 = '😊';
    pm.innerText = 미세먼지이모지;
})
.catch(error => console.error(error));