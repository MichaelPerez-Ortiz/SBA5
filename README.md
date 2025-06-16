# SBA5

*Cheetah Information API*

- Cheetah Facts
- Cheetah Sightings
- Cheetah focused Organizations

***//////////////////***

**VIEW**

*Cheetah Facts*

Make sure to click Apply Filter after clicking either All Facts or Verified Only.

When adding a fact a source is required to check the verified box and appear true

*Sightings & Organizations*

It's not necessary to type out the entire name, location or focus a single word or even letter will filter the results accordingly.


**//////////////////**


**Endpoints**


***GET*** 

    /facts
    /facts?verified=true
    /facts?verified=false

    /sightings?
    /sightings?habitat=

    /organizations
    /organizations?name=
    /organizations?location=
    /organizations?focus=


***PUT*** 

    /facts/:id

***POST***

    /facts

    /organizations

***PATCH*** 

    /sightings/:id


***DELETE***

    /facts/:id

    /organizations/:id