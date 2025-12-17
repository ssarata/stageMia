import { createFileRoute } from "@tanstack/react-router";
import { WhatsAppLayout } from "@/components/privates/messages/WhatsAppLayout";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard/messages/")({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Card className="h-full overflow-hidden border-0 rounded-none md:rounded-lg md:m-4 md:h-[calc(100vh-6rem)]">
        <WhatsAppLayout />
      </Card>
    </div>
  );
}
