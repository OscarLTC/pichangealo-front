import { Edit2, Image as ImageIcon } from "lucide-react";
import type { Field } from "../types/field";

interface FieldCardProps {
  field: Field;
  onEdit: (field: Field) => void;
  onViewDetail: (field: Field) => void;
}

export function FieldCard({ field, onEdit, onViewDetail }: FieldCardProps) {
  const getStatusBadge = (state: string) => {
    switch(state) {
      case 'Activa':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-emerald-700 backdrop-blur-sm shadow-sm"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Activa</span>;
      case 'Inactiva':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-500 backdrop-blur-sm shadow-sm"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Inactiva</span>;
      case 'Mantenimiento':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-amber-700 backdrop-blur-sm shadow-sm"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Mantenimiento</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={() => onViewDetail(field)}
      className="group flex flex-col bg-card rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(46,234,121,0.15)] transition-all duration-300 overflow-hidden border border-transparent hover:border-brand/30 cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="absolute top-3 right-3 z-10">
          {getStatusBadge(field.state)}
        </div>
        {field.imageUrl ? (
          <div 
            className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" 
            style={{ backgroundImage: `url(${field.imageUrl})` }}
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-foreground leading-tight mb-1">{field.name}</h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <span>{field.type}</span>
              {field.category && <span className="before:content-['•'] before:mx-1">{field.category}</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Base</p>
            <p className="font-bold text-foreground">S/{field.basePrice}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
          </div>
        </div>
        
        <div className="w-full h-px bg-slate-100 dark:bg-slate-700"></div>
        
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="text-xs font-medium text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full max-w-[150px] truncate text-center" title={field.operationalHint}>
            {field.operationalHint}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(field);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-foreground text-xs font-bold transition-colors ml-auto"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
