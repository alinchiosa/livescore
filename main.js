const apiUrl = 'http://livescore-api.com/api-client';
const key = '6r94GgdPiJ5ciqdx';
const secret = '70Qx0KjZN2uD6jfdLohrFuhXem9wNm4U';
const aDay = 86400000; // ms

const buildUrl = (route, parameters = []) => {
    let url = apiUrl + route;

    const params = new URLSearchParams();
    params.set('key', key);
    params.set('secret', secret);
    parameters.forEach(paramObj => {
        params.set(paramObj.name, paramObj.value);
    });

    url += '?' + params.toString();
    return url;
};

let showLiveScores = () => {
    let x = document.getElementById('liveScores');
    let y = document.getElementById('liveScoresFromDenmark');
    let z = document.getElementById('tomorrowsFixtures');
    fctDisplay(x ,y, z);
    // const url = "http://livescore-api.com/api-client/scores/live.json?key=6r94GgdPiJ5ciqdx&secret=70Qx0KjZN2uD6jfdLohrFuhXem9wNm4U";
    getLiveScores(buildUrl('/scores/live.json'), 'liveScores');
}

let showLiveScoresFromDenmark = () => {
    let y = document.getElementById('liveScores');
    let x = document.getElementById('liveScoresFromDenmark');
    let z = document.getElementById('tomorrowsFixtures');
    fctDisplay(x ,y, z);
    // const url = "http://livescore-api.com/api-client/scores/live.json?key=6r94GgdPiJ5ciqdx&secret=70Qx0KjZN2uD6jfdLohrFuhXem9wNm4U"; 
    getLiveScores(buildUrl('/scores/live.json', [{name: 'country', value: 5}]), 'liveScoresFromDenmark');
}

let showTomorrowsFixtures = () => {
    let y = document.getElementById('liveScores');
    let z = document.getElementById('liveScoresFromDenmark');
    let x = document.getElementById('tomorrowsFixtures');
    fctDisplay(x ,y, z);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowString = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate();
    getFixtures(buildUrl('/fixtures/matches.json', [{name: 'date', value: tomorrowString}]), "tomorrowsFixtures");
    
}

let fctDisplay = (x, y, z) => {
    if(x.style.display === "none" && (y.style.display === "block" || z.style.display === "block")){
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "none";
    }else if (x.style.display === "none"){
        x.style.display = "block";
    }else{
        x.style.display = "none";
    }
}

let getLiveScores = (url, desiredPlace) => {
    fetch(url).then((response) => {
        return response.json();
    })
    .then((jsonResponse) => {
        console.log(jsonResponse);
        let counter = 0;
        let txt = "<div>";
        for(i in jsonResponse.data.match){
            if(jsonResponse.data.match[i].status !== "NOT STARTED" && jsonResponse.data.match[i].status !== "FINISHED" && 
            jsonResponse.data.match[i].status !=="HALF TIME BREAK" && jsonResponse.data.match[i].status !=="ADDED TIME" && jsonResponse.data.match[i].status !=="INSUFFICIENT DATA"){
                txt += "<div id ='league'>" + jsonResponse.data.match[i].league_name + "</div><p id='pMin'>"+
                        jsonResponse.data.match[i].time + "'</p><div id='dMatch'><p id='homeName'>" + jsonResponse.data.match[i].home_name + "</p><p id=score>" + 
                        jsonResponse.data.match[i].score + " </p><p id='awayName'>  " + jsonResponse.data.match[i].away_name + "</p></div>";
                counter++;
            }else if (jsonResponse.data.match[i].status === "FINISHED" || jsonResponse.data.match[i].status === "HALF TIME BREAK" || jsonResponse.data.match[i].status !=="ADDED TIME"){
                txt += "<div id ='league'>" + jsonResponse.data.match[i].league_name + "</div><p id='pMin'>"+
                        jsonResponse.data.match[i].time + "</p><div id='dMatch'><p id='homeName'>" + jsonResponse.data.match[i].home_name + "</p><p id=score>" + 
                        jsonResponse.data.match[i].score + " </p><p id='awayName'>  " + jsonResponse.data.match[i].away_name + "</p></div>";
                        counter ++;
                    
            }else if (jsonResponse.data.match[i].status === "NOT STARTED"){
                txt += "<div id ='league'>" + jsonResponse.data.match[i].league_name + "</div><p id='pMin'>"+
                        jsonResponse.data.match[i].time + "</p><div id='dMatch'><p id='homeName'>" + jsonResponse.data.match[i].home_name + "</p><p id=score> - " + 
                         " </p><p id='awayName'>  " + jsonResponse.data.match[i].away_name + "</p></div>";    
                         counter++;
            }              
        }
        if (counter == 0 || jsonResponse.data.match.length == 0){
            txt += "<div id='noEvents'><p> There are no events right now!</p></div>";
        }
        txt += "</div><br>";
        document.getElementById(desiredPlace).innerHTML = txt;
    });    
}

let getFixtures = (url) => {
    fetch(url).then((response) => {
        return response.json();
    })
    .then((jsonResponse) => {
        console.log(jsonResponse);
        let counter = 0;
        let txt = "<div>";
        for (i in jsonResponse.data.fixtures){
            txt += "<p id='pMin'>"+jsonResponse.data.fixtures[i].time.substring(0, 5) + "</p><div id='dMatch'><p id='homeName'>" + 
            jsonResponse.data.fixtures[i].home_name + "</p><p id=score> - "+" </p><p id='awayName'>  " + jsonResponse.data.fixtures[i].away_name + "</p></div>"; 
            counter++;    
        }
        if (counter == 0 || jsonResponse.data.fixtures.length == 0){
            txt += "<div id='noEvents'><p> There are no events right now!</p></div>";
        }
        txt += "</div><br>";
        document.getElementById('tomorrowsFixtures').innerHTML = txt;
    })    
}

let refresh = () => {
    const url = "http://livescore-api.com/api-client/scores/live.json?key=6r94GgdPiJ5ciqdx&secret=70Qx0KjZN2uD6jfdLohrFuhXem9wNm4U";
    if(document.getElementById('liveScores').style.display==="block"){
        getLiveScores(url, "liveScores");
    }else if(document.getElementById("liveScoresFromDenmark").style.display==="block"){
        getLiveScores(buildUrl('/scores/live.json', [{name: 'country', value: 5}]), 'liveScoresFromDenmark');
    }
}

window.setInterval(refresh, 30000);