import React, {useState} from "react"
import type { Field, FormBuilderProps, InferSchema } from "../types"

function FormBuilder<T extends readonly Field[]>({ schema, onSubmit }: FormBuilderProps<T>) {
    const [values, setValues] = useState<Partial<InferSchema<T>>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = <K extends keyof InferSchema<T>>(name: K, value: InferSchema<T>[K]) => {
        setValues(prev => ({...prev, [name]: value}))
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        schema.forEach(field => {
            const value = values[field.name as keyof InferSchema<T>];

            if(field.type === 'text' && field.required && !value) {
                newErrors[field.name] = "Required";
            }

            if(field.type === "number") {
                if(value === undefined || value === null || value === "") {
                    newErrors[field.name] = "Required"
                }
                else {
                    if(field.min !== undefined && (value as number) < field.min) {
                        newErrors[field.name] = `Min ${field.name} is ${field.min}`
                    }
                    if(field.max !== undefined && (value as number) > field.max) {
                        newErrors[field.name] = `Max ${field.name} is ${field.max}`
                    }
                }
            }

            if(field.type === "select" && value && !field.options.includes(value as string)) {
                newErrors[field.name] = "Invalid Option";
            }
        })
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
        onSubmit(values as unknown as InferSchema<T>);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: "300px" }}>
        {schema.map((field) => (
            <div key={field.name}>
            <label>
                {field.label}{" "}
                {field.type === "text" && (
                <input
                    type="text"
                    value={(values[field.name as keyof InferSchema<T>] as string) || ""}
                    onChange={(e) => handleChange(field.name as keyof InferSchema<T>, e.target.value as InferSchema<T>[typeof field.name])}
                />
                )}
                {field.type === "number" && (
                <input
                    type="number"
                    value={(values[field.name as keyof InferSchema<T>] as number) || ""}
                    onChange={(e) =>
                    handleChange(field.name as keyof InferSchema<T>, Number(e.target.value) as InferSchema<T>[typeof field.name])
                    }
                />
                )}
                {field.type === "select" && (
                <select
                    value={(values[field.name as keyof InferSchema<T>] as string) || ""}
                    onChange={(e) => handleChange(field.name as keyof InferSchema<T>, e.target.value as InferSchema<T>[typeof field.name])}
                >
                    <option value="">--Select--</option>
                    {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                    ))}
                </select>
                )}
                {field.type === "checkbox" && (
                <input
                    type="checkbox"
                    checked={(values[field.name as keyof InferSchema<T>] as boolean) || false}
                    onChange={(e) =>
                    handleChange(field.name as keyof InferSchema<T>, e.target.checked as InferSchema<T>[typeof field.name])
                    }
                />
                )}
            </label>
            {errors[field.name] && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>{errors[field.name]}</div>
            )}
            </div>
        ))}
        <button type="submit">Submit</button>
        </form>
    );
}

export default FormBuilder