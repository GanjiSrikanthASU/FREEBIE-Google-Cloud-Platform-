/**
 * An object containing information about a location,
 * whether an entire college, building, or street.
 * @typedef {Object} LocationInfo
 * @property {string} name - The name of the location.
 * @property {number} lat - The latitude of the location.
 * @property {number} long - The longitude of the location.
 * @property {string} city - The city the location is in.
 */

/**
 * An object containing information about a post.
 * @typedef {Object} PostInfo
 * @property {number} id - The unique id of the post.
 * @property {string} organizationName - The name of the organization making the post.
 * @property {Date} postDateTime - The date that the post was made.
 * @property {Date} eventStartTime - The starting time of the event described in the post.
 * @property {Date} eventEndTime - The ending time of the event described in the post.
 * @property {LocationInfo} location - The location of the event.
 * @property {number} numOfPeopleFoodWillFeed - The number of people the event's food can feed.
 * @property {string} foodType - A short 1-3 word description of the type of food served.
 * @property {string} description - A longer description of the entire event.
 */

/**
 * An object containing filters by which to narrow posts down.
 * @typedef {Object} Filter
 * @property {number} numPeople - The minimum number of people the event can feed.
 * @property {boolean} happeningNow - Whether the event is happening right now.
 * @property {number} distance - The maximum distance from the user to the event.
 * @property {Array<string>} keywords - Keywords to include.
 */

//
// Global objects
//

/** @type {LocationInfo} */
let collegeLocations = 
  [{"UNITID":177834,"NAME":"A T Still University of Health Sciences","CITY":"Kirksville","LAT":40.193648,"LON":-92.589183},
  {"UNITID":491464,"NAME":"ABC Adult School","CITY":"Cerritos","LAT":33.878179,"LON":-118.070114},
  {"UNITID":49146401,"NAME":"ABC Adult School - Cabrillo Lane","CITY":"Cerritos","LAT":33.84724,"LON":-118.078943},
  {"UNITID":459523,"NAME":"ABC Beauty Academy","CITY":"Richardson","LAT":32.931698,"LON":-96.685333},
  {"UNITID":485500,"NAME":"ABCO Technology","CITY":"Inglewood","LAT":33.932121,"LON":-118.369774},
  {"UNITID":134811,"NAME":"AI Miami International University of Art and Design","CITY":"Miami","LAT":25.790008,"LON":-80.18839},
  {"UNITID":486415,"NAME":"AMG School of Licensed Practical Nursing","CITY":"Brooklyn","LAT":40.692794,"LON":-73.982035},
  {"UNITID":429094,"NAME":"AOMA Graduate School of Integrative Medicine","CITY":"Austin","LAT":30.228551,"LON":-97.800643},
  {"UNITID":404994,"NAME":"ASA College","CITY":"Brooklyn","LAT":40.691464,"LON":-73.986076},
  {"UNITID":475431,"NAME":"ASI Career Institute","CITY":"Turnersville","LAT":39.756604,"LON":-75.045442}];
  

/** @type {Array<PostInfo>} */
let posts = null;

/** @type {google.maps.Map} */
let map;

/** @type {string} */
let cachedModalAddress = '';

/** @type {GeolocationPosition} */
let userLocation = null;

/** @type {Array<google.maps.Marker>} */
let markers = [];

/** @type {boolean} */
let userHasDismissedDateTipBefore = false;

//
// Elements
//

/** @type {HTMLElement} */
let modalCard;

/** @type {HTMLElement} */
let modalSubmitted;

/** @type {HTMLElement} */
let modalSubmittedTitle;

/** @type {HTMLElement} */
let createPostButton;

/** @type {HTMLElement} */
let createPostEventButton;

/** @type {HTMLElement} */
let modal;

/** @type {HTMLElement} */
let modalEvent;

/** @type {HTMLElement} */
let closeModalButton;

/** @type {HTMLElement} */
let submitModalButton;

/** @type {HTMLElement} */
let modalForm;

/** @type {HTMLButtonElement} */
let toggleLegendButton;

/** @type {HTMLButtonElement} */
let toggleFiltersButton;

/** @type {HTMLElement} */
let modalFileUpload;

/** @type {HTMLElement} */
let modalUploadLabel;

/** @type {HTMLElement} */
let modalButtonDiv;

/** @type {HTMLElement} */
let modalMonth;

/** @type {HTMLElement} */
let modalDay;

//
// Constants
//

// Map marker size limits.
const MARKER_WIDTH_MINMAX = {min: 28, max: 70};
const MARKER_HEIGHT_MINMAX = {min: 45, max: 113};

// Filter defaults.
const NUM_PEOPLE_FILTER_DEFAULT = 0;
const HAPPENING_NOW_FILTER_DEFAULT = false;
const DISTANCE_FILTER_DEFAULT = 3;
const KEYWORDS_FILTER_DEFAULT = [];

// Conversion constant for degrees lat to miles.
const MILES_PER_DEGREE_LAT = 69.172;

//
// Event listener registration
//

// Hooks the onLoad function to the DOMContentLoaded event.
document.addEventListener('DOMContentLoaded', onLoad);

document.addEventListener('keyup', onKeyUp);

//
// Functions
//

/**
 * Fires as soon as the DOM is loaded.
 */
async function onLoad() {
  // Show a spinning loading icon to user on map.
 
  console.log("in event post js");

  // Get the elements from the DOM after they have loaded.
  
  
  modalEvent = document.getElementById('modal-event-background');
  closeModalEventButton = document.getElementById('modal-event-close');
  submitModalEventButton = document.getElementById('modal-event-submit');
  modalEventForm = document.getElementById('modal-event-form');
  toggleLegendButton = document.getElementById('toggle-legend-button');
  modalCard = document.getElementById('modal-create-post');
  modalButtonDiv = document.getElementById('button-holder');
  modalSubmittedTitle = document.getElementById('modal-submitted-title');

  modalMonth = document.getElementById('modal-month');
  modalDay = document.getElementById('modal-day');
  const modalOrganizationName = document.getElementById('modal-org-name');
  const modalLocation = document.getElementById('modal-location');
  const modalTypeFood = document.getElementById('modal-type-food');
  const modalDescription = document.getElementById('modal-description');

  closeModalEventButton.addEventListener('click', closeModalEvent);

}

function goToFoodPost(){
  location.href = "./foodPost.html"
}

function goToEventPost(){
  location.href = "./EventPost.html"
}

function goBack() {
  window.history.back();
  console.log("I am in goBack");
}

/**
 * Handles keyup events on the general page.
 * @param {any} event - The keydown event.
 */
function onKeyUp(event) {
  // If the key is a tab, consider the user a keyboard user.
  // This allows us to separate "active" classes due to keyboard navigation from
  // "active" classes due to simply clicking on something.
  if (event.keyCode == 9) {
    document.body.classList.add('keyboard-active');
  }
}


/**
 * Shows the modal.
 * @return {void}
 */
function showModal() {
  if (modal) {
    // Populate post modal datetime slots with 'smart' values
    populatePostModalDateTime();
    modal.style.display = 'block';
    modalCard.focus();
    submitModalButton.disabled = false;
  }
}

function showModalEvent() {
  if (modalEvent) {
    // Populate post modal datetime slots with 'smart' values
    modalEvent.style.display = 'block';
    modalCard.focus();
    submitModalEventButton.disabled = false;
  }
}

/**
 * Closes and resets the modal, refocuses to create post button.
 * @return {void}
 */
 function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      modalForm.reset();
      resetMarks(modalForm.elements);
      createPostButton.focus();
      goBack()
    }
  }

function closeModalEvent() {
  if (modalEvent) {
    modalEvent.style.display = 'none';
    modalEventForm.reset();
    resetMarks(modalEventForm.elements);
    location.href="../employeepage"  }
}

/**
 * Updates the text of the upload button to the uploaded file's name.
 * @return {void}
 */


/**
 * On click of the submit button, sends modal data to the servlet.
 * @return {void}
 */
async function submitModal() {
  // Disable multiple submissions.
  submitModalButton.disabled = true;
  if (validateModal()) {
  } else {
    submitModalButton.disabled = false;
    const errorMessage = document.getElementById('modal-input-error');
    if (errorMessage) {
      errorMessage.focus();
    }
  }
}

async function submitModalEvent() {
  // Disable multiple submissions.
  submitModalEventButton.disabled = true;
  if (validateModalEvent()) {
  } else {
    submitModalEventButton.disabled = false;
    const errorMessage = document.getElementById('modal-input-error');
    if (errorMessage) {
      errorMessage.focus();
    }
  }
}

/**
 * Goes through the form elements and marks the invalid inputs.
 * Returns whether all the inputs are valid.
 * @return {boolean}
 */
function validateModal() {
  const invalidIds = [];
  const errorMessages = [];
  const formElements = modalForm.elements;

  disableInjection(formElements);
  validateModalText(invalidIds, errorMessages, formElements);
  validateModalDate(invalidIds, errorMessages, formElements);
  validateModalTime(invalidIds, errorMessages, formElements);
  validateModalNumber(invalidIds, errorMessages, formElements);
  markInvalidInputs(invalidIds, errorMessages, formElements);

  return (invalidIds.length === 0);
}

function validateModalEvent() {
  const invalidIds = [];
  const errorMessages = [];
  const formElements = modalEventForm.elements;
  
  disableInjection(formElements);
  validateModalEventText(invalidIds, errorMessages, formElements);
  validateModalEventDate(invalidIds, errorMessages, formElements);
  validateModalEventTime(invalidIds, errorMessages, formElements);
  markInvalidInputsEvent(invalidIds, errorMessages, formElements);

  return (invalidIds.length === 0);
}

/**
 * Goes through the elements and encodes common HTML enities.
 * By using these codes, ensures that the user's inputs are seen as data, not code.
 * This is a measure against a malicious users trying to changing site data.
 * @param {array} formElements
 * @return {void}
 */
function disableInjection(formElements) {
  for (let i = 0; i < formElements.length - 1; i++) {
    let elementValue = formElements[i].value;
    elementValue = elementValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    elementValue = elementValue.replace(/&/g, '&amp;');
    elementValue = elementValue.replace(/"/g, '&quot;');
    elementValue = elementValue.replace(/'/g, '&#x27;');
  }
}

/**
 * Resets all the input backgrounds to modal grey and gets rid of previous error text.
 * @param {array} formElements
 * @return {void}
 */
function resetMarks(formElements) {
  for (let i = 0; i < formElements.length - 1; i++) {
    const element = formElements[i];
    element.style.background = '#1b18181a';
  }
  const modalError = document.getElementById('modal-input-error');
  const modalEventError = document.getElementById('modal-event-input-error');
  if (modalError) {
    modalButtonDiv.removeChild(modalError);
  }
  if (modalEventError) {
    modalButtonDiv.removeChild(modalEventError);
  }
}

/**
 * Goes through the invalid inputs and colors them red.
 * Adds error messages.
 * @param {array} invalidIds
 * @param {array} errorMessages
 * @param {array} formElements
 * @return {void}
 */
function markInvalidInputs(invalidIds, errorMessages, formElements) {
  resetMarks(formElements);
  invalidIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.backgroundColor = '#ff999966';
    }
  });
  if (errorMessages.length > 0) {
    const modalError = document.createElement('div');
    modalError.setAttribute('id', 'modal-input-error');
    modalError.setAttribute('tabindex', '0');
    let errorHTMLString = '<ul>';
    errorMessages.forEach((message) => {
      errorHTMLString += '<li>' + message + '</li>';
    });
    errorHTMLString += '</ul>';
    modalError.innerHTML = errorHTMLString;
    modalButtonDiv.insertBefore(modalError, submitModalEventButton);
  }
}

function markInvalidInputsEvent(invalidIds, errorMessages, formElements) {
  resetMarks(formElements);
  invalidIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.backgroundColor = '#ff999966';
    }
  });
  if (errorMessages.length > 0) {
    const modalError = document.createElement('div');
    modalError.setAttribute('id', 'modal-event-input-error');
    modalError.setAttribute('tabindex', '0');
    let errorHTMLString = '<ul>';
    errorMessages.forEach((message) => {
      errorHTMLString += '<li>' + message + '</li>';
    });
    errorHTMLString += '</ul>';
    modalError.innerHTML = errorHTMLString;
    modalButtonDiv.insertBefore(modalError, submitModalEventButton);
  }
}

/**
 * Adds an error message if the file is larger than 4MB or is not an image.
 * @param {array} invalidIds
 * @param {array} errorMessages
 * @return {void}
 */

/**
 * Checks if the month and day are a valid date.
 * @param {array} invalidIds
 * @param {array} errorMessages
 * @param {array} formElements
 * @return {void}
 */
function validateModalDate(invalidIds, errorMessages, formElements) {
  const month = formElements.namedItem('modal-month').value;
  const day = formElements.namedItem('modal-day').value;
  const monthDayLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month > 12 || month < 1) {
    invalidIds.push('modal-month');
    errorMessages.push('month must be between 1 and 12');
  }
  if (day < 1 || day > monthDayLengths[month - 1] || isBlank(day)) {
    invalidIds.push('modal-day');
    errorMessages.push('invalid date');
  }
}

function validateModalEventDate(invalidIds, errorMessages, formElements) {
  const month = formElements.namedItem('modal-event-month').value;
  const day = formElements.namedItem('modal-event-day').value;
  const monthDayLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month > 12 || month < 1) {
    invalidIds.push('modal-event-month');
    errorMessages.push('month must be between 1 and 12');
  }
  if (day < 1 || day > monthDayLengths[month - 1] || isBlank(day)) {
    invalidIds.push('modal-event-day');
    errorMessages.push('invalid date');
  }
}

/**
 * Checks if the start and end time are valid.
 * @param {array} invalidIds
 * @param {array} errorMessages
 * @param {array} formElements
 * @return {void}
 */
function validateModalTime(invalidIds, errorMessages, formElements) {
  const startHour = parseInt(formElements.namedItem('modal-start-hour').value, 10);
  const startMinute = parseInt(formElements.namedItem('modal-start-minute').value, 10);
  const startAMorPM = formElements.namedItem('start-am-or-pm').value;
  const endHour = parseInt(formElements.namedItem('modal-end-hour').value, 10);
  const endMinute = parseInt(formElements.namedItem('modal-end-minute').value, 10);
  const endAMorPM = formElements.namedItem('end-am-or-pm').value;
  let timesValid = true;

  // Check if the hours fall between 1-12.
  if (isNaN(startHour) || startHour < 1 || startHour > 12) {
    invalidIds.push('modal-start-hour');
    errorMessages.push('start hour must be between 1 - 12');
    timesValid = false;
  }
  if (isNaN(endHour) || endHour < 1 || endHour > 12) {
    invalidIds.push('modal-end-hour');
    errorMessages.push('end hour must be between 1 - 12');
    timesValid = false;
  }
  // Check if the minutes fall between 0 - 60.
  if (isNaN(startMinute) || startMinute < 0 || startMinute >= 60) {
    invalidIds.push('modal-start-minute');
    errorMessages.push('start minute must be between 00 - 59');
    timesValid = false;
  }
  if (isNaN(endMinute) || endMinute < 0 || endMinute >= 60) {
    invalidIds.push('modal-end-minute');
    errorMessages.push('end minute must be between 00 - 59');
    timesValid = false;
  }
  // Calculate start and end time in minutes.
  if (timesValid) {
    let startTime = ((startHour % 12) * 60) + startMinute;
    if (startAMorPM === 'pm') {
      startTime += 12 * 60;
    }
    let endTime = ((endHour % 12) * 60) + endMinute;
    if (endAMorPM === 'pm') {
      endTime += 12 * 60;
    }
    // Ensure that start time is before end time.
    if (startTime > endTime) {
      invalidIds.push('modal-start-hour');
      invalidIds.push('modal-start-minute');
      invalidIds.push('start-am-or-pm');
      invalidIds.push('modal-end-hour');
      invalidIds.push('modal-end-minute');
      invalidIds.push('end-am-or-pm');
      errorMessages.push('end time must be after start time');
    }
  }
}

function validateModalEventTime(invalidIds, errorMessages, formElements) {
  const startHour = parseInt(formElements.namedItem('modal-event-start-hour').value, 10);
  const startMinute = parseInt(formElements.namedItem('modal-event-start-minute').value, 10);
  const startAMorPM = formElements.namedItem('start-event-am-or-pm').value;
  const endHour = parseInt(formElements.namedItem('modal-event-end-hour').value, 10);
  const endMinute = parseInt(formElements.namedItem('modal-event-end-minute').value, 10);
  const endAMorPM = formElements.namedItem('end-event-am-or-pm').value;
  let timesValid = true;

  // Check if the hours fall between 1-12.
  if (isNaN(startHour) || startHour < 1 || startHour > 12) {
    invalidIds.push('modal-event-start-hour');
    errorMessages.push('start hour must be between 1 - 12');
    timesValid = false;
  }
  if (isNaN(endHour) || endHour < 1 || endHour > 12) {
    invalidIds.push('modal-event-end-hour');
    errorMessages.push('end hour must be between 1 - 12');
    timesValid = false;
  }
  // Check if the minutes fall between 0 - 60.
  if (isNaN(startMinute) || startMinute < 0 || startMinute >= 60) {
    invalidIds.push('modal-event-start-minute');
    errorMessages.push('start minute must be between 00 - 59');
    timesValid = false;
  }
  if (isNaN(endMinute) || endMinute < 0 || endMinute >= 60) {
    invalidIds.push('modal-event-end-minute');
    errorMessages.push('end minute must be between 00 - 59');
    timesValid = false;
  }
  // Calculate start and end time in minutes.
  if (timesValid) {
    let startTime = ((startHour % 12) * 60) + startMinute;
    if (startAMorPM === 'pm') {
      startTime += 12 * 60;
    }
    let endTime = ((endHour % 12) * 60) + endMinute;
    if (endAMorPM === 'pm') {
      endTime += 12 * 60;
    }
    // Ensure that start time is before end time.
    if (startTime > endTime) {
      invalidIds.push('modal-event-start-hour');
      invalidIds.push('modal-event-start-minute');
      invalidIds.push('start-event-am-or-pm');
      invalidIds.push('modal-event-end-hour');
      invalidIds.push('modal-event-end-minute');
      invalidIds.push('end-event-am-or-pm');
      errorMessages.push('end time must be after start time');
    }
  }
}


/**
 * Checks if the given input is blank.
 * @param {String} input
 * @return {void}
 */
function isBlank(input) {
  const trimmed = input.trim();
  return !trimmed;
}

/**
 * Goes through the form elements. If it is a text input, adds an error if it is blank.
 * @param {array} invalidIds
 * @param {array} errorMessages
 * @param {array} formElements
 * @return {void}
 */
function validateModalText(invalidIds, errorMessages, formElements) {
  for (let i = 0; i < formElements.length; i++) {
    if (formElements[i].type === 'text' && (formElements[i].id ==="modal-org-name" || formElements[i].id ==="modal-location" || formElements[i].id ==="modal-type-food" )) {
      if (isBlank(formElements[i].value)) {
        invalidIds.push(formElements[i].id);
        const errorMessage = formElements[i].placeholder + ' is blank';
        errorMessages.push(errorMessage);
      }
    } else if (formElements[i].type === 'textarea' && formElements[i].id ==="modal-description") {
      if (formElements[i].value.length < 15) {
        invalidIds.push(formElements[i].id);
        const errorMessage = formElements[i].placeholder + ' needs at least 15 characters';
        errorMessages.push(errorMessage);
      }
    }
  }
}

function validateModalEventText(invalidIds, errorMessages, formElements) {
  for (let i = 0; i < formElements.length; i++) {
    if (formElements[i].type === 'text' && (formElements[i].id ==="modal-event-name" || formElements[i].id ==="modal-event-location" )) {
      if (isBlank(formElements[i].value)) {
        invalidIds.push(formElements[i].id);
        const errorMessage = formElements[i].placeholder + ' is blank';
        errorMessages.push(errorMessage);
      }
    } else if (formElements[i].type === 'textarea' && formElements[i].id ==="modal-event-description") {
      if (formElements[i].value.length < 15) {
        invalidIds.push(formElements[i].id);
        const errorMessage = formElements[i].placeholder + ' needs at least 15 characters';
        errorMessages.push(errorMessage);
      }
    }
  }
}


/**
 * Requests a Blobstore Upload URL from the CreateBlobstoreUrlServlet.
 * This URL is used for form submission.
 * @return {String}
 */
async function getBlobstoreUrl() {
  const url = '/createBlobstoreUrl';
  const response = await fetch(url, {
    method: 'GET',
  });
  const responseStatus = await response.status;
  const message = await response.text();
  // Only return a URL if there is a successful response.
  if (responseStatus === 200) {
    return message;
  } else {
    return;
  }
}

/**
 * Validates number inputs that aren't date/time.
 * @param {array} invalidIds
 * @param {array} errorMessages
 * @param {array} formElements
 */
function validateModalNumber(invalidIds, errorMessages, formElements) {
  const modalNumPeople = document.getElementById('modal-num-people');
  if (!modalNumPeople.value) {
    invalidIds.push('modal-num-people');
    errorMessages.push('number of people the event can feed is blank');
  } else if (modalNumPeople.value <= 0) {
    invalidIds.push('modal-num-people');
    errorMessages.push('number of people the event can feed must be greater than 0');
  } else if (modalNumPeople.value > 10000) {
    invalidIds.push('modal-num-people');
    errorMessages.push('number of people the event can feed cannot be greater than 10000');
  }
}

/**
 * Checks if the inputted address is valid.
 * Submits if address is verified.
 * @return {void}
 */
async function checkLocationAndSubmit() {
  const collegeId = (new URLSearchParams(window.location.search)).get('collegeid');

  if (modalForm && collegeId) {
    const modalLocation = document.getElementById('modal-location').value;
    const latLngResult = await translateLocationToLatLong(modalLocation);

    let url;

    // If the address entered isn't the same one as the one we last checked,
    // then we can assume the user edited their address and we should display
    // a fresh error if this new address is also invalid.
    if (!latLngResult && modalLocation !== cachedModalAddress) {
      cachedModalAddress = modalLocation;
      const modalError = document.createElement('div');
      modalError.setAttribute('id', 'modal-map-error');
      modalError.innerText =
        `We couldn't find address '${modalLocation}'. ` +
        'Please check your address for errors. ' +
        'If you wish to submit anyway, no pin will be added to the map.';
      modalButtonDiv.insertBefore(modalError, modalUploadLabel);
      submitModalButton.disabled = false;
    // Else, if the invalid address is the same as we last checked
    // or the address is just plain valid, then add the post to the Datastore.
    } else {
      const modalError = document.getElementById('modal-map-error');
      if (modalError) {
        modalButtonDiv.removeChild(modalError);
      }

      // (0,0) denotes a nonexistent lat/long, since it's a location in the ocean + is falsy.
      const lat = latLngResult ? latLngResult.lat : 0;
      const lng = latLngResult ? latLngResult.long : 0;

      const blobstoreUploadURL = await getBlobstoreUrl();
      if (!blobstoreUploadURL) {
        alert('Server Error. Try again later.');
        submitModalButton.disabled = false;
        return;
      }

      modalForm.action = blobstoreUploadURL;
      addAdditionalParameters(collegeId, lat, lng);

      const subtitle = document.getElementById('modal-submitted-subtitle');
      if (dateIsInTheFuture(modalMonth.value, modalDay.value)) {
        const subtitle = document.getElementById('modal-submitted-subtitle');
        subtitle.innerText += ` Users will see your post on ${modalMonth.value}/${modalDay.value}.`;
      }
      subtitle.innerText += ` A notification has been sent to all subscribed users.`;

      // Hides form modal, shows submit message and focuses on it.
      modalCard.style.display = 'none';
      modalSubmitted.style.display = 'block';
      modalSubmitted.focus();
      // Closes the submit modal after 2000 ms, and submits the form.
      setTimeout(function() {
        closeSubmit();
        modalForm.submit();
      }, 2000);
    }
  }
}

/**
 * Adds the collegeId, lat, and lng to the form request.
 * @param {String} collegeId
 * @param {String} lat
 * @param {String} lng
 * @return {void}
 */
function addAdditionalParameters(collegeId, lat, lng) {
  const collegeIdInput = document.createElement('input');
  collegeIdInput.setAttribute('name', 'collegeId');
  collegeIdInput.setAttribute('value', collegeId);
  collegeIdInput.setAttribute('type', 'hidden');
  modalForm.appendChild(collegeIdInput);

  const latInput = document.createElement('input');
  latInput.setAttribute('name', 'lat');
  latInput.setAttribute('value', lat);
  latInput.setAttribute('type', 'hidden');
  modalForm.appendChild(latInput);

  const lngInput = document.createElement('input');
  lngInput.setAttribute('name', 'lng');
  lngInput.setAttribute('value', lng);
  lngInput.setAttribute('type', 'hidden');
  modalForm.appendChild(lngInput);
}

/**
 * Closes the submit modal.
 * @return {void}
 */
function closeSubmit() {
  modalSubmitted.style.display = 'none';
  createPostButton.focus();
}

/**
 * Closes the modal if user clicks outside.
 * @param {myEvent} event - the modal background being clicked.
 * @listens myEvent
 * @return {void}
 */
window.onclick = function(event) {
  if (modal && event.target == modal) {
    modal.style.display = 'none';
    createPostButton.focus();
  }
};

document.addEventListener('keydown', function(e) {
  const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
  const isSpacePressed = e.keyCode === 32;

  // If space is pressed and the file upload label is focused on, click the file upload button.
  if (isSpacePressed && document.activeElement === modalUploadLabel) {
    modalFileUpload.click();
    return;
  }
  if (!isTabPressed) {
    return;
  }
  // If user is trying to go to the previous element, make sure it wraps to the bottom.
  if (e.shiftKey) { // If shift key pressed for shift + tab combination.
    if (document.activeElement === modalCard) {
      submitModalButton.focus();
      e.preventDefault();
    }
    if (document.activeElement === modalSubmitted) {
      modalSubmittedTitle.focus();
      e.preventDefault();
    }
  } else { // If user is trying to go to the next element, make sure it wraps to the top.
    if (document.activeElement === submitModalButton) {
      modalCard.focus();
      e.preventDefault();
    }
    if (document.activeElement === modalSubmittedTitle) {
      modalSubmitted.focus();
      e.preventDefault();
    }
  }
});



