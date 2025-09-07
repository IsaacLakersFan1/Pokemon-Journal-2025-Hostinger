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

interface CreatePokemonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newPokemon: Pokemon) => void;
}

export function CreatePokemonForm({ isOpen, onClose, onCreate }: CreatePokemonFormProps) {
  const [formData, setFormData] = useState({
    nationalDex: "",
    name: "",
    form: "",
    type1: "",
    type2: "",
    hp: "",
    attack: "",
    defense: "",
    specialAttack: "",
    specialDefense: "",
    speed: "",
    generation: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToastSuccess } = toastSuccess();
  const { showToastError } = toastError();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const total =
        parseInt(formData.hp || "0") +
        parseInt(formData.attack || "0") +
        parseInt(formData.defense || "0") +
        parseInt(formData.specialAttack || "0") +
        parseInt(formData.specialDefense || "0") +
        parseInt(formData.speed || "0");

      const payload = new FormData();
      payload.append("nationalDex", formData.nationalDex);
      payload.append("name", formData.name);
      payload.append("form", formData.form);
      payload.append("type1", formData.type1);
      payload.append("type2", formData.type2 === "none" ? "" : formData.type2 || "");
      payload.append("hp", formData.hp);
      payload.append("attack", formData.attack);
      payload.append("defense", formData.defense);
      payload.append("specialAttack", formData.specialAttack);
      payload.append("specialDefense", formData.specialDefense);
      payload.append("speed", formData.speed);
      payload.append("generation", formData.generation);
      payload.append("total", String(total));
      if (image) payload.append("image", image);

      const response = await axios.post(`${API_URL}/api/pokemon`, payload, {
        withCredentials: true,
      });

      if (response.status === 201) {
        showToastSuccess("Pokémon creado exitosamente!");
        onCreate(response.data.pokemon);
        onClose();
        // Reset form
        setFormData({
          nationalDex: "",
          name: "",
          form: "",
          type1: "",
          type2: "",
          hp: "",
          attack: "",
          defense: "",
          specialAttack: "",
          specialDefense: "",
          speed: "",
          generation: "",
        });
        setImage(null);
      } else {
        showToastError(response.data.message || "Error al crear Pokémon.");
      }
    } catch (error: any) {
      console.error("Error creating Pokémon:", error);
      showToastError("Error al crear Pokémon.");
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
          <DialogTitle className="text-2xl font-bold text-center">Crear Nuevo Pokémon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nombre del Pokémon"
            />
          </div>

          {/* National Dex */}
          <div className="space-y-2">
            <Label htmlFor="nationalDex">National Dex</Label>
            <Input
              id="nationalDex"
              type="number"
              value={formData.nationalDex}
              onChange={(e) => handleChange("nationalDex", e.target.value)}
              placeholder="Número de Pokédex Nacional"
            />
          </div>

          {/* Form */}
          <div className="space-y-2">
            <Label htmlFor="form">Forma</Label>
            <Input
              id="form"
              value={formData.form}
              onChange={(e) => handleChange("form", e.target.value)}
              placeholder="Forma del Pokémon (opcional)"
            />
          </div>

          {/* Types */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type1">Tipo 1</Label>
              <Select value={formData.type1} onValueChange={(value) => handleChange("type1", value)}>
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
              <Label htmlFor="type2">Tipo 2 (Opcional)</Label>
              <Select value={formData.type2} onValueChange={(value) => handleChange("type2", value)}>
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
              {(["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"] as const).map((stat) => (
                <div key={stat} className="space-y-1">
                  <Label htmlFor={stat} className="text-sm">
                    {stat.toUpperCase()}
                  </Label>
                  <Input
                    id={stat}
                    type="number"
                    value={formData[stat]}
                    onChange={(e) => handleChange(stat, e.target.value)}
                    placeholder={stat.toUpperCase()}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Generation */}
          <div className="space-y-2">
            <Label htmlFor="generation">Generación</Label>
            <Input
              id="generation"
              type="number"
              value={formData.generation}
              onChange={(e) => handleChange("generation", e.target.value)}
              placeholder="Generación"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <Input
              id="image"
              type="file"
              accept="image/png"
              onChange={handleFileChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Pokémon"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
