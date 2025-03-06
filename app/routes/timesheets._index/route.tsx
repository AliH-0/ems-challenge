import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Loader: merges timesheets with employees to show employee name
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(`
    SELECT timesheets.*,
           employees.full_name,
           employees.id AS employee_id
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
  `);
  return { timesheetsAndEmployees };
}

/**
 * Convert DB date strings (e.g. "2025-03-06 19:28:00" or "2025-03-06 19:28")
 * into a valid ISO string with "T" (e.g. "2025-03-06T19:28:00")
 * React Calendar works with JavaScript Date objects.
 */
function toISO(dbDate: string) {
  if (!dbDate) return "";
  if (dbDate.includes("T")) {
    // Check if seconds are missing; if so, append ":00"
    if (dbDate.split("T")[1].split(":").length === 2) {
      return dbDate + ":00";
    }
    return dbDate;
  }
  const [datePart, timePartRaw] = dbDate.split(" ");
  if (!timePartRaw) return `${datePart}T00:00:00`;
  const segments = timePartRaw.split(":");
  if (segments.length === 2) {
    segments.push("00");
  }
  return `${datePart}T${segments.join(":")}`;
}

export default function TimesheetsPage() {
  // Get the timesheets and employees from the loader
  const { timesheetsAndEmployees } = useLoaderData() as {
    timesheetsAndEmployees: any[];
  };
  // useState to switch between table and calendar
  const [view, setView] = useState<"table" | "calendar">("table");

  // For the calendar view, convert DB timesheets into events
  const calendarEvents = timesheetsAndEmployees.map((ts) => ({
    id: ts.id,
    title: `Timesheet #${ts.id} - ${ts.full_name}`,
    // Convert to ISO format and then to a Date object
    start: new Date(toISO(ts.start_time)),
    // You can add end if needed: new Date(toISO(ts.end_time))
  }));

  // For react-calendar, we'll maintain a state for the selected date.
  const [selectedDate, setSelectedDate] = useState(new Date());

  // tileContent: for each day in the calendar, filter and display events
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const eventsForDay = calendarEvents.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getFullYear() === date.getFullYear() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getDate() === date.getDate()
        );
      });
      return (
        <div className="text-xs mt-1">
          {eventsForDay.map((event) => (
            <div key={event.id} className="bg-blue-100 rounded px-1">
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Timesheets</h1>

      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setView("table")}
          className={`px-4 py-2 rounded text-white ${
            view === "table" ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Table View
        </button>

        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded text-white ${
            view === "calendar"
              ? "bg-blue-600"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Calendar View
        </button>
      </div>

      {view === "table" ? (
        <div className="space-y-4 flex flex-wrap gap-3 justify-center">
          {timesheetsAndEmployees.map((ts) => (
            <div
              key={ts.id}
              className="border border-gray-300 rounded p-4 shadow-sm w-72"
            >
              <ul className="space-y-1">
                <li className="font-semibold">Timesheet #{ts.id}</li>
                <ul className="ml-4 list-disc">
                  <li>
                    Employee: {ts.full_name} (ID: {ts.employee_id})
                  </li>
                  <li>Start Time: {ts.start_time}</li>
                  <li>End Time: {ts.end_time}</li>
                </ul>
                <a
                  href={`/timesheets/${ts.id}`}
                  className="text-blue-600 hover:text-green-600 mt-2 inline-block"
                >
                  View / Edit
                </a>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center flex justify-center">
          <Calendar
            onChange={(value, event) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>
      )}

      <hr className="my-8" />
      <ul className="space-y-2 text-center">
        <li>
          <a
            href="/timesheets/new"
            className="text-blue-600 hover:text-green-600"
          >
            New Timesheet
          </a>
        </li>
        <li>
          <a href="/employees" className="text-blue-600 hover:text-green-600">
            Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
