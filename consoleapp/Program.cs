// WRITTEN IN EMACS, THE ONLY TRUE IDE
// BY HAXXOR2000 - REACH ME ON IRC.FREENODE.NET

using consoleapp.Models;
using consoleapp.Services;

var service = new EventApiService();
bool running = true;

Console.WriteLine("=================================");
Console.WriteLine("   EVENT MANAGEMENT CONSOLE");
Console.WriteLine("=================================\n");

while (running)
{
    ShowMenu();
    var choice = Console.ReadLine();

    switch (choice)
    {
        case "1":
            ShowAllEvents();
            break;
        case "2":
            CreateNewEvent();
            break;
        case "3":
            running = false;
            Console.WriteLine("\nGoodbye!");
            break;
        default:
            Console.WriteLine("\nInvalid choice. Please try again.\n");
            break;
    }
}

void ShowMenu()
{
    Console.WriteLine("MENU:");
    Console.WriteLine("1. Show all events");
    Console.WriteLine("2. Create new event");
    Console.WriteLine("3. Exit");
    Console.Write("\nSelect an option: ");
}

void ShowAllEvents()
{
    Console.WriteLine("\n--- ALL EVENTS ---");

    try
    {
        var events = service.GetAllEvents();

        if (events.Count == 0)
        {
            Console.WriteLine("No events found.");
        }
        else
        {
            foreach (var evt in events)
            {
                Console.WriteLine($"\nID: {evt.Id}");
                Console.WriteLine($"Name: {evt.Name}");
                Console.WriteLine($"Description: {evt.Description}");
                Console.WriteLine($"Date: {evt.EventDate:yyyy-MM-dd HH:mm}");
                Console.WriteLine($"Location: {evt.Location}");
                Console.WriteLine($"Participants: {evt.RegistrationCount}/{evt.MaxParticipants}");
                Console.WriteLine(new string('-', 40));
            }
        }
    }
    catch (NotImplementedException ex)
    {
        Console.WriteLine($"\nError: {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nError fetching events: {ex.Message}");
    }

    Console.WriteLine();
}

void CreateNewEvent()
{
    Console.WriteLine("\n--- CREATE NEW EVENT ---");

    try
    {
        Console.Write("Event name: ");
        var name = Console.ReadLine() ?? string.Empty;

        Console.Write("Description: ");
        var description = Console.ReadLine() ?? string.Empty;

        Console.Write("Date (yyyy-MM-dd HH:mm): ");
        var dateInput = Console.ReadLine() ?? string.Empty;

        if (!DateTime.TryParse(dateInput, out var eventDate))
        {
            Console.WriteLine("Invalid date format.");
            return;
        }

        Console.Write("Location: ");
        var location = Console.ReadLine() ?? string.Empty;

        Console.Write("Max participants: ");
        if (!int.TryParse(Console.ReadLine(), out var maxParticipants))
        {
            Console.WriteLine("Invalid number.");
            return;
        }

        var newEvent = new CreateEventRequest
        {
            Name = name,
            Description = description,
            EventDate = eventDate,
            Location = location,
            MaxParticipants = maxParticipants
        };

        var createdEvent = service.CreateEvent(newEvent);

        Console.WriteLine($"\nEvent created successfully with ID: {createdEvent?.Id}");
    }
    catch (NotImplementedException ex)
    {
        Console.WriteLine($"\nError: {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nError creating event: {ex.Message}");
    }

    Console.WriteLine();
}
