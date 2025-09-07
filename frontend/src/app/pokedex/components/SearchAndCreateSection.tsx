import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SearchAndCreateSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateClick: () => void;
}

export function SearchAndCreateSection({ 
  searchTerm, 
  onSearchChange, 
  onCreateClick 
}: SearchAndCreateSectionProps) {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Button onClick={onCreateClick} className="bg-green-600 hover:bg-green-700">
        <Plus className="h-4 w-4 mr-2" />
        Crear Pokémon
      </Button>
    </div>
  );
}
