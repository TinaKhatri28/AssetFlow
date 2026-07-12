"use client";

import { useState } from "react";

interface Department {
  name: string;
  head: string;
  parent: string;
  status: string;
}

interface Category {
  name: string;
  description: string;
  warranty: string;
}

interface Employee {
  name: string;
  dept: string;
  role: string;
  status: string;
}

export default function OrgSetupPage() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Categories" | "Employees">("Departments");
  const [showModal, setShowModal] = useState(false);

  // Departments state
  const [departments, setDepartments] = useState<Department[]>([
    { name: "Engineering", head: "Aditi Rao", parent: "---", status: "Active" },
    { name: "Facilities", head: "Rohan Mehta", parent: "---", status: "Active" },
    { name: "Field Ops (East)", head: "Sana Iqbal", parent: "Field Ops", status: "Inactive" },
  ]);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([
    { name: "Electronics", description: "Laptops, screens, systems, and peripherals", warranty: "36 Months" },
    { name: "Audio Visual", description: "Projectors, microphones, and speakers", warranty: "12 Months" },
    { name: "Furniture", description: "Desks, ergonomic chairs, and shelves", warranty: "60 Months" },
  ]);

  // Employees state
  const [employees, setEmployees] = useState<Employee[]>([
    { name: "Aditi Rao", dept: "Engineering", role: "Department Head", status: "Active" },
    { name: "Rohan Mehta", dept: "Facilities", role: "Department Head", status: "Active" },
    { name: "Sana Iqbal", dept: "Field Ops", role: "Employee", status: "Active" },
    { name: "J. Mehta", dept: "IT", role: "Employee", status: "Active" },
  ]);

  // Modal input states
  const [inputName, setInputName] = useState("");
  const [inputSecond, setInputSecond] = useState("");
  const [inputThird, setInputThird] = useState("");

  const handleOpenAddModal = () => {
    setInputName("");
    setInputSecond("");
    setInputThird("");
    setShowModal(true);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    if (activeTab === "Departments") {
      setDepartments((prev) => [
        ...prev,
        {
          name: inputName.trim(),
          head: inputSecond.trim() || "Unassigned",
          parent: inputThird.trim() || "---",
          status: "Active",
        },
      ]);
    } else if (activeTab === "Categories") {
      setCategories((prev) => [
        ...prev,
        {
          name: inputName.trim(),
          description: inputSecond.trim() || "No description provided",
          warranty: inputThird.trim() || "12 Months",
        },
      ]);
    } else if (activeTab === "Employees") {
      setEmployees((prev) => [
        ...prev,
        {
          name: inputName.trim(),
          dept: inputSecond.trim() || "IT",
          role: inputThird.trim() || "Employee",
          status: "Active",
        },
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Tabs list matching Screen 3 */}
      <div className="flex border-b-3 border-black pb-0.5 gap-2 items-center justify-between">
        <div className="flex gap-2">
          {(["Departments", "Categories", "Employees"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-t-3 border-x-3 border-black font-mono font-bold uppercase transition-all text-xs rounded-t-sm ${
                  isActive
                    ? "bg-black text-white translate-y-[3px]"
                    : "bg-paper text-black hover:bg-yellow hover:text-black"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-1.5 border-3 border-black bg-yellow text-black font-mono font-extrabold uppercase text-xs rounded-sm shadow-[2px_2px_0_#111110] active:translate-y-0.5 active:shadow-[1px_1px_0_#111110] transition-all"
        >
          + Add
        </button>
      </div>

      {/* Render Active Table */}
      {activeTab === "Departments" && (
        <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
                <th className="p-4">Department</th>
                <th className="p-4">Head</th>
                <th className="p-4">Parent Dept</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {departments.map((dept, i) => (
                <tr key={i} className="text-sm font-semibold hover:bg-paper/30 font-mono">
                  <td className="p-4 font-sans font-bold">{dept.name}</td>
                  <td className="p-4 text-zinc-600">{dept.head}</td>
                  <td className="p-4 text-zinc-500">{dept.parent}</td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 border-2 border-black rounded-sm text-xs font-bold ${
                        dept.status === "Active" ? "bg-green-300" : "bg-red-300"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Categories" && (
        <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Warranty Span</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black font-mono text-sm">
              {categories.map((cat, i) => (
                <tr key={i} className="hover:bg-paper/30 font-semibold">
                  <td className="p-4 font-sans font-bold text-black">{cat.name}</td>
                  <td className="p-4 text-xs text-zinc-500">{cat.description}</td>
                  <td className="p-4 text-right text-xs font-bold text-zinc-600">{cat.warranty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Employees" && (
        <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black font-mono text-sm">
              {employees.map((emp, i) => (
                <tr key={i} className="hover:bg-paper/30 font-semibold">
                  <td className="p-4 font-sans font-bold text-black">{emp.name}</td>
                  <td className="p-4 text-xs text-zinc-600">{emp.dept}</td>
                  <td className="p-4 text-xs text-zinc-500">{emp.role}</td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 border-2 border-black rounded-sm text-xs font-bold bg-green-300 text-black`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 border-4 border-black rounded shadow-[8px_8px_0_#111110] max-w-md w-full space-y-4">
            <h3 className="font-mono text-lg font-black uppercase border-b-2 border-black pb-2">
              Add New {activeTab.slice(0, -1)}
            </h3>
            <form onSubmit={handleAddRecord} className="space-y-4 font-mono text-xs">
              <label className="block space-y-1">
                <span className="font-bold uppercase">Name:</span>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${activeTab === "Departments" ? "HR" : activeTab === "Categories" ? "Vehicles" : "Aarav Sharma"}`}
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded font-mono text-xs"
                />
              </label>

              <label className="block space-y-1">
                <span className="font-bold uppercase">
                  {activeTab === "Departments" ? "Head of Department:" : activeTab === "Categories" ? "Description:" : "Department:"}
                </span>
                <input
                  type="text"
                  placeholder={`e.g. ${activeTab === "Departments" ? "Neha Gupta" : activeTab === "Categories" ? "Fleet and transport assets" : "Engineering"}`}
                  value={inputSecond}
                  onChange={(e) => setInputSecond(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded font-mono text-xs"
                />
              </label>

              <label className="block space-y-1">
                <span className="font-bold uppercase">
                  {activeTab === "Departments" ? "Parent Department (Optional):" : activeTab === "Categories" ? "Warranty Duration:" : "Job Role:"}
                </span>
                <input
                  type="text"
                  placeholder={`e.g. ${activeTab === "Departments" ? "Corporate" : activeTab === "Categories" ? "24 Months" : "Facilities Lead"}`}
                  value={inputThird}
                  onChange={(e) => setInputThird(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded font-mono text-xs"
                />
              </label>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border-2 border-black rounded font-bold uppercase bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-black rounded font-bold uppercase bg-yellow text-black shadow-[2px_2px_0_#111110]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500 font-mono italic">
        * Adding records here dynamically updates the list view for testing and workflow verification.
      </p>
    </div>
  );
}
