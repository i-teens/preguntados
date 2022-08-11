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



class Timer{
    interval = "";
    start(time = options.timeout){
        var counter = time;
        this.interval = setInterval(function () {
            counter--;
            //set #time-line width
            document.getElementById('time-line').style.width = counter * 100/time + '%';
            if (counter <= 0) {
                clearInterval(this.interval);
                document.getElementById('time-line').style.width = '100%';
                showMessage('timeout');
                teams.next();
            }
        }, 1000);
    }
    stop(){
        clearInterval(this.interval);
        document.getElementById('time-line').style.width = '100%';
    }
}
timer = new Timer();




//place categories inside div
for (var i in game.categories) {
    var category = document.createElement('div');
    category.classList.add('category');
    category.innerHTML = game.categories[i];
    document.getElementById('categories').appendChild(category);
}
var seen =[];

class Question{
    seen = [];
    question = "";
    answers = "";
    correct = "";
    category = "";
    constructor(questions) {
        this.options = document.getElementsByClassName('option');
        this.questions = questions;
        this. categories = options.categories;
        if(options.allow_choose_category == true){
            //add random category to categories
            this.categories.push("Elegí Categoría");
        }
    }
    randomc(category){
        //select random question where category matches
        var q= this.questions.filter(function (question) {
            return question.category == category &&
                !seen.includes(question.title);
        });
        var random = Math.floor(Math.random() * q.length);
        seen.push(q[random].title);
        this.set(q[random].title,q[random].incorrectas,q[random].correcta,q[random].category);
        return q[random];
    }
    random(){
        //select random question
        var q= this.questions.filter(function (question) {
            return !seen.includes(question.title);
        });
        var random = Math.floor(Math.random() * q.length);
        seen.push(q[random].title);
        this.set(q[random].title,q[random].incorrectas,q[random].correcta,q[random].category);
        return q[random];
    }
    check(answer) {
        //give class to correct answer
        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].innerHTML == this.correct) {
                this.options[i].classList.add('right');
            }else{
                this.options[i].classList.add('wrong');
            }
        }

        if (answer == this.correct) {
            return true;
        } else {
            return false;
        }
    }
 
    set(question, answers, correct, category) {
        this.question = question;
        this.incorrectas = answers;
        this.correct = correct;
        this.category = category;
    }
    show() {
        //hide evertyhing with show class
        var show = document.getElementsByClassName('show');
        for (var i = 0; i < show.length; i++) {
            show[i].classList.remove('show');
        }
        //remove classes right/wrong from options
        for (var i = 0; i < this.options.length; i++) {
            this.options[i].classList.remove('right');
            this.options[i].classList.remove('wrong');
        }
        //show message and then start
        setInterval(showMessage(this.category), 2000);
        timer.start();


        var answers = this.incorrectas;
        answers.push(this.correct);
        //randomize answers
        answers.sort(function () {
            return 0.5 - Math.random();
        });
        for (var i = 0; i < this.options.length; i++) {
            this.options[i].innerHTML = answers[i];
            console.log(this.options[i]);
        }
        document.getElementById('q-title').innerHTML = this.question;
        document.getElementById('roulette').innerHTML = this.category;
    }
}
question = new Question(game.questions);

//option on click
for (var i = 0; i < question.options.length; i++) {
    question.options[i].onclick = function () {
        if (question.check(this.innerHTML)) {
            showMessage('correct');
            teams.score();
            crowns.add();
        } else {
            showMessage('incorrect');
            teams.next();
            crowns.show(0);
        }
        timer.stop();
    }
}


class Crowns{
    constructor(number){
        this.number = number;
    }
    show(number){
        this.number = number;
        var crowns = document.getElementsByClassName('crown_sec');
        for (var i = 0; i < crowns.length; i++) {
            crowns[i].classList.remove('win');
        }
        for (var i = 0; i < number; i++) {
            crowns[i].classList.add('win');
        }
    }
    add(){
        this.number++;
        this.show(this.number);
        if (this.number == 7){
            document.getElementById('abc').classList.add('show');
            this.show(0);
        }
    }
    remove(){
        this.number = 0;
        this.show(this.number);
    }
}
crowns = new Crowns(0);

class Teams {
    teams = document.getElementsByClassName('score');
    constructor() {
    this.actual = 0;
    this.total_teams = this.teams.length;
    }
    select(x) {
        for (var i = 0; i < this.teams.length; i++) {
            this.teams[i].classList.remove('turn');
        }
        this.teams[x].classList.add('turn');
    }
    next() {
        this.actual++;
        if (this.actual >= this.total_teams) {
            this.actual = 0;
        }
        this.select(this.actual);
    }
    random() {
        var teams = document.getElementsByClassName('score');
        var random = Math.floor(Math.random() * teams.length);
        for (var i = 0; i < this.teams.length; i++) {
            this.teams[i].classList.remove('turn');
        }
        this.teams[random].classList.add('turn');
        this.actual = random;
    }
    score(){
        var pts = document.getElementsByClassName('pts');
        //add one point to team
        pts[this.actual].innerHTML = parseInt(pts[this.actual].innerHTML) + 1;
    }
}
teams = new Teams();

function roulette(){
    //choose random category
    question.categories.sort(function () {
        return 0.5 - Math.random();
    });
    var category = question.categories[0];
    console.log(category);
    if(category == "Elegí Categoría"){
        document.getElementById('abc').classList.add('show');
    }else{
        question.randomc(category);
        question.show();
    }
    
}




//add event listener to click

cat_btns = document.getElementsByClassName('cat_option');
for (var i = 0; i < cat_btns.length; i++) {
    cat_btns[i].addEventListener('click', function () {
        question.randomc(this.getAttribute('data-cat'));
        console.log("CLICKED");
        question.show();
    }
    );
}



crowns.show(0);
teams.random();
