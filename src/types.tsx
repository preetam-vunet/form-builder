export type Field =
  | { type: "text"; name: string; label: string; required?: boolean }
  | { type: "number"; name: string; label: string; min?: number; max?: number }
  | { type: "select"; name: string; label: string; options: readonly string[] }
  | { type: "checkbox"; name: string; label: string };

export type InferSchema<T extends readonly Field[]> = {
    [K in T[number] as K['name']] : 
        K extends {type: "text"} ? string :
        K extends {type: "number"} ? number :
        K extends {type: "select"} ? K["options"][number] :
        K extends {type: "checkbox"} ? boolean:
        never
}

export interface FormBuilderProps<T extends readonly Field[]> {
    schema: T;
    onSubmit: (data: InferSchema<T>) => void
}