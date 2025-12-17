

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
     

      {/* Bas du footer */}
      <div className="border-t border-green-500 mt-10 pt-6 text-center text-green-100 text-sm">
        © {new Date().getFullYear()}MAI-BF— Tous droits
        réservés.
      </div>
    </footer>
  );
};

export default Footer;
