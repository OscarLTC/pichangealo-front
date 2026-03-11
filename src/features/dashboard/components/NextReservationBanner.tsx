import { RotateCcw, Timer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export interface NextReservationData {
  customerName: string;
  time: string;
  field: string;
  sport: string;
  status: string;
  startsInMinutes: number;
}

interface NextReservationBannerProps {
  reservation: NextReservationData;
  onViewDetails?: () => void;
}

export function NextReservationBanner({
  reservation,
  onViewDetails,
}: NextReservationBannerProps) {
  const { customerName, time, field, sport, status, startsInMinutes } =
    reservation;

  return (
    <div className="bg-slate-900 rounded-2xl p-8 text-white flex justify-between items-center relative overflow-hidden shadow-xl">
      <div className="z-10">
        <div className="flex items-center gap-2 text-brand mb-2">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Próxima reserva
          </span>
        </div>

        <h3 className="text-3xl font-bold mb-1">{customerName}</h3>
        <p className="text-slate-400 font-medium">
          {time} • {field} • {sport}
        </p>

        <div className="flex items-center gap-4 mt-6">
          <Badge className="bg-brand/20 text-brand border border-brand/30 rounded-full text-xs font-bold uppercase hover:bg-brand/30">
            {status}
          </Badge>
          <span className="text-slate-300 text-sm flex items-center gap-1.5">
            <Timer className="h-4 w-4" />
            Empieza en {startsInMinutes} min
          </span>
        </div>
      </div>

      <div className="hidden md:block z-10">
        <Button
          variant="outline"
          className="bg-white text-slate-900 hover:bg-slate-100 border-transparent font-bold"
          onClick={onViewDetails}
        >
          Ver detalle
        </Button>
      </div>

      <div className="absolute right-0 top-0 h-full w-1/3 bg-brand/10 -skew-x-12 translate-x-10 pointer-events-none" />
    </div>
  );
}
