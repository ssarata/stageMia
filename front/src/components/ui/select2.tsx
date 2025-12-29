import Select, { Props as SelectProps, StylesConfig } from "react-select";
import { useTheme } from "@/components/providers/theme-provider";

interface Select2Props extends Omit<SelectProps, "styles"> {
  error?: boolean;
}

export const Select2 = ({ error, ...props }: Select2Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const customStyles: StylesConfig = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)",
      borderColor: error
        ? "hsl(0 84.2% 60.2%)"
        : state.isFocused
        ? isDark
          ? "hsl(217.2 91.2% 59.8%)"
          : "hsl(221.2 83.2% 53.3%)"
        : isDark
        ? "hsl(217.2 32.6% 17.5%)"
        : "hsl(214.3 31.8% 91.4%)",
      boxShadow: state.isFocused
        ? error
          ? "0 0 0 1px hsl(0 84.2% 60.2%)"
          : isDark
          ? "0 0 0 1px hsl(217.2 91.2% 59.8%)"
          : "0 0 0 1px hsl(221.2 83.2% 53.3%)"
        : "none",
      "&:hover": {
        borderColor: error
          ? "hsl(0 84.2% 60.2%)"
          : isDark
          ? "hsl(217.2 32.6% 17.5%)"
          : "hsl(214.3 31.8% 91.4%)",
      },
      minHeight: "40px",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)",
      border: isDark
        ? "1px solid hsl(217.2 32.6% 17.5%)"
        : "1px solid hsl(214.3 31.8% 91.4%)",
      borderRadius: "0.375rem",
      boxShadow: isDark
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 50,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? isDark
          ? "hsl(217.2 91.2% 59.8%)"
          : "hsl(221.2 83.2% 53.3%)"
        : state.isFocused
        ? isDark
          ? "hsl(217.2 32.6% 17.5%)"
          : "hsl(210 40% 96.1%)"
        : "transparent",
      color: state.isSelected
        ? "hsl(210 40% 98%)"
        : isDark
        ? "hsl(210 40% 98%)"
        : "hsl(222.2 84% 4.9%)",
      cursor: "pointer",
      fontSize: "0.875rem",
      borderRadius: "0.25rem",
      margin: "2px 0",
      "&:active": {
        backgroundColor: isDark
          ? "hsl(217.2 91.2% 59.8%)"
          : "hsl(221.2 83.2% 53.3%)",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
      fontSize: "0.875rem",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark
        ? "hsl(217.2 32.6% 17.5%)"
        : "hsl(210 40% 96.1%)",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
      "&:hover": {
        backgroundColor: isDark
          ? "hsl(0 84.2% 60.2%)"
          : "hsl(0 84.2% 60.2%)",
        color: "hsl(210 40% 98%)",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "hsl(215.4 16.3% 46.9%)" : "hsl(215.4 16.3% 46.9%)",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
      fontSize: "0.875rem",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: isDark
        ? "hsl(217.2 32.6% 17.5%)"
        : "hsl(214.3 31.8% 91.4%)",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? "hsl(215.4 16.3% 46.9%)" : "hsl(215.4 16.3% 46.9%)",
      "&:hover": {
        color: isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: isDark ? "hsl(215.4 16.3% 46.9%)" : "hsl(215.4 16.3% 46.9%)",
      "&:hover": {
        color: isDark ? "hsl(0 84.2% 60.2%)" : "hsl(0 84.2% 60.2%)",
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: isDark ? "hsl(215.4 16.3% 46.9%)" : "hsl(215.4 16.3% 46.9%)",
      fontSize: "0.875rem",
    }),
    loadingMessage: (base) => ({
      ...base,
      color: isDark ? "hsl(215.4 16.3% 46.9%)" : "hsl(215.4 16.3% 46.9%)",
      fontSize: "0.875rem",
    }),
  };

  return (
    <Select
      {...props}
      styles={customStyles}
      classNamePrefix="react-select"
      noOptionsMessage={() => "Aucune option disponible"}
      loadingMessage={() => "Chargement..."}
    />
  );
};
