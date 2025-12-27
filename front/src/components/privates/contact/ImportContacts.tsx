import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, AlertCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface ImportContactsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportContacts = ({ open, onOpenChange }: ImportContactsProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    setWarnings([]);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Vérifier le type de fichier
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setError("Seuls les fichiers Excel (.xls, .xlsx) sont acceptés");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    setError("");
    setSuccess("");
    setWarnings([]);

    if (!file) {
      setError("Veuillez sélectionner un fichier Excel");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = Cookies.get('token');

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contacts/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Afficher les avertissements s'il y en a
      if (response.data.warnings && response.data.warnings.length > 0) {
        setWarnings(response.data.warnings);
      }

      setSuccess(`${response.data.successCount} contact(s) importé(s) avec succès${response.data.errorCount > 0 ? `, ${response.data.errorCount} erreur(s)` : ''}`);
      setFile(null);

      // Rafraîchir la liste des contacts après un délai
      setTimeout(() => {
        onOpenChange(false);
        window.location.reload();
      }, 3000);

    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      setError(error.response?.data?.error || "Une erreur est survenue lors de l'import");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = Cookies.get('token');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/contacts/import/template`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_contacts.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess("Le fichier template a été téléchargé avec succès");

    } catch (error) {
      console.error('Erreur lors du téléchargement du template:', error);
      setError("Impossible de télécharger le template");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Importer des contacts
          </DialogTitle>
          <DialogDescription>
            Importez plusieurs contacts à partir d'un fichier Excel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-1">Avertissements:</p>
                <ul className="list-disc ml-4">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Upload de fichier */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner un fichier Excel
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    .xls ou .xlsx (Max 5MB)
                  </p>
                </div>
              )}
              
            </label>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-800">
              <strong>Format requis:</strong> Le fichier doit contenir les colonnes suivantes:
            </p>
            <ul className="text-xs text-yellow-800 mt-2 space-y-1 ml-4 list-disc">
              <li><strong>nom</strong> (obligatoire)</li>
              <li><strong>telephone</strong> (obligatoire)</li>
              <li><strong>categorie</strong> (obligatoire)</li>
              <li>prenom, email, adresse, fonction, organisation (optionnels)</li>
            </ul>
          </div>

          {/* Bouton d'import */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {uploading ? (
              <>Importation en cours...</>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importer les contacts
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContacts;
