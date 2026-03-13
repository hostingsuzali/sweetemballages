## Guide client – Sweet Emballages

Ce document explique comment utiliser et administrer le site Sweet Emballages.

- **URL du site public**: l’adresse principale de votre site (ex. `https://www.votredomaine.ch`)
- **URL de l’administration**: `https://www.votredomaine.ch/admin`  
  (si vous n’êtes pas connecté, vous serez redirigé vers la page de connexion `…/admin/login`)

> **Important**: gardez vos identifiants d’accès administrateur confidentiels. Ne les partagez qu’avec les personnes de confiance dans votre entreprise.

---

## 1. Connexion à l’espace d’administration

1. Ouvrez votre navigateur (Chrome, Edge ou Firefox de préférence).
2. Allez sur l’URL: `https://www.votredomaine.ch/admin` (ou `/admin/login`).
3. Saisissez:
   - **Adresse email**: l’email administrateur qui vous a été communiqué.
   - **Mot de passe**: le mot de passe qui vous a été transmis ou que vous avez défini.
4. Cliquez sur **« Se connecter »**.

En cas d’erreur de mot de passe:
- Vérifiez l’orthographe de l’email.
- Vérifiez que le verrouillage des majuscules (Caps Lock) n’est pas activé.
- Si le problème persiste, contactez votre prestataire technique pour réinitialiser le mot de passe.

Pour **se déconnecter**, utilisez le bouton **« Déconnexion »** en bas du menu latéral (ou en haut sur mobile).

---

## 2. Vue d’ensemble du tableau de bord admin

Une fois connecté, vous voyez le **menu latéral** avec les sections suivantes:

- **Produits** (`/admin`): gestion du catalogue de produits.
- **Catégories** (`/admin/categories`): gestion des grandes familles de produits.
- **Usages** (`/admin/usages`): gestion des usages / types d’utilisation.
- **Infos contact** (`/admin/contact`): téléphone, email, adresse affichés sur la page Contact et dans le pied de page.
- **Messages** (`/admin/messages`): messages envoyés via le formulaire de contact du site.
- **Devis** (`/admin/devis`): demandes de devis envoyées depuis le site.

Les pastilles chiffrées à droite de **Messages** et **Devis** indiquent le **nombre de nouveaux éléments non lus**.

---

## 3. Gestion du catalogue de produits

Section: **Produits** (`/admin`)

Cette page permet d’ajouter, modifier, rechercher et supprimer des produits.

- **Rechercher un produit**:
  - Utilisez le champ de recherche en haut du tableau.
  - Vous pouvez rechercher par **nom** ou par **catégorie**.

- **Ajouter un produit**:
  1. Cliquez sur **« Ajouter un produit »**.
  2. Remplissez les champs demandés (le libellé exact peut varier, mais en général):
     - **Nom**: nom commercial du produit.
     - **Catégorie**: choisissez une catégorie existante (créée dans la section Catégories).
     - **Dimensions**: ex. « 20 x 30 cm ».
     - **Conditionnement / Packaging**: ex. « Carton de 500 pièces ».
     - **Prix**: montant en CHF.
     - **Unité de prix**: ex. « /1000 pcs », « /carton ».
     - **Personnalisable**: cochez si le produit peut être personnalisé (impression, etc.).
     - **Usages**: sélectionnez un ou plusieurs usages pertinents.
     - **Description**: texte descriptif du produit.
     - **Image**: téléversez une image du produit si le formulaire le propose.
  3. Enregistrez. Le produit apparaît dans la liste et sur le site public.

- **Modifier un produit**:
  1. Dans la liste, cliquez sur l’icône **« Modifier »** (crayon) sur la ligne du produit.
  2. Ajustez les informations nécessaires.
  3. Enregistrez pour mettre à jour le site.

- **Supprimer un produit**:
  1. Cliquez sur l’icône **« Supprimer »** (poubelle).
  2. Confirmez la suppression.

> **Attention**: la suppression est définitive. Ne supprimez un produit que si vous êtes certain de ne plus en avoir besoin.

---

## 4. Gestion des catégories

Section: **Catégories** (`/admin/categories`)

Les catégories servent à organiser les produits (ex: « Sacs », « Boîtes », « Gobelets », etc.).

- **Ajouter une catégorie**: créez une nouvelle famille dans laquelle vous pourrez ranger des produits.
- **Renommer une catégorie**: modifie le libellé visible côté site.
- **Supprimer une catégorie**:
  - Ne supprimez pas une catégorie qui contient encore des produits, sauf si vous savez exactement où ces produits seront reclassés.

Une bonne gestion des catégories aide vos clients à **trouver rapidement les bons produits** sur le site.

---

## 5. Gestion des usages

Section: **Usages** (`/admin/usages`)

Les usages décrivent le **contexte d’utilisation** des produits (ex: « Boulangerie », « Restauration », « Traiteur », etc.).

- Vous pouvez créer, renommer ou supprimer des usages.
- Les usages sont associés aux produits pour faciliter la recherche ou le filtrage.

Comme pour les catégories, évitez de supprimer un usage utilisé par de nombreux produits sans plan de remplacement.

---

## 6. Gestion des informations de contact

Section: **Infos contact** (`/admin/contact`)

Cette section contrôle les informations affichées:
- sur la **page Contact**,
- et dans le **pied de page** du site.

Les champs principaux:
- **Téléphone**: numéro d’appel principal.
- **Horaires (téléphone)**: ex. « Lun–ven, 8h–18h ».
- **Email**: adresse de contact principale.
- **Délai de réponse (email)**: ex. « Réponse sous 24h ouvrées ».
- **Adresse (ligne 1)**: ex. « Route de la Venoge 2 ».
- **Adresse (ligne 2)**: ex. « 1302 Vufflens-la-Ville ».
- **Pays / région**: ex. « Suisse ».

### Modifier les infos de contact

1. Adaptez les valeurs des champs selon vos besoins.
2. Cliquez sur **« Enregistrer »**.
3. Les nouvelles informations sont mises à jour sur la page Contact et dans le pied de page du site.

---

## 7. Gestion des messages (formulaire de contact)

Section: **Messages** (`/admin/messages`)

Cette section regroupe les messages envoyés par le formulaire de **Contact** du site public.

- Chaque message contient généralement:
  - Nom / raison sociale
  - Email
  - Téléphone (facultatif)
  - Message
  - Date et heure d’envoi
- Les nouveaux messages non lus sont comptabilisés dans la pastille au niveau du menu.
- Vous pouvez marquer les messages comme **lus** une fois traités, afin de garder une vue claire de ce qui reste à faire.

> **Bonnes pratiques**: répondez aux messages dans le délai indiqué sur le site (ex. « Réponse sous 24h ouvrées ») pour respecter la promesse client.

---

## 8. Gestion des demandes de devis

Section: **Devis** (`/admin/devis`)

Les clients peuvent demander un devis via la page dédiée sur le site. Toutes ces demandes arrivent ici.

Pour chaque demande de devis, vous verrez typiquement:
- Nom / raison sociale
- Email
- Téléphone (si fourni)
- Message ou détails de la demande
- Date de création

Vous pouvez:
- **Consulter** chaque demande
- Les considérer comme **« traitées »** une fois que vous avez répondu au client (par email ou téléphone)

Les demandes **non lues** sont comptabilisées dans la pastille de la section Devis du menu admin.

---

## 9. Formulaires côté site (ce que voit le client final)

### 9.1. Page Contact

URL: `https://www.votredomaine.ch/contact`

- Affiche les coordonnées que vous avez configurées dans **Infos contact**.
- Propose un **formulaire de contact** pour que les visiteurs envoient des messages.
- Les messages arrivent dans la section **Messages** de l’admin.

### 9.2. Page Devis

URL: `https://www.votredomaine.ch/devis`

- Permet aux clients de faire une demande de devis.
- Les demandes sont listées dans la section **Devis** de l’administration.

---

## 10. Recommandations et bonnes pratiques

- **Navigateur**: utilisez un navigateur moderne (Chrome, Edge, Firefox) à jour.
- **Sécurité**:
  - Ne communiquez pas vos identifiants admin par email non sécurisé.
  - Changez régulièrement votre mot de passe.
  - Déconnectez-vous de l’admin lorsque vous avez terminé.
- **Organisation du catalogue**:
  - Gardez des catégories et usages clairs.
  - Mettez à jour les produits (prix, disponibilité, images) dès que quelque chose change.
- **Support technique**:
  - Pour tout changement technique avancé (hébergement, nom de domaine, email technique, problèmes de base de données ou de connexion Supabase / Prisma), contactez directement votre prestataire technique / développeur.

---

## 11. En cas de problème

Si vous rencontrez l’un des cas suivants:
- Impossible de vous connecter malgré les bons identifiants.
- Erreur visible sur le site (page blanche, message d’erreur).
- Formulaires (Contact / Devis) qui ne semblent plus fonctionner.
- Informations qui ne se mettent pas à jour après modification dans l’admin.

Veuillez:
1. Noter la date et l’heure approximative du problème.
2. Faire une capture d’écran si possible.
3. Contacter votre prestataire technique en fournissant ces éléments (et si possible l’URL exacte de la page concernée).

Cela permettra une résolution plus rapide et efficace.

---

Si vous le souhaitez, ce guide peut être complété avec des captures d’écran personnalisées ou adapté au processus interne de votre entreprise (ex. procédures internes, qui gère quoi, fréquence de mise à jour du catalogue, etc.).

