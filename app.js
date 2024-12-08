var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/form', (req, res) => {
    res.render('form');
});

function validateFormData(req, res, next) {
    const { firstName, email, birthDate } = req.body;
    const errors = [];

    if (!firstName || firstName.trim().length < 2) {
        errors.push("Imię musi zawierać co najmniej 2 znaki.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Podaj poprawny adres e-mail.");
    }

    if (!birthDate || isNaN(Date.parse(birthDate))) {
        errors.push("Podaj prawidłową datę urodzenia.");
    } else {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        if (birthDateObj > today) {
            errors.push("Data urodzenia nie może być w przyszłości.");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

app.get('/new-data', (req, res) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pl-PL', { hour12: false });

    const data = {
        randomNumber: Math.floor(Math.random() * 100),
        timestamp: formattedTime
    };

    res.json(data);
});


app.post('/submit', validateFormData, (req, res) => {
    const { firstName, email, birthDate } = req.body;

    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const nextBirthday = new Date(today.getFullYear(), birthDateObj.getMonth(), birthDateObj.getDate());

    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysToNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    res.json({ firstName, email, birthDate, daysToNextBirthday });
});

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Nie znaleziono strony.' });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).render('error', { message: 'Błąd aplikacji' });
});


module.exports = app;
