"use client";
/* Shares choices between the packages, tabs, quote builder and contact form. */
import { createContext, useContext, useState } from "react";

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [service, setService] = useState("showcase"); // the option picked in the quote builder
  const [plan, setPlan] = useState(null);             // the quote attached to the contact form
  const [role, setRole] = useState("");               // "I am a…" on the contact form
  return (
    <QuoteContext.Provider value={{ service, setService, plan, setPlan, role, setRole }}>
      {children}
    </QuoteContext.Provider>
  );
}

export const useQuote = () => useContext(QuoteContext);
