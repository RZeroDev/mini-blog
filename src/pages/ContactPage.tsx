import { useState } from "react";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconSend,
} from "@tabler/icons-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message envoyé ! Nous vous répondrons bientôt.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600">
            Une question ? Une suggestion ? N'hésitez pas à nous contacter
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconMail className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contact@miniblog.com</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconPhone className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Téléphone
                </h3>
                <p className="text-gray-600">+33 1 23 45 67 89</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconMapPin className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Adresse
                </h3>
                <p className="text-gray-600">
                  123 Avenue des Champs-Élysées
                  <br />
                  75008 Paris, France
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Envoyez-nous un message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Jean Dupont"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jean.dupont@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Objet de votre message"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Écrivez votre message ici..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors"
                  >
                    <IconSend className="h-5 w-5" />
                    Envoyer le message
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
