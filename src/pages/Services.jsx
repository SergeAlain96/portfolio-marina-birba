import { motion } from 'framer-motion'
import { TbBriefcase } from 'react-icons/tb'
import { useServices } from '../hooks/useServices'
import AmbientBackground from '../components/AmbientBackground'
import ServiceCard from '../components/ServiceCard'

export default function Services() {
  const { services, loading, error } = useServices()

  return (
    <section id="services" className="relative overflow-hidden bg-background scroll-mt-20">
      <AmbientBackground variant="alt" />
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-center gap-2 text-3xl font-bold text-secondary"
        >
          <TbBriefcase className="text-accent" />
          Mes services
        </motion.h1>
        <p className="text-text/60 mt-2 mb-8 max-w-2xl">
          Des prestations adaptées à vos besoins en cartographie, en analyse spatiale et en gestion de données géographiques.
        </p>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Chargement des services">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 rounded-2xl bg-white/70 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-text/60 shadow-sm">
            Les services seront bientôt disponibles.
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-2xl bg-white p-6 text-sm text-text/60 shadow-sm">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
