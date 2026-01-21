export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Conditions d'utilisation
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En accédant et en utilisant ce site web, vous acceptez d'être lié par ces 
              conditions d'utilisation, toutes les lois et réglementations applicables, 
              et acceptez que vous êtes responsable du respect des lois locales applicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Licence d'utilisation
            </h2>
            <p className="text-gray-700 leading-relaxed">
              La permission est accordée de télécharger temporairement une copie des 
              documents sur le site web de MINI-BLOG pour un visionnage personnel et non 
              commercial transitoire uniquement. Il s'agit d'une concession de licence, 
              et non d'un transfert de titre.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Restrictions
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Il vous est interdit de :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Modifier ou copier les documents</li>
              <li>Utiliser les documents à des fins commerciales ou pour toute exposition publique</li>
              <li>Tenter de décompiler ou de désosser tout logiciel contenu sur le site web</li>
              <li>Supprimer tout droit d'auteur ou autres notations de propriété des documents</li>
              <li>Transférer les documents à une autre personne ou "miroir" les documents sur tout autre serveur</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Contenu utilisateur
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les utilisateurs peuvent publier, télécharger ou soumettre du contenu au 
              site. Vous conservez la propriété du contenu que vous soumettez, mais vous 
              accordez à MINI-BLOG une licence mondiale, non exclusive, libre de redevances 
              pour utiliser, reproduire et afficher ce contenu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Limitation de responsabilité
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En aucun cas, MINI-BLOG ou ses fournisseurs ne seront responsables de tout 
              dommage (y compris, sans limitation, les dommages pour perte de données ou 
              de profit, ou en raison d'une interruption d'activité) découlant de 
              l'utilisation ou de l'incapacité à utiliser les documents sur le site web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Modifications
            </h2>
            <p className="text-gray-700 leading-relaxed">
              MINI-BLOG peut réviser ces conditions d'utilisation à tout moment sans 
              préavis. En utilisant ce site web, vous acceptez d'être lié par la version 
              actuelle de ces conditions d'utilisation.
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
