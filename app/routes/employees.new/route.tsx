import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  try {
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

    const db = await getDB();
    await db.run(
      `
        INSERT INTO employees (
          full_name,
          email,
          phone,
          dob,
          job_title,
          department,
          salary,
          start_date,
          end_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      ]
    );

    return redirect("/employees");
  } catch (error) {
    console.error("Error inserting new employee:", error);
    throw error;
  }
};

export default function NewEmployeePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        Create New Employee
      </h1>
      <div className="max-w-xl mx-auto border border-gray-300 rounded p-6 shadow-sm space-y-4">
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block font-semibold mb-1">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-semibold mb-1">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              pattern="^\d{10,}$"
              title="number must have at least 10 digits."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dob" className="block font-semibold mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="job_title" className="block font-semibold mb-1">
              Job Title
            </label>
            <input
              id="job_title"
              name="job_title"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="department" className="block font-semibold mb-1">
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="salary" className="block font-semibold mb-1">
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="start_date" className="block font-semibold mb-1">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block font-semibold mb-1">
              End Date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Employee
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
          <a href="/timesheets" className="text-blue-600 hover:text-green-600">
            Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
