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

// modal container
const modal = document.getElementById('modal');
// add bookmark h1
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

/*
  instead of doing let bookmarks = [];
  we could do let bookmarks = {}; where bookmarks is now an object not an array

  the benefit of this will be seen in the delete method where instead of looping through the entire array and checking against each url, and then splcing that item out

  instead of an array we'd have a format of:
  bookmarks[id] = {
    name: '',
    url: '',
  }

  each bookmark has an id

  we could simply do:
  if(bookmarks[id]) {
    delete.bookmarks[id];
  }

  improved performance as we don't have to loop through what could be 100's of values

  also in the build method we would have to loop so would look like this:
  Object.keys(bookmarks).forEach((id) => {
    same code in here
  });
*/

// show modal, focus on input to rapidly enter more bookmarks
function showModal() {
  // show-modal class is used to trigger the modal
  modal.classList.add('show-modal');
  // this makes it so our cursor is on the first line
  websiteNameEl.focus();
}

// modal event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
});
// dismiss modal by clicking anywhere outside of it
window.addEventListener('click', (event) => {
  console.log(event);
  // interested in the target
  console.log(event.target);

  // if event.target === <div class="modal-container " id="modal">
  event.target === modal ? modal.classList.remove('show-modal') : false;
});

// Validate form, check that url is in correct format i.e. has https or http, check no spaces, etc.
function validate(name, url) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!name || !url) {
    alert('Please enter values for both fields');
    return false;
  } else if (!url.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }

  // valid
  return true;
}

// create bookmarks DOM
function buildBookmarks() {
  // remove all bookmarks to avoid duplicaiton
  bookmarksContainer.textContent = '';
  // build items
  bookmarks.forEach((bookmark) => {
    // destructuring object, effectively the same as doing const name = bookmark.name ...
    const { name, url } = bookmark;
    console.log(name, url);

    // item div
    const item = document.createElement('div');
    item.classList.add('item');

    // close icon - font awesome icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

    // favicon / link container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    // favicon
    const favicon = document.createElement('img');
    // dynamically pull favicon from website
    favicon.setAttribute(
      'src',
      `https://www.google.com/s2/u/0/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');

    // link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    // use append to append multiple values otherwise use appendChild

    // build from the inside out, i.e. the most nested to least

    // append to bookmarks container
    linkInfo.append(favicon, link);

    // item append
    item.append(closeIcon, linkInfo);

    // bookmarksContainer append
    bookmarksContainer.appendChild(item);
  });
}

// fetch bookmarks from local storage
function fetchBookmarks() {
  // get bookmarks from local storage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// delete bookmark
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, index) => {
    if (bookmark.url === url) {
      // pass index and the number of objects we want to remove
      bookmarks.splice(index, 1);
    }
  });

  // update bookmarks array in local storage, repopulate the DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

// handle data from form
function storeBookmark(event) {
  // stop from trying to submit form data and refreshing
  event.preventDefault();
  console.log(event);

  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  // if it doesn't include either
  if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
    urlValue = `https://${urlValue}`;
  }

  console.log('Name:', nameValue);
  console.log('URL:', urlValue);

  // validate action takes place, only need to do something if its false
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  // create a bookmark object
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  console.log('Bookmarks', bookmarks);

  // save to local storage, convert into JSON string
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  fetchBookmarks();

  bookmarkForm.reset();
  // focus on name element, make cursor start in name field
  websiteNameEl.focus();
}

// event listener
bookmarkForm.addEventListener('submit', storeBookmark);

// on load
fetchBookmarks();