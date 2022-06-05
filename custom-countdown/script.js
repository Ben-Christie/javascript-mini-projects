//in the window we have a console which we can use to log data that we can see from our javascript in our browser, helpful for seeing how data is formatted, etc.
//console.log()

//setup project on github
/*
  1. create new repo on github
  2. copy https from the "quick setup" section - should look like a url
  3. open terminal from vs code (input following commands)
    a. git init (to initialise empty repo)
    b. git remote add origin (paste copied https)
    c. git add .
    d. git commit -m 'initial commit'
    e. git push origin master
*/

//push change to repo
/*
  1. open terminal again
  2. type commands
    a. git add .
    b. git commit -m 'commit message'
    c. git push origin master
*/

//hosting on github
/*
  1. From the repo on github go to settings
  2. Scroll down to Github Pages
  3. Switch source from none to master branch
  4. a https should be provided and the website is now live (takes around 10 mins to setup initally so if no load don't worry)
*/

// cloning and pushing to repo
/* 
  1. In the terminal type git clone https://the-url-from-github.com to clone a repo
  2. to push changes first go into the new directory that was created from the cloning: cd directoryName/
  3. ls to look at all our files
  4. git status tells us what files have not been commited
  5. git add fileName (index.html, etc.)
  6.do git status again
  7. git commit -m 'commit message'
  8. git push
*/

// check branches
// git branch

// create branch
// git branch branchName

// switch to branch
// git checkout branchName

// pull update
// git pull

// merge master into branch
// git merge master

// When working with dates keep in mind that the ISO format uses UTC and therefore different time-zones will requires additions or subtractions made to them, this is not featured in this project but something to keep in mind

const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
// return anything on the page that is a span and store in array
const timeElements = document.querySelectorAll('span');

// create variables for title and date
let countdownTitle = '';
let countdownDate = '';

// countdown value, this will hold the date selected
let countdownValue = new Date();

let countdownActive;

// object for saving in local storage
let savedCountdown;

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// times written in milliseconds e.g. 1 second = 1000 milliseconds
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input minimum with todays date
// ISO is the standard form of date for programming, goes from largest unit (year) to smallest (ms)
// split on T as there is a T before the time i.e. it'll split our ISO date/time, we use 0 index cause we want the date only
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate countdown / complete UI
function updateDom() {
  // setInterval executes the function continuously
  countdownActive = setInterval(() => {
    // get current moment in time
    const now = new Date().getTime();
    // gap between then and now
    const distance = countdownValue - now;
    console.log('distance from then to now is', distance);

    // Math.floor returns largest whole number less than the val e.g. if val = 7.6 will return 7
    const days = Math.floor(distance / day);
    // get remainder and divide
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    console.log(days, hours, minutes, seconds);

    // hide input container
    inputContainer.hidden = true;

    // if countdown has ended show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // else show countdown in progress
      // populate html time elements
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;

      // hide complete element
      completeEl.hidden = true;

      // show countdown
      countdownEl.hidden = false;
    }
    // the second value says to execute every second
  }, second);
}

// take values from form
function updateCountdown(event) {
  // stop from trying to submit a form to a db and refreshing the page
  event.preventDefault();

  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  // have to pass as a string
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  console.log(event);
  console.log('Countdown Title:', countdownTitle);
  console.log('Countdown Date:', countdownDate);

  if (countdownTitle != '' && countdownDate != '') {
    // get number version of current date, update DOM
    // getTime will get how far away the selected date is from 1/1/1970 in milliseconds
    countdownValue = new Date(countdownDate).getTime();
    console.log('Time from 1/1/1970 in milliseconds:', countdownValue);

    updateDom();
  } else {
    alert('Please fill in title and date');
  }
}

// reset all value
function reset() {
  // hide countdowns, show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // stop the countdown
  clearInterval(countdownActive);
  // reset values
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
}

// function to restore from local storage
function restorePreviousCountdown() {
  // get countdown from local storage if there is one
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    // parse back to json object
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;

    countdownValue = new Date(countdownDate).getTime();
    updateDom();
  }
}

// event listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on load, check local storage
restorePreviousCountdown();
