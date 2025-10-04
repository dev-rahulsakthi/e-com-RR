import { Tabs, TabsList, TabsTrigger } from "@/src/app/ui/components/ui/tabs";
import { useState } from "react";

interface TabsProps {
  tabsName: string[];
  onTab1?: (value : string) => void;
  onTab2?: (value : string) => void;
  onTab3?: (value : string) => void;
  onTab4?: (value : string) => void;
  onTab5?: (value : string) => void;
  defaultValue?: string;
  className?: string;
}

export function NewTabs({ 
  tabsName, 
  onTab1, 
  onTab2, 
  onTab3, 
  onTab4,
  onTab5,
  defaultValue,
  className 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || "tab1");

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Map tab values to their respective handlers
    const handlerMap: { [key: string]: ((value : string) => void) | undefined } = {
      "tab1": onTab1,
      "tab2": onTab2, 
      "tab3": onTab3,
      "tab4": onTab4,
      "tab5": onTab5
    };

    const handler = handlerMap[value];
    if (handler) {
      handler(value);
    }
  };

  if (!tabsName || tabsName.length === 0) {
    return null;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={`w-full ${className || ""}`}
    >
      <TabsList>
        {tabsName.map((name, index) => (
          <TabsTrigger 
            key={`tab${index + 1}`} 
            value={`tab${index + 1}`}
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}