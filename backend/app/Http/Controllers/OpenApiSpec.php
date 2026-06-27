<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'EPS2 Dossier Patient — API',
    description: 'API REST pour la gestion des dossiers patients des établissements publics de santé du Sénégal (EPS2). Authentification via Bearer Token (Laravel Sanctum).',
    contact: new OA\Contact(name: 'Support EPS2', email: 'support@eps2.sn'),
    license: new OA\License(name: 'MIT', url: 'https://opensource.org/licenses/MIT'),
)]
#[OA\Server(url: '/api', description: 'Serveur principal')]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Sanctum',
    description: 'Obtenez un token via POST /api/login, puis transmettez-le dans le header : Authorization: Bearer {token}',
)]
#[OA\Tag(name: 'Authentification', description: 'Connexion et création de session')]
#[OA\Tag(name: 'Patients',         description: 'Dossiers patients — création, consultation, recherche')]
#[OA\Tag(name: 'Consultations',    description: 'Consultations médicales (Médecin + Administrateur)')]
#[OA\Tag(name: 'Rendez-vous',      description: 'Planification et suivi des rendez-vous')]
#[OA\Tag(name: 'Utilisateurs',     description: 'Gestion des comptes utilisateurs (Administrateur uniquement)')]
#[OA\Tag(name: 'Tableau de bord',  description: 'KPIs, statistiques et graphiques')]
// ── Schémas réutilisables ──────────────────────────────────────────────────
#[OA\Schema(
    schema: 'Patient',
    properties: [
        new OA\Property(property: 'id',             type: 'integer', example: 1),
        new OA\Property(property: 'code',           type: 'string',  example: 'PAT-0001'),
        new OA\Property(property: 'nom',            type: 'string',  example: 'Diallo'),
        new OA\Property(property: 'prenom',         type: 'string',  example: 'Aminata'),
        new OA\Property(property: 'date_naissance', type: 'string',  format: 'date',   example: '1990-05-12', nullable: true),
        new OA\Property(property: 'sexe',           type: 'string',  enum: ['M', 'F'], example: 'F',          nullable: true),
        new OA\Property(property: 'telephone',      type: 'string',  example: '+221 77 123 45 67',             nullable: true),
        new OA\Property(property: 'adresse',        type: 'string',  example: 'Dakar, Médina',                 nullable: true),
        new OA\Property(property: 'groupe_sanguin', type: 'string',  example: 'O+',                            nullable: true),
        new OA\Property(property: 'created_at',     type: 'string',  format: 'date',   example: '2024-01-15'),
    ],
    type: 'object',
)]
#[OA\Schema(
    schema: 'Consultation',
    properties: [
        new OA\Property(property: 'id',         type: 'integer', example: 1),
        new OA\Property(property: 'patient_id', type: 'integer', example: 1),
        new OA\Property(property: 'date',       type: 'string',  format: 'date', example: '2024-06-10'),
        new OA\Property(property: 'medecin',    type: 'string',  example: 'Dr Fatou Ndiaye'),
        new OA\Property(property: 'motif',      type: 'string',  example: 'Douleur abdominale', nullable: true),
        new OA\Property(property: 'diagnostic', type: 'string',  example: 'Gastrite aiguë',     nullable: true),
        new OA\Property(property: 'traitement', type: 'string',  example: 'Oméprazole 20 mg',   nullable: true),
    ],
    type: 'object',
)]
#[OA\Schema(
    schema: 'RendezVous',
    properties: [
        new OA\Property(property: 'id',         type: 'integer', example: 1),
        new OA\Property(property: 'patient_id', type: 'integer', example: 1),
        new OA\Property(property: 'date',       type: 'string',  format: 'date', example: '2024-07-15'),
        new OA\Property(property: 'heure',      type: 'string',  format: 'time', example: '09:30',              nullable: true),
        new OA\Property(property: 'medecin',    type: 'string',  example: 'Dr Ibrahima Sow',                    nullable: true),
        new OA\Property(property: 'motif',      type: 'string',  example: 'Suivi post-opératoire',              nullable: true),
        new OA\Property(property: 'statut',     type: 'string',  enum: ['Planifié', 'Honoré', 'Annulé'], example: 'Planifié'),
    ],
    type: 'object',
)]
#[OA\Schema(
    schema: 'User',
    properties: [
        new OA\Property(property: 'id',       type: 'integer', example: 1),
        new OA\Property(property: 'username', type: 'string',  example: 'medecin1'),
        new OA\Property(property: 'name',     type: 'string',  example: 'Dr Fatou Ndiaye'),
        new OA\Property(property: 'role',     type: 'string',
            enum: ['Administrateur', 'Médecin', 'Infirmier', 'Accueil', 'Pharmacien', 'Biologiste'],
            example: 'Médecin'),
    ],
    type: 'object',
)]
#[OA\Schema(
    schema: 'ErrorResponse',
    properties: [
        new OA\Property(property: 'error', type: 'string', example: "Message d'erreur"),
    ],
    type: 'object',
)]
class OpenApiSpec {}
