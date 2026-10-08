"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Mattias Åfeldt
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");


// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];

/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {
    // Kontrollera formulärets obligatoriska fält
    errors = [];
    if (fullnameInput.value.trim() === "") {
        errors.push("Fyll i ditt namn.");
    }
    if (emailInput.value.trim() === "") {
        errors.push("Fyll i din e-postadress.");
    }
    if (phoneInput.value.trim() === "") {
        errors.push("Fyll i ditt telefonnummer.");
    }

    // Visa eventuella felmeddelanden
    displayErrors();
    // Returnera resultatet (true eller false) av valideringen
    return errors.length === 0;
}


/**
 * Visar felmeddelanden på sidan.
 */
function displayErrors() {
    // Rensa tidigare felmeddelanden
    errorList.replaceChildren();

    // Skriv ut aktuella felmeddelanden till DOM
    errors.forEach(function (message) {
        let li = document.createElement("li");
        li.textContent = message;
        errorList.appendChild(li);
    });
}


/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {
    // Hämta information från formuläret
    let fullname = fullnameInput.value.trim();
    let email = emailInput.value.trim();
    let phone = phoneInput.value.trim();
    let font = fontSelect.value;

    // Uppdatera studentkortet
    previewFullname.textContent = fullname;
    previewEmail.textContent = email;
    previewPhone.textContent = phone;
    previewFullname.style.fontFamily = font;
    previewEmail.style.fontFamily = font;
    previewPhone.style.fontFamily = font;

    // Lägg till studentkortet i historiken
    const studentCard = {
        fullname: fullname,
        email: email,
        phone: phone,
        font: font
    };

    // Spara och uppdatera historiken
    history.push(studentCard);
    saveHistory();
    renderHistory();
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory() {
    // Spara history i localStorage
    localStorage.setItem("studentHistory", JSON.stringify(history));
}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    // Hämta eventuell sparad historik
    let saveHistory = localStorage.getItem("studentHistory");

    // Uppdatera history
    if (saveHistory) {
        history = JSON.parse(saveHistory);
    }
    renderHistory();
}


/**
 * Visar historiken på sidan.
 */
function renderHistory() {
    // Rensa tidigare visad historik
    historySection.replaceChildren();

    // Skriv ut innehållet i history till DOM
    history.forEach(function (studentCard) {
        let cardDiv = document.createElement("div");
        let nameP = document.createElement("p");
        nameP.textContent = studentCard.fullname;
        let emailP = document.createElement("p");
        emailP.textContent = studentCard.email;
        let phoneP = document.createElement("p");
        phoneP.textContent = studentCard.phone;

        cardDiv.style.fontFamily = studentCard.font;
        cardDiv.appendChild(nameP);
        cardDiv.appendChild(emailP);
        cardDiv.appendChild(phoneP);
        historySection.appendChild(cardDiv);
    });
}


/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {
    // Återställ formulär och studentkort
    form.reset();
    previewFullname.textContent = "";
    previewEmail.textContent = "";
    previewPhone.textContent = "";
    previewFullname.style.fontFamily = "";
    previewEmail.style.fontFamily = "";
    previewPhone.style.fontFamily = "";

    // Rensa eventuella felmeddelanden
    errorList.replaceChildren();
}


/**
 * Raderar hela historiken.
 */
function deleteHistory() {
    // Radera sparad historik
    localStorage.removeItem("studentHistory");

    // Uppdatera history och visningen på sidan
    history = [];
    renderHistory();
}


// Eventlyssnare

// När formuläret skickas:
// - validera inmatningen
// - skapa studentkort om valideringen lyckas
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    createStudentCard();
});


// När användaren klickar på "Rensa"
clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    clearForm();
});

// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", function (event) {
    event.preventDefault();
    deleteHistory();
});

// När sidan laddas:
// - läs in och visa eventuell tidigare historik
loadHistory();