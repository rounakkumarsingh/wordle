// src/components/game/GameFilters.tsx
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type DateRange = "7days" | "30days" | "90days" | "all";

export function GameFilters({
    onFilterChange,
}: {
    onFilterChange: (range: DateRange) => void;
}) {
    const [selected, setSelected] = useState<DateRange>("all");

    const handleSelect = (range: DateRange) => {
        setSelected(range);
        onFilterChange(range);
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="px-4 py-2 bg-white rounded-md shadow">
                Filter: {selected === "all" ? "All Time" : selected}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1">
                <DropdownMenu.Item
                    onClick={() => handleSelect("7days")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    Last 7 Days
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => handleSelect("30days")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    Last 30 Days
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => handleSelect("90days")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    Last 90 Days
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => handleSelect("all")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    All Time
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
