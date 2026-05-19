import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-cocoa/30 p-3 backdrop-blur-sm sm:place-items-center">
      <section className="w-full max-w-md rounded-lg border-[1.5px] border-line bg-cream p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-cocoa">{title}</h2>
          <Button aria-label="Close" variant="ghost" className="h-10 min-h-10 w-10 px-0" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
