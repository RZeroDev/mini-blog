export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Mentions légales
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Éditeur du site
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Nom du site :</strong> MINI-BLOG</p>
              <p><strong>Propriétaire :</strong> [Nom de votre entreprise]</p>
              <p><strong>Responsable de publication :</strong> [Nom du responsable]</p>
              <p><strong>Email :</strong> contact@mini-blog.com</p>
              <p><strong>Adresse :</strong> [Votre adresse]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Hébergement
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Hébergeur :</strong> [Nom de l'hébergeur]</p>
              <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
              <p><strong>Contact :</strong> [Contact de l'hébergeur]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Propriété intellectuelle
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est 
              protégé par le droit d'auteur. Toute reproduction, représentation, 
              modification, publication, transmission, dénaturation, totale ou partielle 
              du site ou de son contenu, par quelque procédé que ce soit, et sur quelque 
              support que ce soit est interdite sans l'autorisation écrite préalable de 
              MINI-BLOG.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Données personnelles
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée 
              et au Règlement Général sur la Protection des Données (RGPD), vous disposez 
              d'un droit d'accès, de rectification et de suppression des données vous 
              concernant. Pour exercer ce droit, vous pouvez nous contacter à l'adresse : 
              contact@mini-blog.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur. En 
              continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies 
              conformément à notre politique de confidentialité.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Crédits
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Conception et développement :</strong> [Nom du développeur]</p>
              <p><strong>Framework :</strong> React + TypeScript</p>
              <p><strong>Backend :</strong> NestJS + Prisma</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Limitation de responsabilité
            </h2>
            <p className="text-gray-700 leading-relaxed">
              MINI-BLOG s'efforce d'assurer l'exactitude et la mise à jour des informations 
              diffusées sur ce site. Toutefois, MINI-BLOG ne peut garantir l'exactitude, 
              la précision ou l'exhaustivité des informations mises à disposition sur ce site.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
