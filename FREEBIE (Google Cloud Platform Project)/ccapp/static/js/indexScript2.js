

//
// Event listener registration
//

// Hooks the onLoad function to the DOMContentLoaded event.
document.addEventListener('DOMContentLoaded', onLoad);

//
// Globals
//

let collegeLocations = 
  [{"UNITID":48312402,"NAME":"ASU","CITY":"Lake Havasu City","LAT":34.47278,"LON":-114.321591},
  {"UNITID":137351,"NAME":"USF","CITY":"Tampa","LAT":28.061458,"LON":-82.413232},
  {"UNITID":236948,"NAME":"UCSD","CITY":"Seattle","LAT":47.65538,"LON":-122.30514}];
  

//
// Constants
//

const US_GEOGRAPHICAL_CENTER = {lat: 39.50, lng: -98.35};
const MINIMUM_DEGREES_SEPARATION = 2.5;
const ENTER_KEYCODE = 13;

//
// Functions
//

/**
 * Fires as soon as the DOM is loaded.
 */
async function onLoad() {
  // collegeLocations = await (await fetch('./assets/college-locations.json')).json();
  
  addMapToPage();

  // Grab the datalist and remove its ID (destroying the select-datalist relationship),
  // to improve performance while adding the options to the datalist.
  const collegeDataList = document.getElementById('colleges');
  collegeDataList.removeAttribute('id');

  // Add all colleges as datalist options. We use a document fragment because the
  // DOM is slow if we add each option individually and let the DOM update in between.
  const fragment = document.createDocumentFragment();
  collegeLocations.forEach((location) => {
    const newOption = document.createElement('option');
    newOption.setAttribute('data-value', location.UNITID);
    newOption.value = location.NAME;

    fragment.appendChild(newOption);
  });

  // Add the options and restore the select-datalist relationship.
  collegeDataList.appendChild(fragment);
  collegeDataList.setAttribute('id', 'colleges');

  // When users select an option from the dropdown, send them to that page.
  //document.getElementById('colleges-input').addEventListener('change', navigateUserToCollegePage);
  //document.getElementById('colleges-input').addEventListener('keypress', navigateUserOnEnter);
}

function goBack() {
  window.history.back();
  console.log("I am in goBack");
}
  
/**
* Tries to add the map to the page. The map URL calls the initMap() function as
* its callback, which then positions the map and adds markers. If we are unable
* to retrieve the secret for the map, then we display an error to the user.
*/
function addMapToPage() {

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD6h8yj2Jd7-8q6lcxifInxtR8Ptv3aztg&callback=initMap`;
    script.defer = true;
    script.async = true;
    window.initMap = initMap;
    document.head.appendChild(script);
  // });
}

/**
 * Initializes the embedded Google Maps map.
 */
function initMap() {
  // Turn off the labels on the map and change the water color
  // so that the map fits the landing page's aesthetic better.
  
  const map = new google.maps.Map(document.getElementById('map'),
      {
        center: {lat: US_GEOGRAPHICAL_CENTER.lat, lng: US_GEOGRAPHICAL_CENTER.lng},
        zoom: 3,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#f0f5f7'}],
          },
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [
              {visibility: 'off'},
            ],
          },
        ],
      },
  );
      

  col = new Array(10)
      for (k in collegeLocations){
          col[k] = collegeLocations[k]
      }

        for (college in col){
          const marker = new google.maps.Marker({
            position: {lat: col[college]["LAT"], lng: col[college]["LON"]},
            map: map,
            title: col[college]["NAME"],
          });

        }
        }


