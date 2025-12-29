import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select2 } from "@/components/ui/select2";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormTrigger } from "react-hook-form";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";
import type { FieldConfig } from "../types/formConfig";

interface FormFieldProps {
  field: FieldConfig;
  register: any;
  control: Control<any>;
  errors: FieldErrors;
  watch: any;
  trigger?: UseFormTrigger<any>;
}

export const FormField = ({
  field,
  register,
  control,
  errors,
  watch,
  trigger,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const error = errors[field.name];
  const fieldValue = watch(field.name);

  //
  const hasValue =
    fieldValue !== undefined && fieldValue !== "" && fieldValue !== null;
  const isValid = !error && hasValue && touched;
  const isInvalid = error && touched;

  const handleBlur = async () => {
    setTouched(true);
    if (trigger) {
      await trigger(field.name);
    }
  };

  const renderInput = () => {
    switch (field.type) {
      case "phone":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <PhoneInputComponent
                value={controllerField.value}
                onChange={(phone) => {
                  controllerField.onChange(phone);
                  setTouched(true);
                  if (trigger) {
                    trigger(field.name);
                  }
                }}
                label=""
                placeholder={field.placeholder}
                required={field.required}
                error={error ? (error.message as string) : ""}
                disabled={field.disabled}
              />
            )}
          />
        );

      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => {
              const selectedOption = field.options?.find(
                (opt) => opt.value === controllerField.value
              );

              return (
                <div className="relative">
                  <Select2
                    value={
                      selectedOption
                        ? { value: selectedOption.value, label: selectedOption.label }
                        : null
                    }
                    onChange={(option: any) => {
                      const value = option?.value;
                      const parsedValue =
                        value !== undefined && !isNaN(Number(value))
                          ? Number(value)
                          : value;
                      controllerField.onChange(parsedValue);
                      setTouched(true);
                      if (trigger) {
                        trigger(field.name);
                      }
                    }}
                    options={field.options?.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    placeholder={field.placeholder || "Sélectionner"}
                    isDisabled={field.isLoading}
                    isLoading={field.isLoading}
                    isClearable
                    isSearchable
                    error={isInvalid}
                    onBlur={handleBlur}
                  />
                  {isValid && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  {isInvalid && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
              );
            }}
          />
        );

      case "textarea":
        return (
          <div className="relative">
            <Textarea
              placeholder={field.placeholder}
              {...register(field.name, { required: field.required })}
              rows={4}
              onBlur={handleBlur}
              className={`
                ${isValid ? "border-green-500 focus:ring-green-500" : ""}
                ${isInvalid ? "border-red-500 focus:ring-red-500" : ""}
              `}
            />
            {isValid && (
              <div className="absolute right-3 top-3 pointer-events-none">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            {isInvalid && (
              <div className="absolute right-3 top-3 pointer-events-none">
                <X className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
        );

      case "password":
        if (field.showPasswordToggle) {
          return (
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={field.placeholder}
                {...register(field.name, { required: field.required })}
                onBlur={handleBlur}
                className={`
                  pr-20
                  ${isValid ? "border-green-500 focus:ring-green-500" : ""}
                  ${isInvalid ? "border-red-500 focus:ring-red-500" : ""}
                `}
              />
              {isValid && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
              {isInvalid && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                  <X className="h-5 w-5 text-red-500" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          );
        }
        return (
          <div className="relative">
            <Input
              type="password"
              placeholder={field.placeholder}
              {...register(field.name, { required: field.required })}
              onBlur={handleBlur}
              className={`
                pr-10
                ${isValid ? "border-green-500 focus:ring-green-500" : ""}
                ${isInvalid ? "border-red-500 focus:ring-red-500" : ""}
              `}
            />
            {isValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            {isInvalid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <X className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="relative">
            <Input
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name, { required: field.required })}
              onBlur={handleBlur}
              className={`
                pr-10
                ${isValid ? "border-green-500 focus:ring-green-500" : ""}
                ${isInvalid ? "border-red-500 focus:ring-red-500" : ""}
              `}
            />
            {isValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            {isInvalid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <X className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      {renderInput()}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message as string}</p>
      )}
    </div>
  );
};
