import { UsersList } from "./UsersList";
import { RealtimeChatBox } from "./RealtimeChatBox";
import { useMessageStore } from "@/store/messageStore";

export const WhatsAppLayout = () => {
  const { activeConversation } = useMessageStore();

  return (
    <div className="h-full flex bg-background">
      {/* Liste des utilisateurs (côté gauche) */}
      <div
        className={`${
          activeConversation ? "hidden md:block" : "block"
        } w-full md:w-[400px] border-r flex-shrink-0`}
      >
        <UsersList />
      </div>

      {/* ChatBox Temps Réel (côté droit) */}
      <div
        className={`${
          activeConversation ? "block" : "hidden md:block"
        } flex-1`}
      >
        <RealtimeChatBox />
      </div>
    </div>
  );
};
