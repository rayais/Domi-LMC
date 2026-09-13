import FormationsList from '../components/FormationsList'
import CTA from '../components/CTA'

export default function FormationIndividuelle() {
  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-bg dark:from-primary/10 dark:to-[#1A1A1A]">
        <div className="section-inner text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-4">
            Formations <span className="text-primary">Individuelles</span>
          </h1>
          <p className="text-lg text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Développez vos compétences professionnelles à votre rythme avec nos formations conçues pour les particuliers.
          </p>
        </div>
      </section>
      <FormationsList
        type="intra"
        title=""
        subtitle=""
        grouped={true}
      />
      <CTA />
    </div>
  )
}
