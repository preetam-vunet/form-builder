import FormBuilder from "./components/FormBuilder";
import type { Field } from "./types";

const userFormSchema = [
  { type: "text", name: "username", label: "Username", required: true },
  { type: "number", name: "age", label: "Age", min: 18 },
  { type: "select", name: "role", label: "Role", options: ["Admin", "User"] },
  { type: "checkbox", name: "isActive", label: "Active" },
] as const;

export default function App() {
  return (
    <div>
      <h1>User Form</h1>
      <FormBuilder
        schema={userFormSchema as readonly Field[]}
        onSubmit={(data) => {
          console.log("Form Data:", data);
        }}
      />
    </div>
  );
}
