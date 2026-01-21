using System.Net.Http.Json;
using System.Text.Json;
using consoleapp.Models;

namespace consoleapp.Services;

public class EventApiService
{
    private readonly HttpClient _httpClient;

    public EventApiService()
    {
        _httpClient = new HttpClient();
    }

    public List<Event> GetAllEvents()
    {
        // TODO: Skapa en GET-request till eventapi:et för att hämta alla events
        // 1. Använd _httpClient.GetFromJsonAsync<T>().Result för att få resultatet utan att använda await
        // (Om du vet hur du använder await och async så kan du använda det också)
        // 2. Kolla om du fick ett giltigt svar och returnera det, annars en tom lista.

        throw new NotImplementedException("GetAllEvents not yet implemented");
    }

    public Event? CreateEvent(CreateEventRequest newEvent)
    {
        // TODO: Gör en POST-request här för att skapa ett nytt event
        // 1. Använd _httpClient.PostAsJsonAsync().Result för att skicka POST-requesten utan att använda await
        // 2. Obs, kolla statuskoden om det gick bra. Det är alltid bra.
        // 3. Om det gjorde det, läs in det skapade eventet från svaret och returnera det
        // 4. Om något gick fel, returnera null. Eller MU! som buddisterna säger.

        throw new NotImplementedException("CreateEvent not yet implemented");
    }
}
