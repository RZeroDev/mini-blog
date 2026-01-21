export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Politique de confidentialité
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Collecte des informations
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous collectons des informations lorsque vous vous inscrivez sur notre site, 
              vous connectez à votre compte, ou interagissez avec notre contenu. Les 
              informations collectées incluent votre nom, votre adresse e-mail, et d'autres 
              données nécessaires au fonctionnement du service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Utilisation des informations
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les informations que nous collectons auprès de vous peuvent être utilisées 
              pour personnaliser votre expérience, améliorer notre site web, améliorer le 
              service client, et vous envoyer des emails périodiques concernant votre 
              compte ou d'autres produits et services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Protection des informations
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre diverses mesures de sécurité pour préserver la 
              sécurité de vos informations personnelles. Nous utilisons un cryptage à la 
              pointe de la technologie pour protéger les informations sensibles transmises 
              en ligne.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous utilisons des cookies pour comprendre et enregistrer vos préférences 
              pour de futures visites et compiler des données agrégées sur le trafic du 
              site et l'interaction sur le site afin que nous puissions offrir de 
              meilleures expériences et outils à l'avenir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Divulgation à des tiers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous ne vendons, n'échangeons et ne transférons pas vos informations 
              personnelles identifiables à des tiers. Cela ne comprend pas les tierces 
              parties de confiance qui nous aident à exploiter notre site web ou à mener 
              nos affaires, tant que ces parties conviennent de garder ces informations 
              confidentielles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Consentement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En utilisant notre site, vous consentez à notre politique de confidentialité.
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
