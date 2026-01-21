import { Link } from "react-router-dom";
import {
  IconTarget,
  IconUsers,
  IconHeart,
  IconBulb,
} from "@tabler/icons-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À propos de Mini Blog
          </h1>
          <p className="text-xl text-gray-600">
            Votre plateforme de blogging professionnelle pour partager et
            découvrir des contenus de qualité
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Notre Mission
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Mini Blog est né de la volonté de créer un espace où chacun
                peut partager ses idées, ses passions et ses connaissances avec
                une communauté engagée et bienveillante.
              </p>
              <p>
                Nous croyons que chaque histoire mérite d'être racontée et que
                le partage de connaissances enrichit notre communauté. Notre
                plateforme offre les outils nécessaires pour créer, publier et
                gérer du contenu de qualité facilement.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Nos Valeurs
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconTarget className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  Nous nous efforçons de fournir une plateforme de haute
                  qualité avec des fonctionnalités modernes et une expérience
                  utilisateur exceptionnelle.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconUsers className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Communauté
                </h3>
                <p className="text-gray-600">
                  Nous valorisons notre communauté d'auteurs et de lecteurs, en
                  favorisant les échanges constructifs et le respect mutuel.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconHeart className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Passion
                </h3>
                <p className="text-gray-600">
                  Nous sommes passionnés par le blogging et nous mettons tout
                  en œuvre pour aider nos utilisateurs à exprimer leur
                  créativité.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <IconBulb className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  Nous innovons constamment pour offrir de nouvelles
                  fonctionnalités et améliorer l'expérience de nos
                  utilisateurs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez notre communauté
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Commencez à partager vos histoires dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-900 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border-2 border-white hover:bg-white hover:text-gray-900 rounded-lg transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
