import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react";

// Load the db before page renders
export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee: any) =>
      employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.department &&
        employee.department
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (employee.email &&
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.phone &&
        employee.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Employees</h1>

      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4 flex gap-3 justify-center flex-wrap">
        {filteredEmployees.map((employee: any) => (
          <div
            key={employee.id}
            className="border border-gray-300 rounded p-4 shadow-sm"
          >
            <ul className="space-y-1">
              <li className="font-semibold">Employee #{employee.id}</li>
              <ul className="ml-4 list-disc">
                <li>Full Name: {employee.full_name}</li>
                <li>Department: {employee.department}</li>
                <li>Email: {employee.email}</li>
                <li>Phone: {employee.phone}</li>
              </ul>
              <a
                href={`/employees/${employee.id}`}
                className="text-blue-600 hover:text-green-600 mt-2 inline-block"
              >
                View / Edit
              </a>
            </ul>
          </div>
        ))}
      </div>

      <hr className="my-8" />

      {/* A small nav list for new employees & timesheets */}
      <ul className="space-y-2 text-center">
        <li>
          <a
            href="/employees/new"
            className="text-blue-600 hover:text-green-600"
          >
            New Employee
          </a>
        </li>
        <li>
          <a href="/timesheets/" className="text-blue-600 hover:text-green-600">
            Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
