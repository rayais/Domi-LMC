import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="section-inner text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
          Prêt à développer vos compétences ?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Contactez-nous dès maintenant pour discuter de vos besoins en formation et obtenir un devis personnalisé.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors no-underline">
            Demander un devis
          </Link>
          <Link to="/formation-societe" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors no-underline">
            Voir nos formations
          </Link>
        </div>
      </div>
    </section>
  )
}
