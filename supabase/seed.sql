-- Donnees reelles extraites du CV de Marina Birba
-- A coller dans Supabase > SQL Editor (apres schema.sql et storage.sql)
-- Photo, CV (PDF) et images de projets restent a uploader via le dashboard admin

insert into profiles (fullname, title, bio, email, phone)
values (
  'BIRBA Rayimwendé Marina',
  'Géomaticienne',
  'Géomaticienne titulaire d''un Master professionnel en Production et Gestion de l''Information Géospatiale et d''une Licence professionnelle en Aménagement et Développement Durable du Territoire. Solides compétences en cartographie thématique, gestion de bases de données géographiques et collecte de données spatiales. Bonne maîtrise de QGIS et ArcGIS Pro. Rigoureuse, organisée et motivée à appuyer les équipes terrain et les programmes à travers la production de cartes et d''outils SIG conformes aux normes en vigueur.',
  'birbamarina3@gmail.com',
  '+226 64986669 / +226 69953186'
);

insert into experiences (title, company, location, start_date, end_date, description) values
('Stagiaire', 'BUMIGEB – Direction DRGM, Service SIGM', 'Ouagadougou, Burkina Faso', '2025-06-01', null,
 'Mise à jour et contrôle qualité de bases de données géographiques. Intégration et structuration des données géoréférencées. Production de cartes thématiques.'),
('Stagiaire', 'Service du Cadastre et des Travaux Fonciers du Centre', 'Ouagadougou, Burkina Faso', '2023-04-01', '2023-07-01',
 'Traitement des dossiers fonciers et mise à jour et organisation de la base de données cadastrale.'),
('Stagiaire', 'Mairie de Ziniaré – Service Domanial', 'Ziniaré, Burkina Faso', '2022-12-01', '2023-03-01',
 'Mise à jour de la base de données des parcelles loties.'),
('Stagiaire', 'Mairie de Ziniaré – Service Domanial', 'Ziniaré, Burkina Faso', '2021-12-01', '2022-01-01',
 'Mise à jour de la base de données des parcelles loties.'),
('Stagiaire', 'DGUVT – Direction Générale de l''Urbanisme, Viabilisation et Topographie', 'Ouagadougou, Burkina Faso', '2022-07-01', '2022-10-01',
 'Appui aux sessions d''amendement et de validation du SDAU. Évaluation de la mise en œuvre du SDAU de Ziniaré à l''horizon 2030.');

insert into education (degree, institution, country, year) values
('Master Professionnel en Production et Gestion de l''Information Géospatiale', 'AFRIGIST, Ife', 'Nigeria', '2023 – 2024'),
('Licence Professionnelle en Aménagement et Développement Durable du Territoire', 'Centre Universitaire de Ziniaré (CUZ)', 'Burkina Faso', '2020 – 2023');

insert into skills (name, category) values
('QGIS', 'SIG'),
('ArcGIS Pro', 'SIG'),
('ENVI', 'Télédétection'),
('Geomatica', 'Télédétection'),
('GPS', 'Collecte de données'),
('Kobo Collect', 'Collecte de données'),
('Analyse multicritère', 'Analyse spatiale'),
('AHP (Saaty)', 'Analyse spatiale'),
('Word', 'Bureautique'),
('Excel', 'Bureautique'),
('PowerPoint', 'Bureautique');

insert into projects (title, description, project_date) values
('Analyse géospatiale du potentiel en eau souterraine – Oubritenga',
 'Analyse AHP multicritère et production de cartes de potentiel validées par des forages.', '2024-01-01'),
('Dynamique urbaine et implantation de dépotoirs d''ordures – Ziniaré',
 'Analyse d''images satellites. Identification multicritère de sites favorables. Cartographie des zones adaptées à l''implantation de dépotoirs d''ordures.', '2024-01-01'),
('Analyse de la mise en œuvre du SDAU – Commune de Ziniaré (horizon 2030)',
 'État des lieux. Analyse du cadre institutionnel et des ressources mobilisées. Proposition de nouvelle stratégie pour la mise en œuvre des orientations du SDAU de Ziniaré.', '2022-01-01');
