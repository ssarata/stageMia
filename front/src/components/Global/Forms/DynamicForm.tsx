import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "../Fields/FormField";
import type { z } from "zod";
import type { FormConfig } from "../types/formConfig";

interface DynamicFormProps<T extends z.ZodType<any, any>> {
  config: FormConfig;
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void;
  isLoading?: boolean;
  submitText?: string;
  loadingText?: string;
}

export const DynamicForm = <T extends z.ZodType<any, any>>({
  config,
  schema,
  defaultValues,
  onSubmit,
  isLoading = false,
  submitText = "Soumettre",
  loadingText = "En cours...",
}: DynamicFormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    trigger,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Grille à 2 colonnes */}
      <div className="grid grid-cols-2 gap-4">
        {config.fields.map((field) => (
          <div
            key={field.name}
            className={
              field.gridCols === 1 ? "col-span-2" : "col-span-1"
            }
          >
            <FormField
              field={field}
              register={register}
              control={control}
              errors={errors}
              watch={watch}
              trigger={trigger}
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? loadingText : submitText}
      </Button>
    </form>
  );
};