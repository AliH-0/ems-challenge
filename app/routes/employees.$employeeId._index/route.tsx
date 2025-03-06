import {
  Form,
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { getDB } from "~/db/getDB";

export async function loader({ params }: LoaderFunctionArgs) {
  // Fetch a single employee by ID
  const { employeeId } = params;
  const db = await getDB();
  const employee = await db.get(
    "SELECT * FROM employees WHERE id = ?",
    employeeId
  );
  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }
  return { employee };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { employeeId } = params;
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const dob = formData.get("dob");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  // Optionally handle photo update here if needed
  const db = await getDB();
  await db.run(
    `
    UPDATE employees
    SET
      full_name = ?,
      email = ?,
      phone = ?,
      dob = ?,
      job_title = ?,
      department = ?,
      salary = ?,
      start_date = ?,
      end_date = ?
    WHERE id = ?
  `,
    [
      full_name,
      email,
      phone,
      dob,
      job_title,
      department,
      salary,
      start_date,
      end_date,
      employeeId,
    ]
  );
  return redirect(`/employees/`);
}

export default function EmployeePage() {
  const { employee } = useLoaderData() as { employee: any };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        Edit Employee #{employee.id}
      </h1>
      <div className="max-w-xl mx-auto border border-gray-300 rounded p-6 shadow-sm space-y-4">
        <Form method="post" className="space-y-4">
          {employee.photo && (
            <div className="text-center">
              <img
                src={employee.photo}
                alt="Employee Photo"
                className="w-24 h-24 object-cover rounded-full mx-auto"
              />
            </div>
          )}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="full_name"
              defaultValue={employee.full_name}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              defaultValue={employee.email}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="phone"
              pattern="^\d{10,}$"
              title="number must have at least 10 digits and no special characters."
              defaultValue={employee.phone}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date of Birth</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
              name="dob"
              defaultValue={employee.dob}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Job Title</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="job_title"
              defaultValue={employee.job_title}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Department</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="department"
              defaultValue={employee.department}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Salary</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              name="salary"
              defaultValue={employee.salary}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Start Date</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
              name="start_date"
              defaultValue={employee.start_date}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Date</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
              name="end_date"
              defaultValue={employee.end_date}
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
          <a href="/employees" className="text-blue-600 hover:text-green-600">
            Employees
          </a>
        </li>
        <li>
          <a
            href="/employees/new"
            className="text-blue-600 hover:text-green-600"
          >
            New Employee
          </a>
        </li>
        <li>
          <a href="/timesheets" className="text-blue-600 hover:text-green-600">
            Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
