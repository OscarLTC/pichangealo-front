import { useState } from "react";
import { FieldGrid } from "../components/FieldGrid";
import { FieldCard } from "../components/FieldCard";
import { FieldCreateCard } from "../components/FieldCreateCard";
import { FieldFormModal } from "../components/FieldFormModal";
import { FieldDetailDrawer } from "../components/FieldDetailDrawer";
import type { Field } from "../types/field";
import { MOCK_FIELDS } from "../data/mock";

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  
  // Modal State for Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | undefined>();
  
  // Drawer State for Details
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const handleCreateNew = () => {
    setEditingField(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setIsModalOpen(true);
    setIsDrawerOpen(false); // Make sure to close drawer if opening modal from there
  };

  const handleViewDetail = (field: Field) => {
    setSelectedField(field);
    setIsDrawerOpen(true);
  };

  const handleSaveModal = (data: Partial<Field>) => {
    if (editingField) {
      setFields(fields.map(f => f.id === editingField.id ? { ...f, ...data } as Field : f));
      if (selectedField?.id === editingField.id) {
        setSelectedField({ ...selectedField, ...data } as Field);
      }
    } else {
      setFields([{ 
        ...data, 
        id: Math.random().toString(),
        operationalHint: data.state === 'Activa' ? "Libre ahora" : "Cerrada"
      } as Field, ...fields]);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Canchas</h1>
          <p className="text-muted-foreground mt-1">Inventario operativo de espacios deportivos.</p>
        </div>
      </div>

      {/* Main Grid View */}
      <FieldGrid>
        <FieldCreateCard onClick={handleCreateNew} />
        {fields.map(field => (
          <FieldCard 
            key={field.id} 
            field={field} 
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
          />
        ))}
      </FieldGrid>

      {/* Detail Drawer overlay */}
      <FieldDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        field={selectedField}
        onEdit={handleEdit}
      />

      {/* Create / Edit Modal */}
      <FieldFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingField}
        onSave={handleSaveModal}
      />
    </div>
  );
}
