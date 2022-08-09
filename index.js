function showMessage(message) {
    //show div that has id message
    document.getElementById(message).classList.add('show');
    document.getElementById('resluts_bg').classList.add('show');
    /*hide after 2 seconds*/
    setTimeout(function () {
        document.getElementById(message).classList.remove('show');
        document.getElementById('resluts_bg').classList.remove('show');
    }, 2000);
}
function timer (time) {
    //create counter lasting time
    var counter = time;
    var interval = setInterval(function () {
        counter--;
        //set #time-line width
        document.getElementById('time-line').style.width = counter * 100/time + '%';
        if (counter <= 0) {
            clearInterval(interval);
            showMessage('timeout');
        }
    }, 1000);
    
    
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const file = urlParams.get('f')
/*save levels to local*/ 
var xhttp = new XMLHttpRequest();
xhttp.open("GET", file, 0);
xhttp.send();
var game = JSON.parse(xhttp.responseText);
//when usin jsonbin.io
var game = game.record;
//format available in levels.json
var options = game.options;

//place categories inside div
for (var i in game.categories) {
    var category = document.createElement('div');
    category.classList.add('category');
    category.innerHTML = game.categories[i];
    document.getElementById('categories').appendChild(category);
}
var seen =[];

function random(){
    //choose random category from game.categories
    var category = options.categories[Math.floor(Math.random() * options.categories.length)];
    var category_id = Math.floor(Math.random() * options.categories.length);
    //json elemets that have certain propetry
    var elements = game.questions.filter(function (elem) {
        return elem.category == category_id;
    });
        
    var chosen = Math.floor(Math.random() * game.questions.length);
    while (chosen in seen) {
        chosen = Math.floor(Math.random() * game.questions.length);
    }
    seen.push(chosen);

    //place question in div
    document.getElementById('title').innerHTML = elements[chosen].title;
    //randomize answers
    var answers = elements[chosen].incorrectas;
    answers.push(elements[chosen].correcta);
    answers.sort(function () {
        return 0.5 - Math.random();
    });
    //place answers in div
    var x = 1;
    for (var i in answers) {
        document.getElementById('option'+x).innerHTML = answers[i];
        x++;

    }
    document.getElementById('category').innerHTML = category;

    console.log(answers);
}