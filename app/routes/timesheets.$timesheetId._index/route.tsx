import {
  Form,
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { getDB } from "~/db/getDB";

// loader function to fetch timesheet and employees data
export async function loader({ params }: LoaderFunctionArgs) {
  const { timesheetId } = params;
  const db = await getDB();
  const timesheet = await db.get(
    `
    SELECT timesheets.*,
           employees.full_name
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
    WHERE timesheets.id = ?
  `,
    timesheetId
  );
  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { timesheet, employees };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { timesheetId } = params;
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  // dates validation
  if (!start_time || !end_time) {
    throw new Error("Start/End time required");
  }

  const db = await getDB();
  await db.run(
    `
    UPDATE timesheets
    SET
      employee_id = ?,
      start_time = ?,
      end_time = ?
    WHERE id = ?
  `,
    [employee_id, start_time, end_time, timesheetId]
  );

  return redirect(`/timesheets/${timesheetId}`);
}

export default function TimesheetPage() {
  const { timesheet, employees } = useLoaderData() as {
    timesheet: any;
    employees: any[];
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        Timesheet #{timesheet.id}
      </h1>

      <div className="max-w-xl mx-auto border border-gray-300 rounded p-6 shadow-sm space-y-4">
        <Form method="post" className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Employee</label>
            <select
              name="employee_id"
              defaultValue={timesheet.employee_id}
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
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              required
              defaultValue={convertToDateTimeLocal(timesheet.start_time)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              required
              defaultValue={convertToDateTimeLocal(timesheet.end_time)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
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
          <a
            href="/timesheets/new"
            className="text-blue-600 hover:text-green-600"
          >
            New Timesheet
          </a>
        </li>
        <li>
          <a
            href={`/employees/${timesheet.employee_id}`}
            className="text-blue-600 hover:text-green-600"
          >
            Go to Employee
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

/**
 * Convert "YYYY-MM-DD HH:MM:SS" to "YYYY-MM-DDTHH:MM"
 * so it fits <input type="datetime-local" /> in the edit form
 */
function convertToDateTimeLocal(dbValue: string) {
  if (!dbValue) return "";
  const [datePart, timePart] = dbValue.split(" ");
  if (!timePart) return `${datePart}T00:00`;
  const [hh, mm] = timePart.split(":");
  return `${datePart}T${hh}:${mm}`;
}
