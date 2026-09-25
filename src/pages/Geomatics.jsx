import { motion } from 'framer-motion'
import { TbDatabase, TbGps, TbMap, TbSettings } from 'react-icons/tb'

const pillars = [
  {
    icon: TbGps,
    title: 'Acquisition',
    text: "Levés topographiques, GNSS, drones, imagerie satellitaire et campagnes de terrain pour capter l'information spatiale.",
  },
  {
    icon: TbSettings,
    title: 'Traitement',
    text: 'Géoréférencement, nettoyage, analyse spatiale et modélisation pour transformer les données brutes en information fiable.',
  },
  {
    icon: TbDatabase,
    title: 'Stockage',
    text: 'Bases de données géospatiales (PostGIS, fichiers géoréférencés) structurées pour être interrogeables et réutilisables.',
  },
  {
    icon: TbMap,
    title: 'Restitution',
    text: "Cartographie thématique, atlas, cartes web et tableaux de bord pour rendre l'information lisible et partageable.",
  },
]

const fields = [
  'Urbanisme et aménagement',
  'Environnement',
  'Agriculture',
  'Risques naturels',
  'Mobilité et réseaux',
  'Gestion foncière',
]

export default function Geomatics() {
  return (
    <section id="geomatique" className="relative overflow-hidden scroll-mt-20">
      <div className="relative max-w-3xl mx-auto px-6 py-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="coord-label inline-block text-xs font-semibold text-accent uppercase mb-4"
        >
          Définition
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl font-bold text-secondary mb-6"
        >
          La géomatique, c'est quoi ?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-lg mb-4"
        >
          La géomatique est l'ensemble des sciences, des technologies et des méthodes qui permettent
          d'acquérir, de traiter, de stocker et de restituer des données localisées dans l'espace.
          Elle fait dialoguer la cartographie, la topographie, la télédétection, l'informatique et les
          sciences de la Terre.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-text/70 mb-4"
        >
          Concrètement, la géomaticienne ou le géomaticien transforme les observations du terrain et
          les images satellitaires en informations exploitables : cartes, bases de données, modèles
          d'analyse et outils d'aide à la décision.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-text/60 text-sm mb-12"
        >
          « Géo- » pour la Terre, « -matique » pour les méthodes mathématiques appliquées à la matière
          et à l'espace.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="card-lift bg-white rounded-2xl shadow-sm p-6 border-t-2 border-accent"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary mb-2">
                <pillar.icon className="text-accent" />
                {pillar.title}
              </h3>
              <p className="text-sm text-text/70">{pillar.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-secondary mb-4">Domaines d'application</h2>
          <div className="flex flex-wrap gap-2">
            {fields.map((field) => (
              <span
                key={field}
                className="px-3 py-1 rounded-full bg-accent/30 text-secondary text-sm font-medium"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
