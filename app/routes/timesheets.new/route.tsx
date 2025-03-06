import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";
import type { ActionFunction } from "react-router";

// Loader that fetches employees so we can pick one in a <select> input
export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

// Helper function to ensure date-time strings include seconds
function fixDateTime(input: string | FormDataEntryValue | null): string {
  if (!input || typeof input !== "string") return "";
  // If the input already includes seconds (i.e. has two colons), return as is.
  if (input.split(":").length >= 3) return input;
  // Otherwise, assume it's in "YYYY-MM-DDTHH:MM" format and append ":00"
  return input + ":00";
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = fixDateTime(formData.get("start_time"));
  const end_time = fixDateTime(formData.get("end_time"));

  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time) VALUES (?, ?, ?)",
    [employee_id, start_time, end_time]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData() as { employees: any[] };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        Create New Timesheet
      </h1>

      <div className="max-w-lg mx-auto border border-gray-300 rounded p-6 shadow-sm space-y-4">
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="employee_id" className="block font-semibold mb-1">
              Employee
            </label>
            <select
              name="employee_id"
              id="employee_id"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="start_time" className="block font-semibold mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              id="start_time"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="end_time" className="block font-semibold mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              name="end_time"
              id="end_time"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Timesheet
          </button>
        </Form>
      </div>

      <hr className="my-8" />

      <ul className="space-y-2 text-center">
        <li>
          <a href="/timesheets" className="text-blue-600 hover:text-green-600">
            Timesheets
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
