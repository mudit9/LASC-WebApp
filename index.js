const express = require('express');
const app = express();
const firebase = require('firebase');
const bodyParser = require('body-parser');
const config = require('./public/js/config.js');
const path = require('path');
const later = require('later');

const port = process.env.PORT || 8080;

var user = null;

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

config.initialize();

app.get('/public/login', function(req, res) {
    var schedule = later.parse.recur().on(4).hour();
    later.date.localTime();
    var timer = later.setInterval(incrClass, schedule);
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/public/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/public/classes', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/map-google.html'));
});

app.listen(port, function() {
    console.log("Listening to port" + port);
});

function incrClass() {
    var date = new Date();
    firebase.database().ref('/subject/').once('value', function(snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val();
            if (date.getDay() == 1) {
                incrClassHeld('/subject/MED209/', data.MED209.ClassHeld + 1);
                incrClassHeld('/subject/CSD101/', data.CSD101.ClassHeld + 1);
                incrClassHeld('/subject/EED102/', data.EED102.ClassHeld + 1);
                incrClassHeld('/subject/EED205/', data.EED205.ClassHeld + 1);
            } else if (date.getDay() == 2) {
                incrClassHeld('/subject/CED101/', data.CED101.ClassHeld + 1);
                incrClassHeld('/subject/CSD201/', data.CSD201.ClassHeld + 1);
                incrClassHeld('/subject/MAT104/', data.MAT104.ClassHeld + 1);
                incrClassHeld('/subject/PHY102/', data.PHY102.ClassHeld + 1);
                incrClassHeld('/subject/CSD204/', data.CSD204.ClassHeld + 1);
            } else if (date.getDay() == 3) {
                console.log(1);
                incrClassHeld('/subject/MED209/', data.MED209.ClassHeld + 1);
                incrClassHeld('/subject/CSD101/', data.CSD101.ClassHeld + 1);
                incrClassHeld('/subject/EED102/', data.EED102.ClassHeld + 1);
                incrClassHeld('/subject/EED208/', data.EED208.ClassHeld + 1);
                incrClassHeld('/subject/EED204/', data.EED204.ClassHeld + 1);
            } else if (date.getDay() == 4) {
                incrClassHeld('/subject/CED101/', data.CED101.ClassHeld + 1);
                incrClassHeld('/subject/CSD201/', data.CSD201.ClassHeld + 1);
                incrClassHeld('/subject/MAT104/', data.MAT104.ClassHeld + 1);
                incrClassHeld('/subject/PHY102/', data.PHY102.ClassHeld + 1);
                incrClassHeld('/subject/EED205/', data.EED205.ClassHeld + 1);
            } else if (date.getDay() == 5) {
                incrClassHeld('/subject/EED208/', data.EED208.ClassHeld + 1);
                incrClassHeld('/subject/EED204/', data.EED204.ClassHeld + 1);
                incrClassHeld('/subject/CSD204/', data.CSD204.ClassHeld + 1);
            }
        }
    });
}

function incrClassHeld(classURL, classHeld) {
    var flag = checkTimeStamp(classURL);
    if (flag == 1) {
        var curDate = new Date();
        firebase.database().ref(classURL).set({
            ClassHeld: classHeld,
            TimeStamp: curDate.toString()
        });
    }
}

function checkTimeStamp(classURL) {
    var curDate = new Date();
    var data = firebase.database().ref(classURL).once('value', function(snapshot) {
        if (snapshot.exists()) {
            var subjectData = snapshot.val();
            var timeStampString = subjectData.TimeStamp;
            var timeStamp = new Date(timeStampString);
            if (timeStamp.getFullYear() == curDate.getFullYear() && timeStamp.getMonth() == curDate.getMonth() && timeStamp.getDay() == curDate.getDay()) {
                return 0;
            } else {
                return 1;
            }
        }
    });
}