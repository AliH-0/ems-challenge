import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  // merges timesheets with employees to show employee name
  const timesheetsAndEmployees = await db.all(`
    SELECT timesheets.*,
           employees.full_name,
           employees.id AS employee_id
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
  `);
  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  // Get the timesheets and employees from the loader
  const { timesheetsAndEmployees } = useLoaderData() as {
    timesheetsAndEmployees: any[];
  };
  const [view, setView] = useState<"table" | "calendar">("table");

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
        <div className="text-center">
          <p className="text-lg">Yet to implement the calendar view.</p>
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
