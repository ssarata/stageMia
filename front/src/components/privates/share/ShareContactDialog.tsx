import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShareContact, useGenerateShareLink } from "@/hooks/private/shareHook";
import { type Contact } from "@/interfaces/interfaceTable";
import { Share2, Mail, MessageCircle, Send, Facebook, Linkedin, Instagram } from "lucide-react";
import toast from "react-hot-toast";

interface ShareContactDialogProps {
  contact: Contact;
  open: boolean;
  onClose: () => void;
}

export const ShareContactDialog = ({ contact, open, onClose }: ShareContactDialogProps) => {
  const [recipientEmail, setRecipientEmail] = useState("");

  const shareContact = useShareContact();
  const generateLink = useGenerateShareLink();

  const handleEmailShare = () => {
    if (!recipientEmail) {
      toast.error("Entrez une adresse email");
      return;
    }

    // Envoyer l'email via le backend (Resend)
    shareContact.mutate({
      contactId: contact.id,
      recipientEmail,
      platform: "email"
    }, {
      onSuccess: () => {
        toast.success("Contact envoyé par email avec succès");
        setRecipientEmail("");
        onClose();
      },
      onError: (error: any) => {
        const message = error.response?.data?.error || "Erreur lors de l'envoi de l'email";
        toast.error(message);
      }
    });
  };

  const handleSocialShare = (platform: string) => {
    const contactText = `${contact.prenom} ${contact.nom}\nTéléphone: ${contact.telephone}${contact.email ? `\nEmail: ${contact.email}` : ''}${contact.organisation ? `\nOrganisation: ${contact.organisation}` : ''}`;

    let shareUrl = '';

    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(contactText)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(contactText)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(contactText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(contactText);
        toast.success("Informations copiées ! Collez-les dans Instagram");
        return;
    }

    // Enregistrer le partage dans le backend
    generateLink.mutate({
      contactId: contact.id,
      platform
    });

    // Ouvrir l'application
    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager le contact
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-accent rounded-lg">
            <p className="font-medium">{contact.prenom} {contact.nom}</p>
            <p className="text-sm text-muted-foreground">{contact.telephone}</p>
          </div>

          <Tabs defaultValue="email">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="social">
                <Share2 className="h-4 w-4 mr-1" />
                Social
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="destinataire@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleEmailShare} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer par email
              </Button>
            </TabsContent>

            <TabsContent value="social" className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialShare("whatsapp")}
              >
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialShare("telegram")}
              >
                <Send className="h-4 w-4 mr-2 text-blue-500" />
                Telegram
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialShare("facebook")}
              >
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialShare("linkedin")}
              >
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialShare("instagram")}
              >
                <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                Instagram (copier le texte)
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
