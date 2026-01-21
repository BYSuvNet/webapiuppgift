# WebAPI-uppgift

Jag har låtit anlita ett gäng koola kids som designat en modern hemsida för events (folk är trötta på Facebook, det här kommer bli stort!). Tyvärr hade mina utvecklare ingen tid till att implementera backend-delen, så det får du fixa! En linux-konsult fick i uppdrag att ta fram en konsolapplikation för att skapa nya events, men det blev tyvärr bara delvis klart. Skriv klart den applikationen så att det går att lägga till events!

Denna uppgift består av tre underkataloger:

* `eventapi` - Här ska du implementera ett web-api i ASP.NET Core som följer specifikationen nedan.
* `website` - Här finns hemsidan som använder web-api:et. Den är redan klar, och du ska inte ändra på den överhuvudtaget. Men titta på den för att se att ditt API fungerar som det ska!
* `consoleapp` - Här finns den nästan klara konsolapplikation som du ska skriva klart! Mer info nedan.

## WebAPIet

Du ska skapa ett enkelt webapi som hanterar events. Via APIet ska det gå att skapa events, registrera sig till ett event, hämta en lista på alla events, hämta enskilda events, hämta alla registreringar för ett event. Eftersom hemsidan redan är skapad är det viktigt att APIet följer den specifikation som beskrivs här nedan, så att hemsidan fungerar som den ska:

### ROUTES

- `GET /api/v1/events` - Hämta en lista med alla events.
- `GET /api/v1/events/{id}` - Hämta ett enskilt event med angivet id.
- `POST /api/v1/events` - Skapa ett nytt event med från JSON-data i request bodyn
- `GET /api/v1/events/{id}/registrations` - Hämta alla registreringar för det specifika eventet.
- `POST /api/v1/events/{id}/registrations` - Skapa en ny registrering för ett event.

**Samtliga endpoints ska använda JSON för både request och response.** Här är specifikationen för dessa objekt som hemsidan förväntar sig:

### Att hämta ett event ska returnera detta:
```json
{
  "id": 1,
  "name": "BY Skolbal",
  "description": "Kom och dansa till orkester!",
  "eventDate": "2026-06-15T09:00:00",
  "location": "Aulan",
  "maxParticipants": 100,
  "registrationCount": 25
}
```

### Hämta en registrering ska returnera detta:
```json
{
  "id": 1,
  "name": "Gunnel",
  "email": "kontakt@gunnel.se",
  "registrationDate": "2026-01-21T22:50:38.1400024+01:00"
}
```

### Registrera sig till ett event görs med json-data som denna:
```json
{
  "name": "Gunnel",
  "email": "kontakt@gunnel.se"
}
```

### Skapa ett event görs med json-data som denna:
```json
{
  "name": "BY Loppis",
  "description": "Trötta konsulter säljer sina gamla prylar för att dryga ut lönen.",
  "eventDate": "2026-06-15T09:00:00",
  "location": "Fabriksgatan 12",
  "maxParticipants": 250
}
```

## Konsolapplikationen

Konsolapplikationen är nästan klar. Testa den så ser du hur den är tänkt att fungera. Din uppgift är att skriva klart den så att det går att skapa nya events med hjälp av ditt API. Kolla runt i koden, den tidigare utvecklaren har säkert lämnat en del TODO-kommentarer för att underlätta lite för nästa programmarerare.

## Minimikrav

* Det skall gå att använda samtliga endpoints enligt specifikationen ovan.
* Konsolapplikationen skall fungera som tänkt.
* Det finns inget krav på att använda Entity Framework, Services eller dependency injection, huvudsaken är att APIet fungerar som det ska.

## Extra utmaningar (valfritt)

* Använda Entity Framework Core med en SQLite databas för att lagra events och registreringar.
* Det ska inte gå att skapa events med datum i det förflutna.
* Det ska inte gå att registrera sig till ett event som är fullt.
* Det ska inte gå att registrera sig till ett event som redan har varit.
* Det ska inte gå att registrera sig på samma event flera gånger med samma email och namn.
* Validera email-adresser vid registrering.
* Lägg till en DELETE-endpoint för att ta bort events.
* Lägg till en DELETE-endpoint för att ta bort enskilda registreringar om man skriver in korrekt namn och email, inte id!
* Lägg till en valfri query-parameter till `GET /api/v1/events` för att bara hämta events efter ett visst datum.

# Tips

* Börja med EN endpoint åt gången. Testa tidigt med att skriva en get-request.
* Titta på json-datat ovan noggrant så att du vet hur svaret ska se ut. 
* Börja med att returnera hårdkodade värden i dina endpoints, så att du vet att de fungerar. Bygg sedan ut med riktig logik. Exempelvis alltid samma event, alltid samma lista med events osv. 
* Om du använder Entity Framework, börja med att använda en InMemory-databas för att testa. Bygg sedan ut till SQLite eller liknande.
