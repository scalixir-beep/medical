RÉPUBLIQUE DU SÉNÉGAL
Un Peuple — Un But — Une Foi
Conception d'une plateforme numérique de gestion
du Dossier Patient Informatisé (DPI)
Étude de cas : Centre Hospitalier Régional
El Hadji Ahmadou Sakhir Ndiéguène de Thiès (CHRASNT)
Établissement Public de Santé de Niveau 2 (EPS2)
Groupe 5 — Swiss UMEF University
Juin 2026
 
Sommaire


 
INTRODUCTION
Le Sénégal s'est engagé depuis plusieurs années dans une dynamique de transformation numérique à travers la Stratégie Sénégal Numérique 2050 (SN2050) et la modernisation progressive de son système de santé. Cette ambition vise à améliorer l'accès aux soins, renforcer la qualité des services de santé et optimiser la gestion des données médicales.
Pour ancrer cette réflexion dans un cas concret, notre étude porte sur un établissement précis : le Centre Hospitalier Régional El Hadji Ahmadou Sakhir Ndiéguène de Thiès (CHRASNT), Établissement Public de Santé de Niveau 2 (EPS2) érigé par le décret n° 2000-1048 du 29 décembre 2000. Situé sur l'Avenue Malick Sy à Thiès, à 70 km de Dakar et au carrefour des principales voies du pays, cet hôpital dispose d'un rayon d'action qui dépasse largement les limites de la région de Thiès.
Présentation de l'établissement support
Le CHRASNT est un hôpital de référence doté d'un plateau technique conséquent : six salles d'opération, une unité de dialyse fonctionnelle, un service d'imagerie médicale (scanner, échographie, radiologie, mammographie), un laboratoire de biologie médicale et d'anatomie pathologique, une maternité enregistrant plus de 4 000 naissances par an, une unité de chimiothérapie (cancers du sein et du col depuis 2015) et un nouveau laboratoire de cathétérisme cardiaque. En février 2026, la première pierre d'une extension R+3 financée par la coopération japonaise (JICA) a été posée afin de moderniser l'établissement.
Malgré ce plateau technique, la gestion des dossiers patients y demeure majoritairement manuelle ou semi-informatisée. Les informations médicales sont dispersées entre les services (consultation, laboratoire, pharmacie, imagerie, hospitalisation), ce qui entraîne :
•	des difficultés d'accès rapide aux informations médicales ;
•	des risques de perte ou de duplication des données ;
•	une faible traçabilité des actes médicaux ;
•	des délais importants dans la prise en charge des patients ;
•	des difficultés de production de statistiques sanitaires fiables.
Ces difficultés ont un coût réel pour l'établissement : de nombreux patients sont encore transférés vers Dakar faute de capacité ou d'information disponible au bon moment, et la direction de l'hôpital — par la voix de sa directrice, Madame Sow — a elle-même exprimé le besoin d'outils modernes pour améliorer les conditions de prise en charge. Le contexte national est par ailleurs favorable, le Plan Stratégique Santé Digitale (PSSD) 2018-2023 du Ministère de la Santé et de l'Action Sociale prévoyant explicitement le déploiement du Dossier Patient Informatisé dans les établissements sénégalais.
Dans ce contexte, la mise en place d'une plateforme numérique intégrée de gestion du dossier patient au CHRASNT apparaît comme une priorité stratégique.
Problématique : Comment concevoir une plateforme numérique centralisée, sécurisée et interopérable permettant d'améliorer la gestion du dossier patient au CHRASNT de Thiès, tout en garantissant la qualité des soins, la continuité du parcours médical et l'efficacité opérationnelle de l'établissement ?
Cette problématique soulève plusieurs enjeux :
•	l'amélioration de la qualité des soins ;
•	la sécurisation des données médicales ;
•	l'interconnexion des services hospitaliers ;
•	l'amélioration de la gouvernance sanitaire ;
•	la production de données fiables pour la prise de décision.
Afin d'y répondre, le présent document s'articule autour de trois axes :
•	les différents acteurs du projet et les approches méthodologiques ;
•	l'organisation de l'équipe projet et la stratégie de communication ;
•	la présentation de la plateforme, la gestion des risques et la valeur ajoutée attendue.
I. Les différents acteurs du projet et les différentes approches
A. Gouvernance et acteurs du projet
La réussite d'un projet repose sur une répartition claire des rôles. Le projet de plateforme de gestion du dossier patient au CHRASNT implique quatre catégories d'acteurs.
1. Acteurs décisionnels et stratégiques
Le Sponsor / Directeur de projet est le garant de la vision stratégique. Ce rôle est assuré par la Direction Générale du CHRASNT (Madame Sow) ou un représentant du Ministère de la Santé et de l'Action Sociale. Il apporte le soutien institutionnel et financier, valide les orientations majeures et arbitre les décisions critiques.
Le Comité de Pilotage (COPIL) est l'instance stratégique de gouvernance composée de la Directrice Générale, du Médecin-Chef, du Responsable du Système d'Information et du Responsable Financier du CHRASNT. Il définit les orientations générales, valide le budget, le périmètre et les délais, et contrôle l'atteinte des objectifs. Il se réunit mensuellement.
2. Acteurs de pilotage et de coordination
La Maîtrise d'Ouvrage (MOA) représente le client, c'est-à-dire le CHRASNT. Elle regroupe la direction médicale et administrative de l'hôpital ainsi que les corps de métier concernés : médecins, infirmiers, personnel administratif, pharmaciens et biologistes. Elle définit les besoins, fixe les objectifs, valide les livrables et décide de l'acceptation finale du produit.
L'Assistance à Maîtrise d'Ouvrage (AMOA) accompagne la MOA dans le cadrage du projet : formalisation des besoins, élaboration des spécifications fonctionnelles et suivi de l'adéquation entre les attentes des équipes médicales et la solution livrée.
Le Comité de Suivi de Projet est l'instance opérationnelle chargée du suivi régulier de l'avancement, de la gestion des risques courants et de la résolution des difficultés rencontrées.
3. Acteurs techniques et opérationnels
La Maîtrise d'Œuvre (MOE) est responsable de la conception et de la réalisation technique de la plateforme. Elle analyse les besoins définis par la MOA, conçoit, développe, teste et corrige la solution. Elle est composée d'un Chef de Projet Agile, d'un Scrum Master, d'un Architecte Logiciel, de développeurs Backend et Frontend, d'un Expert Cybersécurité, d'un UX/UI Designer et de testeurs QA.
L'Assistance à Maîtrise d'Œuvre (AMOE) apporte un appui technique spécialisé en sécurité informatique, protection des données médicales et interopérabilité des systèmes de santé.
Les prestataires externes assurent l'hébergement de la plateforme, l'infrastructure réseau hospitalière et la maintenance technique.
4. Acteurs utilisateurs
Les utilisateurs finaux sont les personnels qui utiliseront la plateforme au quotidien au CHRASNT : médecins, infirmiers, agents d'accueil, agents de facturation, pharmaciens et biologistes. Ils expriment les besoins initiaux, participent aux phases de validation et de recette et assurent l'utilisation effective du produit. Leur implication est essentielle pour garantir que la plateforme réponde aux réalités du terrain — d'autant que l'établissement fait face à un risque de fuite de son personnel vers les structures privées environnantes, ce qui rend l'adhésion des équipes d'autant plus importante.
[ Figure 1 : Schéma de gouvernance du projet — insérer le visuel ]
B. Les différentes approches de projets
Avant de choisir la méthode la plus adaptée, il importe de connaître les différentes approches existantes et de les comparer.
1. L'approche Cascade (Waterfall)
L'approche Cascade réalise le projet de manière linéaire et séquentielle, sans retour en arrière. Simple, structurée et bien documentée, elle reste peu flexible et difficile à faire évoluer une fois lancée. Elle convient aux projets simples et bien définis dès le départ.
2. L'approche Cycle en V
Le Cycle en V associe chaque phase de développement à une phase de test correspondante. Il offre un contrôle qualité élevé, une détection précoce des erreurs et une traçabilité conforme aux normes ISO 10006, mais reste rigide face aux changements. Il est idéal pour les projets critiques exigeant une fiabilité maximale, notamment en santé.
3. L'approche Agile
L'approche Agile repose sur une progression par petites étapes et une collaboration continue avec le client. Très flexible, elle améliore la satisfaction grâce à des livraisons fréquentes et réduit les risques, mais demande une forte implication des équipes et des utilisateurs. Elle est idéale pour les projets numériques innovants et évolutifs.
4. La méthode Scrum
Scrum, variante de l'Agile, organise le travail en sprints courts (généralement deux semaines) à l'issue desquels un incrément fonctionnel est livré. Elle favorise communication, réactivité et amélioration continue, mais nécessite une équipe formée. Elle est particulièrement adaptée au développement logiciel.
5. La méthode Kanban
Kanban repose sur la visualisation des tâches dans un tableau (À faire / En cours / Terminé) pour optimiser le flux de travail. Simple et efficace pour gérer plusieurs tâches en parallèle, elle manque de structure et de planification à long terme. Elle est plutôt utilisée pour la maintenance et le support.
6. L'approche PRINCE2
PRINCE2 est une méthode très structurée définissant clairement rôles, responsabilités et processus. Elle offre un fort contrôle et une excellente traçabilité, mais reste lourde et peu flexible, donc peu adaptée aux projets numériques innovants. Elle convient aux grands projets institutionnels.
7. Tableau comparatif et choix de l'approche retenue
Approche	Flexibilité	Documentation	Implication client	Gestion du changement	Type de projet
Cascade	Faible	Très forte	Faible	Difficile	Projets simples
Cycle en V	Faible	Très forte	Faible	Difficile	Projets critiques
Agile	Très forte	Moyenne	Très forte	Facile	Projets innovants
Scrum	Très forte	Moyenne	Très forte	Très facile	Logiciels
Kanban	Forte	Faible	Moyenne	Facile	Flux continus
PRINCE2	Faible	Très forte	Moyenne	Difficile	Grands projets

Au regard des caractéristiques du projet — un système d'information de santé innovant, des données médicales sensibles, des besoins évolutifs et de fortes contraintes réglementaires — nous avons opté pour une approche hybride combinant le Cycle en V et la méthode Scrum.
Les méthodes Cascade et Cycle en V seules sont trop rigides pour un projet numérique aux besoins évolutifs. PRINCE2 est trop lourde administrativement. Kanban seul ne convient pas à la construction d'un système complexe. L'approche hybride permet de combiner les avantages des deux méthodes les mieux adaptées :
Le Cycle en V est appliqué à la gouvernance du projet, la validation réglementaire, la sécurité des données médicales et la définition de l'architecture technique — autant d'éléments exigeant rigueur et traçabilité.
La méthode Scrum est appliquée au développement de la plateforme, aux tests utilisateurs, aux ajustements fonctionnels et aux livraisons progressives, ce qui permet d'intégrer rapidement les retours des soignants du CHRASNT et d'adapter la solution à leurs besoins réels.
Cette combinaison garantit à la fois la sécurité et la conformité exigées par le secteur de la santé, et la flexibilité nécessaire à un projet numérique innovant.
II. L'organisation de l'équipe
A. Composition et procédé
Nous avons adapté les rôles Scrum pour répartir le travail efficacement :
Product Owner (PO) — Amiin : responsable de la vision du projet, il définit les priorités et gère le backlog produit en collaboration avec les parties prenantes.
Scrum Master (SM) — Rogelle : il suit l'avancement, relance le groupe sur WhatsApp pour éviter les retards et s'assure que toutes les parties s'assemblent correctement.
Équipe de développement : chargée de réaliser les tâches techniques nécessaires à la création de la plateforme.
[ Figure 2 : Les trois rôles de l'équipe Scrum — insérer le visuel ]

[ Figure 3 : Organigramme de l'équipe Scrum — insérer le visuel ]
1. Le procédé Scrum
Le projet adopte une approche adaptative complète, combinant l'itératif et l'incrémental :
Les Sprints : le projet est découpé en cycles de deux semaines ; à la fin de chaque sprint, une version fonctionnelle et testable (un incrément) est livrée.
Le Product Backlog : la liste vivante et évolutive de toutes les fonctionnalités, constamment priorisée selon les retours du terrain.
La méthode MoSCoW permet de planifier les sprints intelligemment :
•	Must (obligatoire) : module d'admission et dossier médical sécurisé (cœur de la V1) ;
•	Should (fortement recommandé) : module de prescription et soins infirmiers ;
•	Could (si possible) : historique des examens de laboratoire ;
•	Won't (pour plus tard) : facturation et interconnexion externe (reportées en V2).
[ Figure 4 : Cycle itératif Agile — du produit au livrable — insérer le visuel ]

[ Figure 5 : Cycle d'un sprint Scrum — 2 semaines — insérer le visuel ]
2. Planning global du projet
Le projet s'étale sur 24 semaines, du 1er juillet 2026 au 15 décembre 2026, découpées en 12 sprints successifs. Le diagramme de Gantt détaillé figure en Annexe 2.
B. Communication interne et externe
Pour éviter les malentendus en travaillant dans l'urgence, nous avons choisi un modèle de communication circulaire : le feed-back (la vérification) permet de s'assurer que tout le monde a bien compris la même chose.
1. Communication interne
La coordination repose sur les quatre rituels officiels de Scrum :
Daily Scrum (WhatsApp) : réunion quotidienne sur le groupe WhatsApp pour synchroniser le travail du jour, partager l'avancement et identifier les blocages.
Sprint Planning : en début de sprint, pour sélectionner les tâches du backlog que l'équipe s'engage à développer.
Sprint Review : en fin de sprint, pour présenter l'incrément aux utilisateurs de l'hôpital et recueillir leurs avis.
Sprint Rétrospective : bilan interne pour analyser le fonctionnement de l'équipe et améliorer les processus du sprint suivant.
L'Obeya Room digitale : notre « salle de pilotage » s'est résumée à un document Google Docs partagé et au groupe WhatsApp, permettant à chacun de suivre l'avancement en temps réel.
2. Communication externe
La communication externe est principalement assurée par le Product Owner, intermédiaire entre l'équipe Scrum et les parties prenantes (utilisateurs, direction de l'hôpital, tutelle).
Le COPIL : instance stratégique qui valide les grandes étapes et veille au respect du Triangle d'Or (Coût, Délai, Qualité).
La Direction du CHRASNT : représentant la Maîtrise d'Ouvrage, pour aligner l'outil sur la stratégie, le budget et l'organisation de l'établissement.
Le Ministère de la Santé et de l'Action Sociale : pour garantir la conformité réglementaire de la plateforme, en cohérence avec le Plan Stratégique Santé Digitale (PSSD).
Recherche de terrain : nous avons aussi porté la casquette d'« enquêteurs », recherchant documents officiels et guides de santé publique pour comprendre les besoins réels des médecins et les règles de sécurité à respecter.
Nous avons retenu cette communication externe pour rester dans une dynamique réelle. Un projet de Dossier Patient Informatisé touche à la sécurité des vies humaines et à la confidentialité des données : il impose une gouvernance rigoureuse combinant rituels de validation officiels (COPIL, Ministère) et écoute permanente des utilisateurs sur le terrain hospitalier.
III. Présentation de la plateforme
Après avoir présenté les acteurs et l'approche méthodologique (Partie I) puis l'organisation de l'équipe (Partie II), cette troisième partie décrit concrètement la solution retenue : ses modules fonctionnels et son architecture, puis la démarche de gestion des risques qui accompagne sa conception.
A. Présentation et modules fonctionnels
1. Présentation générale de la plateforme
La plateforme est une solution numérique centralisée de gestion du dossier patient destinée au CHRASNT de Thiès. Elle regroupe en un point d'accès unique les informations aujourd'hui dispersées entre les services (consultation, hospitalisation, laboratoire, pharmacie, imagerie), afin de fluidifier le parcours du patient et de fiabiliser les données. Conçue selon une approche centrée utilisateur, elle se veut sécurisée, interopérable et évolutive, en cohérence avec la Stratégie Sénégal Numérique 2050.
2. Objectifs de la plateforme
Objectif général : concevoir une plateforme numérique intégrée permettant la gestion sécurisée et centralisée du dossier patient au CHRASNT.
Objectifs spécifiques :
•	digitaliser intégralement le dossier patient ;
•	sécuriser les données médicales sensibles ;
•	réduire les délais de traitement et de recherche de l'information ;
•	améliorer la traçabilité des actes médicaux ;
•	faciliter le reporting et le pilotage de l'activité hospitalière.
3. Périmètre fonctionnel
La délimitation du périmètre garantit des attentes claires entre la MOA et la MOE et prévient toute dérive du projet.
Inclus : gestion du patient, consultation, hospitalisation, pharmacie, laboratoire, facturation.
Exclus : gestion des ressources humaines et comptabilité générale (relevant de systèmes dédiés).
Contraintes : hébergement sécurisé des données, protection des données médicales, conformité réglementaire (lois sur l'hébergement des données de santé).
4. Modules fonctionnels prioritaires
La plateforme s'articule autour de six modules métier couvrant l'ensemble du parcours patient. Chaque module correspond à un ou plusieurs sprints du planning prévisionnel (cf. Annexe 1).
[ Figure 6 : Parcours patient dans la plateforme du CHRASNT — insérer le visuel ]

Module	Fonctionnalités principales
Gestion Patient	Création du dossier · Historique médical · Consultation
Rendez-vous	Prise de rendez-vous · Agenda des médecins
Hospitalisation	Admission · Suivi du séjour · Sortie
Pharmacie	Prescription · Dispensation des médicaments
Laboratoire	Demandes d'analyse · Résultats d'examens
Facturation	Paiement · Prise en charge par l'assurance maladie

5. Architecture technique
La plateforme repose sur une architecture en couches (interface, API, base de données) garantissant performance, sécurité et évolutivité.
Couche	Technologie retenue
Frontend (Web)	ReactJS
Backend (API)	Node.js
Base de données	PostgreSQL
Hébergement	Shipiix

Ces choix se justifient par le contexte : ReactJS offre une interface réactive et moderne ; Node.js fournit une API performante adaptée aux échanges en temps réel ; PostgreSQL, base relationnelle, convient à des données médicales structurées et fortement liées ; l'hébergement est assuré via Shipiix. Des outils complémentaires (Docker, Kubernetes, GitHub, SonarQube) assurent l'industrialisation, le déploiement et la qualité du code.
6. Priorisation du périmètre — Méthode MoSCoW
Le périmètre complet ne pouvant être livré en une seule fois, la méthode MoSCoW permet de prioriser la première version (V1), en cohérence avec le planning des sprints.
Priorité	Fonctionnalités
Must Have	Authentification · Dossier patient (admission + dossier médical) · Consultation
Should Have	Rendez-vous · Pharmacie · Laboratoire
Could Have	Tableaux de bord · Historique des examens
Won't Have (V2)	Facturation · Interconnexion externe et télémédecine

B. Gestion des risques
La gestion d'un dossier patient informatisé touche à la confidentialité des données et à la sécurité des patients. Une démarche structurée est indispensable : identifier les risques, les évaluer, puis définir des mesures d'atténuation et une procédure de gestion de crise.
1. Identification et catégorisation des risques
Risque	Catégorie
Résistance au changement	Humain
Cyberattaque	Sécurité
Retard de développement	Projet
Perte de données	Technique

2. Évaluation des risques
Chaque risque est évalué selon sa probabilité d'occurrence et son impact sur le projet.
Échelle de probabilité : Faible (< 30 %) · Moyenne (30 – 60 %) · Élevée (> 60 %).
Échelle d'impact : Faible (retard mineur) · Moyen (impact sur le planning) · Critique (arrêt du projet).
Cartographie des risques (évaluation de l'équipe) :
Risque	Catégorie	Probabilité	Impact
Résistance au changement	Humain	Moyenne	Moyen
Cyberattaque	Sécurité	Moyenne	Critique
Retard de développement	Projet	Élevée	Moyen
Perte de données	Technique	Faible	Critique

La résistance au changement mérite une attention particulière dans le contexte du CHRASNT : le passage du dossier papier au dossier numérique modifie les habitudes de travail, alors même que l'établissement doit composer avec un risque de fuite de personnel vers le secteur privé.
3. Plan d'atténuation
Risque	Mesure d'atténuation
Résistance au changement	Sensibilisation, conduite du changement et formation des utilisateurs
Cyberattaque	Tests de sécurité réguliers, chiffrement et gestion des accès
Retard de développement	Planification Agile, priorisation MoSCoW et marge par sprint
Perte de données	Sauvegardes automatiques et plan de continuité d'activité

4. Procédure de gestion de crise
En cas d'incident majeur, une procédure en six étapes est appliquée afin de rétablir le service et d'en tirer les enseignements :
1.	détection de l'incident ;
2.	escalade vers les responsables concernés ;
3.	analyse des causes et de l'ampleur ;
4.	correction et rétablissement du service ;
5.	communication aux parties prenantes ;
6.	retour d'expérience et mesures préventives.
C. Valeur ajoutée de la plateforme
La mise en place de cette plateforme apporte une valeur ajoutée significative au CHRASNT, aussi bien pour les équipes soignantes que pour la direction et les patients.
1. Sécurité renforcée des données médicales
La plateforme intègre une gestion rigoureuse des droits d'accès : chaque utilisateur accède uniquement aux informations nécessaires à ses fonctions. Les données médicales sont chiffrées et protégées contre tout accès non autorisé, garantissant la confidentialité des informations des patients et la conformité aux normes de protection des données de santé.
[ Figure 7 : Droits d'accès par profil utilisateur — insérer le visuel ]
2. Continuité des soins entre services
Grâce au dossier patient numérique unique, un médecin des urgences du CHRASNT peut consulter en temps réel les antécédents du patient, ses traitements en cours et ses derniers résultats d'examens, même saisis par un collègue d'un autre service. Cette continuité informationnelle améliore directement la qualité et la rapidité de la prise en charge — un enjeu d'autant plus important que de nombreux patients sont aujourd'hui transférés vers Dakar faute d'information disponible au bon moment.
3. Réduction des erreurs et des pertes de dossiers
La suppression des dossiers papier élimine le risque de perte, de détérioration ou d'égarement d'un dossier médical. La traçabilité complète de chaque acte enregistré réduit les erreurs liées à des informations manquantes ou illisibles, contribuant à une meilleure sécurité des soins — un atout précieux dans un établissement à fort volume d'activité (plus de 4 000 naissances par an et six salles d'opération).
4. Indicateurs de performance (KPIs)
Afin d'évaluer l'efficacité de la plateforme et l'atteinte des objectifs, les indicateurs suivants ont été définis :
Indicateur	Cible
Taux de digitalisation des dossiers patients	95 %
Temps de recherche d'un dossier patient	Moins de 30 secondes
Disponibilité de la plateforme	99,9 %
Taux de satisfaction des utilisateurs	Supérieur à 85 %

Ces indicateurs seront mesurés régulièrement tout au long du projet et après le déploiement, afin d'assurer un suivi continu de la performance.
5. Interopérabilité avec le système national de santé
La plateforme est conçue avec une architecture ouverte permettant, à terme, une connexion avec le système national de santé géré par le Ministère de la Santé et de l'Action Sociale (MSAS). Cette interopérabilité faciliterait les échanges de données entre les niveaux du système de santé sénégalais et s'inscrirait pleinement dans le Plan Stratégique Santé Digitale, contribuant à une meilleure coordination des soins à l'échelle nationale.
CONCLUSION
La conception d'une plateforme numérique de gestion du dossier patient au CHRASNT de Thiès constitue un levier majeur de transformation. Au-delà de la simple dématérialisation des dossiers, cette solution permettra d'améliorer la qualité des soins, de renforcer la sécurité des données de santé, d'optimiser les processus hospitaliers et d'accompagner la modernisation de l'établissement — modernisation déjà engagée avec l'extension R+3 financée par la JICA.
L'adoption d'une approche Agile hybride favorisera l'implication continue des utilisateurs, la maîtrise des risques et l'obtention d'une solution adaptée aux réalités du terrain. Ce projet s'inscrit pleinement dans la stratégie nationale de digitalisation de la santé et dans la vision d'un système sanitaire plus performant, plus accessible et davantage orienté vers le patient.
ANNEXES
Annexe 1 : Planning prévisionnel des sprints
Sprint	Objectif	Durée
Sprint 0	Cadrage et architecture	2 semaines
Sprint 1	Gestion patients	2 semaines
Sprint 2	Consultations	2 semaines
Sprint 3	Rendez-vous	2 semaines
Sprint 4	Hospitalisation	2 semaines
Sprint 5	Laboratoire	2 semaines
Sprint 6	Pharmacie	2 semaines
Sprint 7	Facturation	2 semaines
Sprint 8	Tableaux de bord	2 semaines
Sprint 9	Sécurité et optimisation	2 semaines
Sprint 10	Recette utilisateur	2 semaines
Sprint 11	Déploiement pilote	2 semaines

Annexe 2 : Diagramme de Gantt
[ Figure 8 : Diagramme de Gantt — insérer le visuel ]
Annexe 3 : Backlog produit (extrait)
Epic	User Story	Priorité
Dossier Patient	Créer un dossier patient / Modifier les informations patient	Must Have
Consultation	Consulter l'historique médical / Saisir un diagnostic	Must Have
Rendez-vous	Programmer un rendez-vous	Must Have
Hospitalisation	Admettre un patient dans un service	Must Have
Pharmacie	Générer une ordonnance	Should Have
Laboratoire	Consulter les résultats d'analyse	Should Have
Facturation	Établir une facture de séjour	Should Have
Dashboard	Visualiser les indicateurs / Exporter un rapport statistique	Could Have
Mobile	Consulter un dossier depuis une tablette	Could Have

Annexe 4 : Maquettes
[ Figure 9 : Maquette — Écran de connexion — insérer le visuel ]

[ Figure 10 : Maquette — Tableau de bord direction — insérer le visuel ]
Annexe 5 : Fiche d'identité de l'établissement support (CHRASNT)
Élément	Détail
Nom officiel	Centre Hospitalier Régional El Hadji Ahmadou Sakhir Ndiéguène de Thiès
Sigle	CHRASNT
Statut	Établissement Public de Santé de Niveau 2 (EPS2)
Base juridique	Décret n° 2000-1048 du 29 décembre 2000 ; lois 98-08 et 98-12 du 02 mars 1998
Localisation	Avenue Malick Sy, Thiès Est — à 70 km de Dakar
Plateau technique	6 salles d'opération · dialyse · scanner et imagerie · laboratoire (biologie + anatomie pathologique) · maternité (4 000+ naissances/an) · chimiothérapie · cathétérisme cardiaque
Modernisation	Extension R+3 financée par la JICA (première pierre posée en février 2026)

Annexe 6 : Sources documentaires sur le CHRASNT
7.	Lois 98-08 et 98-12 du 02 mars 1998, République du Sénégal.
8.	Décret n° 2000-1048 du 29 décembre 2000, République du Sénégal.
9.	VFMatch, « Hôpital Régional El Hadji Ahmadou Sakhir Ndiéguène », vfmatch.org (consulté juin 2026).
10.	Site officiel du CHRASNT, chrthies.sn (consulté juin 2026).
11.	ANSD, Recensement 2022, publié par SenePlus, mars 2026.
12.	Abdoul Aziz Ba, « Mise en place d'une application web pour la gestion des patients du service médecine interne au CHRASNT », Université Alioune Diop de Bambey, Licence professionnelle, 2020.
13.	Plan Stratégique Santé Digitale (PSSD) 2018-2023, Ministère de la Santé et de l'Action Sociale du Sénégal.
14.	Thiès Info, « Thiès : l'extension en R+3 qui change la donne pour les patients », février 2026.
15.	Santé Tropicale, « Modernisation du grand hôpital de Thiès », santetropicale.com.
16.	DIMO Santé, « Hôpital Régional El Hadji Amadou Sakhir Ndiéguène », dimomed.com.
