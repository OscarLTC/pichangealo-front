import { Plus } from "lucide-react";

interface FieldCreateCardProps {
  onClick: () => void;
}

export function FieldCreateCard({ onClick }: FieldCreateCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand hover:bg-brand/5 transition-all duration-300 cursor-pointer"
    >
      <div className="bg-brand/10 rounded-full p-4 mb-4 group-hover:bg-brand/20 transition-colors">
        <Plus className="w-10 h-10 text-brand" />
      </div>
      <h3 className="text-lg font-bold text-foreground">Nueva Cancha</h3>
      <p className="text-muted-foreground text-sm mt-2 text-center px-4">Configura un nuevo espacio deportivo</p>
    </div>
  );
}
