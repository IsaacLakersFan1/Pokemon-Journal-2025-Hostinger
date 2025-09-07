import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { toastError } from "@/hooks/useToastError";
import { Pokemon } from "../interfaces/Pokedex";
import axios from "axios";
import API_URL from "@/utils/apiConfig";

interface EditPokedexCardProps {
  isOpen: boolean;
  pokemon: Pokemon;
  onUpdate: (updatedPokemon: Pokemon) => void;
  onClose: () => void;
}

export function EditPokedexCard({ isOpen, pokemon, onUpdate, onClose }: EditPokedexCardProps) {
  const [editedPokemon, setEditedPokemon] = useState(pokemon);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToastSuccess } = toastSuccess();
  const { showToastError } = toastError();

  const handleChange = (key: keyof Pokemon, value: string | number) => {
    setEditedPokemon({ ...editedPokemon, [key]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", editedPokemon.name);
      formData.append("form", editedPokemon.form || "");
      formData.append("type1", editedPokemon.type1 || "");
      formData.append("type2", editedPokemon.type2 === "none" ? "" : editedPokemon.type2 || "");
      formData.append("total", editedPokemon.total.toString());
      formData.append("hp", editedPokemon.hp.toString());
      formData.append("attack", editedPokemon.attack.toString());
      formData.append("defense", editedPokemon.defense.toString());
      formData.append("specialAttack", editedPokemon.specialAttack.toString());
      formData.append("specialDefense", editedPokemon.specialDefense.toString());
      formData.append("speed", editedPokemon.speed.toString());
      formData.append("generation", editedPokemon.generation.toString());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        `${API_URL}/api/pokemon/${pokemon.id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        showToastSuccess("Pokémon actualizado exitosamente!");
        onUpdate(response.data.pokemon);
        onClose();
      } else {
        showToastError("Error al actualizar Pokémon.");
      }
    } catch (error: any) {
      console.error("Error updating Pokémon:", error);
      showToastError("Error al actualizar Pokémon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pokemonTypes = [
    "Fire", "Water", "Grass", "Electric", "Bug", "Normal", "Fairy",
    "Fighting", "Psychic", "Ghost", "Dragon", "Dark", "Steel",
    "Ice", "Rock", "Ground", "Flying", "Poison"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Editar {pokemon.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src={`http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${pokemon.image}.png`}
              alt={pokemon.name}
              className="w-24 h-24 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/shadcn.png';
              }}
            />
            <div className="space-y-1">
              <Label htmlFor="image">Nueva Imagen</Label>
              <Input
                id="image"
                type="file"
                accept="image/png"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={editedPokemon.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Form */}
          <div className="space-y-2">
            <Label htmlFor="form">Forma</Label>
            <Input
              id="form"
              value={editedPokemon.form || ""}
              onChange={(e) => handleChange("form", e.target.value)}
            />
          </div>

          {/* Types */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type1">Tipo 1</Label>
              <Select 
                value={editedPokemon.type1 || ""} 
                onValueChange={(value) => handleChange("type1", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Tipo 1" />
                </SelectTrigger>
                <SelectContent>
                  {pokemonTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type2">Tipo 2</Label>
              <Select 
                value={editedPokemon.type2 || "none"} 
                onValueChange={(value) => handleChange("type2", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Tipo 2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {pokemonTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <Label>Estadísticas</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="hp" className="text-sm">HP</Label>
                <Input
                  id="hp"
                  type="number"
                  value={editedPokemon.hp || ""}
                  onChange={(e) => handleChange("hp", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="attack" className="text-sm">Attack</Label>
                <Input
                  id="attack"
                  type="number"
                  value={editedPokemon.attack || ""}
                  onChange={(e) => handleChange("attack", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="defense" className="text-sm">Defense</Label>
                <Input
                  id="defense"
                  type="number"
                  value={editedPokemon.defense || ""}
                  onChange={(e) => handleChange("defense", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="specialAttack" className="text-sm">Special Attack</Label>
                <Input
                  id="specialAttack"
                  type="number"
                  value={editedPokemon.specialAttack || ""}
                  onChange={(e) => handleChange("specialAttack", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="specialDefense" className="text-sm">Special Defense</Label>
                <Input
                  id="specialDefense"
                  type="number"
                  value={editedPokemon.specialDefense || ""}
                  onChange={(e) => handleChange("specialDefense", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="speed" className="text-sm">Speed</Label>
                <Input
                  id="speed"
                  type="number"
                  value={editedPokemon.speed || ""}
                  onChange={(e) => handleChange("speed", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="generation" className="text-sm">Generation</Label>
                <Input
                  id="generation"
                  type="number"
                  value={editedPokemon.generation || ""}
                  onChange={(e) => handleChange("generation", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
