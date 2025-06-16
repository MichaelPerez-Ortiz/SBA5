const facOutput = document.getElementById("facOutput");
const sigOutput = document.getElementById("sigOutput");
const orgOutput = document.getElementById("orgOutput");

const allFactsBtn = document.getElementById("allFacts");
const verifiedOnlyBtn = document.getElementById("verifiedOnly");
const applyBtn = document.getElementById("apply");
const clearBtn = document.getElementById("clear");

const factForm = document.getElementById("facts");
const factInput = document.getElementById("text");
const sourceInput = document.getElementById("source");
const verifyInput = document.getElementById("verify");

let currentFactFilter = null;
let factsData = []; 


function createFactHTML(fact) {
  return `
    <div class="item" style="margin-bottom: 12px;">
      <b>ID:</b> ${fact.id}<br>
      <b>Fact:</b> ${fact.fact}<br>
      <b>Verified:</b> ${fact.verified} <br>
      ${fact.source ? `<b>Source:</b> <a href="${fact.source}" target="_blank" rel="noopener noreferrer">${fact.source}</a>` : `<b>Source:</b> None`}
    </div>`;
}


function createSightingHTML(sighting) {
  return `
    <div class="item" style="margin-bottom: 12px;">
      <b>ID:</b> ${sighting.id}<br>
      <b>Habitat:</b> ${sighting.habitat}<br>
      <b>Date:</b> ${sighting.date}<br>
      <b>Count:</b> ${sighting.count}
    </div>`;
}


function createOrganizationHTML(org) {
  return `
    <div class="item" style="margin-bottom: 12px;">
      <b>ID:</b> ${org.id}<br>
      <b>Name:</b> ${org.name}<br>
      <b>Location:</b> ${org.location}<br>
      <b>Focus:</b> ${org.focus}
    </div>`;
}


function verifyState() {

    verifyInput.disabled = sourceInput.value.trim() === "";
    verifyInput.checked = false;
}

    verifyState();

    sourceInput.addEventListener("input", verifyState);

async function loadFacts() {
    
    try {

        let load = await fetch("/facts");

        if (!load.ok) throw new Error(`Server error: ${load.status}`);
            factsData = await load.json();

    } catch (err) {

       facOutput.innerHTML = `<i>Error loading facts: ${err.message}</i>`;

    }

}

    loadFacts();


factForm.addEventListener("submit" , async (event) => {
    event.preventDefault();

        let newFact = {

            fact: factInput.value ,
            source: sourceInput.value ,
            verified: verifyInput.checked
      };

    try {

         let send = await fetch("/facts", {
            method: "POST",
            headers: {

                "Content-Type" : "application/json"
        },

            body: JSON.stringify(newFact)

     });

        if (!send.ok) {
            throw new Error(`Server error: ${send.status}`);
        }

        let addedFact = await send.json();

    facOutput.innerHTML = facOutput.innerHTML + createFactHTML(addedFact);

        factInput.value = "";
        sourceInput.value = "";
        verifyInput.checked = false;

        factsData.push(addedFact);

        verifyState();

        if(currentFactFilter) {

            showFacts();
        }


    } catch(err) {

        facOutput.innerHTML = `<i>Error adding fact: ${err.message}<i>`;
  }

});


//Facts

async function showFacts() {

  if (!currentFactFilter) {
    facOutput.innerHTML = "";
    return;
  }

  try {
        let url = "/facts";

            if (currentFactFilter === "verified") url += "?verified=true";

        let res = await fetch(url);

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

        let facts = await res.json();

        if (facts.length === 0) {

            facOutput.innerHTML = "<i>No facts found.</i>";

        return;

     }

        facOutput.innerHTML = facts.map(createFactHTML).join("");

    } catch (err) {

    facOutput.innerHTML = `<i>Error loading facts: ${err.message}</i>`;

  }

}


//Sightings

async function showSightings(habitat = "" , minCount = "") {
    
  try {
        let url = "/sightings?";

            if (habitat) url += `habitat=${encodeURIComponent(habitat)}&`;
            if (minCount) url += `minCount=${encodeURIComponent(minCount)}&`;
                url = url.replace(/&$/, "");

        let res = await fetch(url);

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

        let sightings = await res.json();

            if (sightings.length === 0) {

                sigOutput.innerHTML = "<i>No sightings found.</i>";

                    return;
    }

                sigOutput.innerHTML = sightings.map(createSightingHTML).join("");

  } catch (err) {

        sigOutput.innerHTML = `<i>Error loading sightings: ${err.message}</i>`;

  }

}



//Organizations

async function showOrganizations(name = "" , location = "" , focus = "") {
    
  try {
        
        let params = new URLSearchParams();

            if (name) params.append("name", name);
            if (location) params.append("location", location);
            if (focus) params.append("focus", focus);

      
        let url = `/organizations?${params.toString()}`;
        let res = await fetch(url);

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

        let orgs = await res.json();

            if (orgs.length === 0) {

                orgOutput.innerHTML = "<i>No organizations found.</i>";
                    return;

        }

        orgOutput.innerHTML = orgs.map(createOrganizationHTML).join("");

    } catch (err) {

        orgOutput.innerHTML = `<i>Error loading organizations: ${err.message}</i>`;

  }

}



// Filters


//Facts
allFactsBtn.addEventListener("click", () => {
  currentFactFilter = "all";
  allFactsBtn.classList.add("active");
  verifiedOnlyBtn.classList.remove("active");
});

verifiedOnlyBtn.addEventListener("click", () => {
  currentFactFilter = "verified";
  verifiedOnlyBtn.classList.add("active");
  allFactsBtn.classList.remove("active");
});

applyBtn.addEventListener("click", () => {
  showFacts();
});

clearBtn.addEventListener("click", () => {
  currentFactFilter = null;
  facOutput.innerHTML = "";
  allFactsBtn.classList.remove("active");
  verifiedOnlyBtn.classList.remove("active");
});


//Sightings
const sightingsForm = document.getElementById("sightings");
const habitatInput = document.getElementById("Filter");
const minCountInput = document.getElementById("count");
const sightingsClearBtn = sightingsForm.querySelector("button.clear");

sightingsForm.addEventListener("submit", event => {
  event.preventDefault();
  showSightings(habitatInput.value.trim(), minCountInput.value.trim());
});

sightingsClearBtn.addEventListener("click", () => {
  habitatInput.value = "";
  minCountInput.value = "";
  sigOutput.innerHTML = "";
});



// Organizations
const org = document.getElementById("org");
const nameInput = document.getElementById("name");
const locInput = document.getElementById("loc");
const focusInput = document.getElementById("focus");
const orgClearBtn = org.querySelector("button.clear");

org.addEventListener("submit", event => {
  event.preventDefault();
  showOrganizations(nameInput.value.trim(), locInput.value.trim(), focusInput.value.trim());
});

orgClearBtn.addEventListener("click", () => {
  nameInput.value = "";
  locInput.value = "";
  focusInput.value = "";
  orgOutput.innerHTML = "";
});