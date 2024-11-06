"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabListProps {
  tabs: {
    label: string;
    value: string;
  }[];
  className?: string;
}

interface TabSectionProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs = ({
  defaultValue,
  onChange,
  children,
  className,
}: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ tabs, className }: TabListProps) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabList must be used within Tabs");

  const { activeTab, setActiveTab } = context;

  return (
    <div className={cn("border-b border-gray-200 w-full", className)}>
      <div className="flex w-full">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "pb-4 relative  font-semibold transition-colors flex-1",
              "hover:text-gray-900",
              activeTab === tab.value
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4AC2A1]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const TabSection = ({ value, children }: TabSectionProps) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabSection must be used within Tabs");

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <div className="mt-4">{children}</div>;
};

// Attach components to Tabs
Tabs.List = TabList;
Tabs.Section = TabSection;
