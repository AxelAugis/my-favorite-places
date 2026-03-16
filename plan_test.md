# Plan de Tests - Projet MFP

## 1. Objectifs du Plan
Ce document définit la stratégie pour assurer la qualité logicielle de l'application MFP, en garantissant que les fonctionnalités critiques répondent aux besoins des utilisateurs tout en respectant les enjeux business.

---

## 2. Évaluation des points critiques
Conformément aux principes de ciblage des enjeux, voici le classement des fonctionnalités de MFP:

| Fonctionnalité | Enjeux | Criticité | Justification |
| :--- | :--- | :--- | :--- |
| **Recherche & Géo-guidage** | Client | **Haute** | Service de base : l'impossibilité de trouver un lieu rend l'app inutile
| **Sécurité & Vie privée** | Business | **Haute** | La "vie privée" est l'argument de vente majeur. Un défaut est critique pour l'image. |
| **Monétisation / Réservations** | Business | **Haute** | Impact direct sur le chiffre d'affaires (commissions). |
| **Favoris & Dossiers** | Client | **Moyenne** | Améliore l'expérience mais n'empêche pas l'usage immédiat. |
| **Découverte sociale** | Client | **Basse** | Fonctionnalités secondaires pour le lancement du MVP. |

---

## 3. Stratégie de Test
Pour optimiser la qualité, nous combinons différents types de tests selon les besoins techniques:

* **Tests Unitaires :** Validation des calculs d'itinéraires, des filtres de recherche et de l'anonymisation des données.
* **Tests d'Intégration :** Vérification de la liaison avec les API de cartographie et les flux de réservation partenaires.
* **Tests E2E (End-to-End) :** Scénarios complets (ex: "Un touriste cherche un musée, le filtre par budget et réserve un créneau").
* Potentiellement des **Tests de Charge (selon le succès) :** Vérification de la stabilité lors des pics d'utilisation (ex: événements municipaux).

---

## 4. Critères de réussite
Le déploiement de l'application est conditionné par l'atteinte de ces objectifs:

* **Taux de succès :** 100% de réussite sur les fonctionnalités critiques (Paiement, Recherche, Sécurité).
* **Couverture de code :** Minimum 80% du code, 100% sur ce qui concerne le RGPD.
* **Performance :** Temps de réponse de la recherche inférieur à 1,5 seconde dans des conditions optimales. Doit pouvoir fonctionner en dégradé.

---

## 5. Maintenance et Bonnes Pratiques
* **Automatisation :** Les tests doivent être exécutés automatiquement via la CI avant chaque livraison.
* **Règle d'or :** Aucun test échoué ne doit être contourné ; il doit être corrigé ou le plan de test mis à jour.
* **Évolution :** Le plan de test doit évoluer à chaque phase de la roadmap (Phase 2 et 3).