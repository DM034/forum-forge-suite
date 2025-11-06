import { Calendar, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  emoji: string;
  dateNumber: string;
  month: string;
}

const EventCard = ({ title, date, time, location, emoji, dateNumber, month }: EventCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Upcoming event</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-card-foreground">{dateNumber}</div>
          <div className="text-xs text-muted-foreground uppercase">{month}</div>
        </div>

        <div className="flex-1">
          <div className="text-2xl mb-2">{emoji}</div>
          <h4 className="font-semibold text-card-foreground mb-2">{title}</h4>
          <p className="text-xs text-muted-foreground mb-1">{date}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm font-medium">Details</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        Visit event
      </Button>
    </div>
  );
};

export default EventCard;
