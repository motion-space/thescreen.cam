# 1.3.1

- Les cartes d’actions rapides de capture restent utilisables et peuvent toujours être fermées lorsqu’un fond d’écran ou un fichier temporaire est indisponible.

# 1.3.0

- Les commandes de caméra avec objectif 3D sont désormais disponibles par défaut.
- ScreenCam se lance désormais correctement sous macOS 15.
- Les enregistrements d’iPhone capturent désormais le microphone Mac sélectionné.
- Les enregistrements d’iPhone s’ajustent désormais correctement au cadre de l’appareil, y compris l’iPhone 17 Pro, sans fond d’écran, marge ni fine ligne supplémentaire sur les bords.
- Les captures de zone conservent désormais les menus macOS ouverts, ignorent les raccourcis répétés, prennent en charge les très petites sélections et restent fluides pendant le déplacement.

# 1.2.0

- Les clips de zoom expérimentaux avec objectif 3D permettent d'incliner le plan de l'écran, de prévisualiser et déplacer les points de mise au point, de faire la mise au point par double-clic sur le canevas, de régler la profondeur de champ et d'enchaîner fluidement des plans 3D adjacents.
- Les clips avec objectif 3D peuvent ajouter des reflets de verre animés et personnalisables en forme de boîte à lumière, de fenêtre ou de bande lumineuse.
- Les clips de zoom affichent leur courbe d'entrée dans la timeline ; déplacer son ancre permet d'ajuster ou de désactiver l'animation de zoom avant.
- Les aperçus de mise au point avec objectif 3D utilisent la première image du clip de zoom lorsque l'image prévue n'est pas disponible.
- Les sons de clic du curseur distinguent désormais l'appui et le relâchement, en synchronisation avec les clics, les appuis prolongés et les glissements.
- Les sélections de zone et de fenêtre s'affichent désormais de façon fiable pour les enregistrements et les captures d'écran ; terminer une capture ne provoque plus de plantage lors de la fermeture de la sélection ou de l'affichage de la carte d'actions rapides.
- Les captures de fenêtres figées conservent exactement l'image affichée pendant la sélection.
- Les raccourcis de capture restent disponibles pendant l'enregistrement, les commandes d'enregistrement restent cliquables et les raccourcis globaux exigent une combinaison exacte de touches de modification.
- Les annotations de capture prennent désormais en charge des styles de trait pointillé réutilisables, affichent les deux poignées de courbe des lignes et des flèches, verrouillent les traits du stylo et du surligneur dans des directions fixes avec Maj et signalent clairement les sélections à main levée uniquement déplaçables.
- Les clips de la timeline affichent désormais des icônes d’identification et des niveaux de zoom manuels ; faites glisser l’ancre d’entrée d’un zoom avec Commande enfoncée pour régler son niveau.
- Déplacer ou redimensionner un clip de zoom, ou régler son ancre de vitesse d’entrée, ne modifie plus la sélection ; aux limites partagées, les poignées restent également associées au bon clip.
- Les courbes de ressort personnalisées lentes restent désormais fluides jusqu’à la fin dans l’aperçu et l’animation, sans saut vers la position finale.
- Le déplacement et le redimensionnement des clips de zoom restent fluides pendant la mise à jour en direct de leurs courbes et transitions adjacentes.
- La sélection des enregistrements et captures, la modification et l'aperçu rapide des captures, les formes d'onde de zoom des grands projets et l'édition avec objectif 3D répondent désormais plus rapidement.
- Le redimensionnement de la fenêtre de l'éditeur d'enregistrement reste fluide en évitant de reconstruire plusieurs fois les ressources d'aperçu.

# 1.1.3

- Capturez des écrans ou ouvrez des images existantes pour les modifier, avec des raccourcis personnalisés facultatifs, la capture instantanée de l’écran où se trouve le pointeur avec retour visuel et son d’obturateur, la sélection sur écran figé, le nettoyage des fichiers temporaires, des actions rapides, des préréglages d’arrière-plan de capture de fenêtre utilisant le fond d’écran du bureau capturé, des mockups d’appareil, les proportions finales du canevas, le recadrage, les annotations, une progression de copie réactive et des aperçus en direct de la taille et de la qualité d’export jusqu’en 5K.
- Des clips de curseur facultatifs dans la timeline peuvent remplacer le style global du curseur sur n’importe quelle partie d’un enregistrement.
- Les aperçus et exports avec un mockup MacBook ne plantent plus lors du rendu d’une géométrie d’image très petite ou non valide.
- L’aperçu et l’export restent fluides dans les projets comportant de nombreux clips de remplacement du style du curseur.
- Les animations du curseur et l’édition des sous-titres restent réactives dans les enregistrements longs et riches en événements.
- Le démarrage de l’enregistrement de grandes fenêtres utilise moins de mémoire, tandis que les aperçus d’arrière-plan et les téléchargements de packs de curseurs préservent la réactivité de l’éditeur.
- Les cartes d’actions rapides des captures de fenêtre s’affichent désormais avant la fin du rendu de l’arrière-plan en pleine résolution ; le redimensionnement de la fenêtre de l’éditeur de captures réutilise l’aperçu rendu et évite de recomposer le damier de transparence et les ombres décoratives.

# 1.1.2

- Les clips d’enregistrement prennent désormais en charge des vitesses de lecture allant jusqu’à 10×.
- Les enregistrements de fenêtre ne scintillent plus dans les barres latérales translucides ni sur les bords de la fenêtre.
- Les actions d’affichage dans le Finder placent désormais le Finder au premier plan, et les exports rapides reviennent aux actions d’enregistrement après l’affichage du fichier exporté.
- Les sélecteurs de fichiers de projet mémorisent désormais le dernier dossier utilisé pour ouvrir un projet.
- Les packs de styles de curseur se chargent instantanément depuis la bibliothèque locale et peuvent être téléchargés, mis à jour sur place, localisés, renommés en privé, importés, partagés et gérés dans Réglages.
- Créez des packs de curseur à partir d’images recadrées avec suppression automatique de l’arrière-plan et point de clic réglable, prévisualisez-les dans le Finder et profitez d’un rendu cohérent dans les projets et les exports.
- Les packs de curseur créés localement peuvent être proposés au catalogue officiel ouvert via une pull request assistée par un agent.
- La taille du curseur et sa rotation pendant les déplacements offrent désormais des plages de réglage plus étendues.
- La taille du curseur reste cohérente entre l’aperçu de l’éditeur et la vidéo exportée.

# 1.1.1

- Les réglages de sous-titres sont toujours disponibles ; vous pouvez ajouter des sous-titres manuellement et supprimer les clips de sous-titres ou de mots directement depuis leur timeline.
- Les coins de fenêtre détectés automatiquement et les marges des Screens incurvés bénéficient désormais d’un lissage uniforme et cohérent.
- Les clips Zoom peuvent être sélectionnés et redimensionnés de façon fiable, même lorsque la timeline est agrandie.
- Les clips ne scintillent plus lors du zoom de la timeline.
- Le zoom de la timeline et le redimensionnement des clips Zoom restent fluides dans les projets comportant de nombreux clips.

# 1.1.0

- Le mouvement du curseur peut désormais s’incliner légèrement vers la gauche ou la droite, avec un angle maximal réglable.
- Le flou de mouvement de la caméra apparaît et disparaît progressivement autour des déplacements sans adoucir les images fixes de l’aperçu.
- Les aperçus agrandis conservent la netteté du texte source lorsque les mockups utilisent des arrière-plans animés.
- Les déplacements et les appuis prolongés du curseur correspondent désormais entre l’aperçu et l’export, avec une interpolation adaptée à la vitesse et un flou de mouvement adapté au zoom.
- Le rendu du curseur ne provoque plus de plantage avant le premier événement de curseur enregistré.
- Les aperçus après enregistrement s’ouvrent plus fluidement et leur raccourci Espace fonctionne sans autorisation de surveillance des entrées.
- Les arrière-plans personnalisés Screen et mockup prennent désormais en charge les vidéos en boucle fluide avec une vitesse réglable de 0,1× à 2× dans l’aperçu et l’export.
- ScreenCam cible désormais exclusivement les Mac avec puce Apple, ce qui réduit considérablement la taille d’installation.
- Les arrière-plans vidéo personnalisés en haute résolution restent fluides, se chargent de manière fiable dans les aperçus en pause lorsque le système est sollicité et s’exportent beaucoup plus rapidement.
- Les exports partiels conservent les arrière-plans vidéo à la bonne position sur la timeline.
- L’aperçu de lecture garde le mouvement du curseur synchronisé, tandis que le zoom et la caméra restent fluides lors des changements de vitesse.
- Les boutons de format et de recadrage du canevas ne déplacent plus la fenêtre de l’éditeur.
- Les clips de zoom manuels restent stables jusqu’à la fin du dézoom, même lorsque le point focal est proche d’un bord.
- Les réglages d’ombre utilisent désormais des pavés bidimensionnels haptiques dont la direction, le décalage, le flou et l’intensité s’adaptent à la taille de l’image ; même avec un décalage important, les ombres restent douces au lieu de devenir des aplats noirs.
- Les réglages de fenêtre permettent désormais d’ajuster le lissage des coins ainsi que l’épaisseur et la couleur de la bordure, sans modifier la géométrie du contenu capturé et en conservant des bords nets à tous les niveaux de zoom.
- Les cadres Screen conservent des coins lisses, des bords nets et des ombres visibles sur les arrière-plans clairs.
- Quick Focus ajoute des raccourcis personnalisables, un zoom verrouillé interactif avec navigation par poussée sur les bords et changement de niveau fluide, ainsi qu’un rendu ProMotion optionnel jusqu’à 120 Hz.
- Les curseurs personnalisés, les champs numériques déplaçables et les interactions précises de l’éditeur offrent désormais un retour haptique du trackpad.
- Les superpositions de clavier affichent la bonne touche de base et maintiennent les appuis prolongés jusqu’au premier relâchement correspondant.
- Les exports avec mixage audio conservent la vidéo rendue sans réencodage supplémentaire et n’échouent plus lorsqu’une piste audio enregistrée est désactivée.
- La barre d’enregistrement reste sur le bon écran lorsque plusieurs moniteurs sont disposés verticalement.
- Les clips de zoom manuels utilisent désormais un seul centre et niveau de zoom, avec la mini-carte dans les réglages du clip.
- Les clips de zoom adjacents se déplacent et changent désormais d’échelle ensemble, sans fusionner ni revenir à 1x.
- Les aperçus agrandis préservent les détails de la source, quelle que soit la taille de la fenêtre de l’éditeur.
- Les aperçus au survol de la timeline restent fluides en traversant les limites des clips de zoom.

# 1.0.9

- Les ancres de zoom manuelles utilisent désormais des commandes de canevas 1:1 plus réactives avec une mini-carte alignée sur le rendu.
- Les préréglages conservent les arrière-plans et fonds d’écran personnalisés entre les projets, les redémarrages et le partage.
- Les aperçus agrandis gardent le texte source net dans les fenêtres d’éditeur plus petites.
- Les maquettes d'écran générique peuvent ajuster la taille de bordure, les rayons d'angle internes et externes, le style du pied et sa taille.
- Les exports vérifient maintenant l’espace disque disponible avant le rendu pour éviter les échecs tardifs.
- Les enregistrements d’écran et d’iPhone à fréquence d’images élevée préservent la réactivité audio tout en réduisant les images redondantes mises en file d’attente et rendues.
- Les exports vidéo, GIF et Live Photo rognés commencent le décodage près de la plage sélectionnée, tandis que les modifications audio seules peuvent réutiliser la vidéo déjà rendue.
- L’aperçu, la timeline, le curseur, la forme d’onde, les sous-titres, la superposition caméra et le traitement du projet utilisent des caches limités et du travail partagé pour fluidifier les enregistrements longs.
- Les exports GIF et parallèles utilisent des pipelines limités et une répartition plus équitable des ressources pour réduire les conflits.
- Les aperçus au survol de la timeline ne reviennent plus à l'image de la tête de lecture lors d'un déplacement vertical entre les clips.
- Faire glisser la tête de lecture de la timeline pendant la lecture met la lecture en pause, puis la reprend au relâchement.
- Les curseurs de survol, les têtes de lecture de scrub et les libellés de règle de la timeline restent plus réactifs pendant les actualisations d'aperçu, la lecture et les limites de zoom.

# 1.0.8

- Les enregistrements peuvent se terminer dans une carte d'action rapide flottante avec des vignettes d'aperçu rendues, un aperçu de relecture depuis le début, des actions d'édition, de préréglage, d'exportation, de sauvegarde, de sauvegarde à la source et de brouillon.
- La suppression de l’arrière-plan de l’appareil photo prend en charge le style des autocollants mis en cache avec un aperçu réglable du contour, de l’ombre et du cadre à l’échelle du portrait.
- Les paramètres d'apparence peuvent faire basculer l'éditeur, les panneaux d'inspecteur, les surfaces d'exportation, la barre d'outils d'enregistrement, les info-bulles et les aperçus de matériaux entre les modes sombre, clair et automatique.
- Les paramètres de langue de l’app prennent désormais en charge le chinois traditionnel, l’espagnol, le français, le portugais du Brésil et l’italien.
- Les superpositions de caméra prennent en charge davantage de formats d'image, la suppression de l'arrière-plan avec progression en ligne, le mode portrait transparent, les arrière-plans d'images personnalisés et la copie des paramètres en un clic dans chaque clip de caméra.
- Les cartes d'action rapide se cachent pendant la sélection de capture, reviennent après l'enregistrement ou l'annulation, suivent l'affichage actif et gardent chaque carte visible cliquable.
- Les superpositions transparentes de caméra portrait s'exportent correctement, les modifications d'arrière-plan dégradé actualisent immédiatement l'aperçu, les ancres de zoom manuel restent visibles, le glissement de la saisie numérique reste stable sur les bords de l'écran et l'écran d'achat suit l'apparence sélectionnée.

# 1.0.7

- Les sous-titres prennent en charge la transcription par le fournisseur et le modèle local, les segments de lecture modifiables, la visibilité par légende, le style prédéfini et les arrière-plans d'exportation plus propres.
- Les arrière-plans de légende prennent en charge les matériaux flous et en verre liquide avec un flou, une saturation, un style de verre et une teinte réglables.
- Les superpositions de caméra prennent en charge la douceur des coins réglable et un style carré par défaut plus doux.
- Les calques d'effet sont désormais nommés Annotation dans tout l'éditeur.
- Les paramètres de l'éditeur peuvent réorganiser et masquer les entrées de fonctionnalités, avec Animation, Clavier et Beauté masqués par défaut et des entrées masquées supplémentaires collectées sous More.
- Les enregistrements attendent les entrées audio de l'écran, du microphone et du système activés avant d'écrire des médias, et les side-cars audio retardés restent alignés dans l'aperçu, l'exportation, les clips de la chronologie et les formes d'onde.
- Le nettoyage de la caméra après les premiers échecs d'enregistrement ne plante plus, et les échecs d'écriture avec un stockage insuffisant conservent les supports récupérables avec un avertissement clair.
- Les touches du clavier désactivées restent masquées après la réouverture des projets, y compris l'aperçu et l'exportation.
- L'ouverture et les exportations de Project restituent les images vidéo initiales de manière fiable, et les groupes de sous-titres et de chronologie denses se séparent correctement après un zoom plus profond.
- Les curseurs de survol de la chronologie, les têtes de lecture de défilement et l'ancrage du zoom restent stables pendant la lecture, le glissement, le défilement et le zoom.
- La transcription des sous-titres à distance télécharge de l'audio temporaire optimisé pour réduire la taille de la demande et respecter plus tôt les limites de taille de fichier du fournisseur.
- Les aperçus de superposition de caméra, les pistes de chronologie denses et l'édition des segments de légende sont plus réactifs sur les enregistrements longs.

# 1.0.6

- Les enregistrements peuvent être suspendus et repris à partir de la barre d'outils, de la barre de menus ou de CLI, le temps de pause étant omis de l'espace de travail enregistré.
- Les calques d’effets d’image peuvent apparaître et disparaître en fondu ou ignorer les animations d’entrée et de sortie.
- Le titre de l'en-tête de l'éditeur ouvre les options de l'espace de travail pour renommer et afficher le fichier .cam dans Finder.
- Crop Source peut mettre à l'échelle les dimensions de la source par rapport, largeur ou hauteur.
- Le remplissage Screen Size peut être ajusté par bord avec une plage maximale plus élevée, et Device Padding prend en charge les décalages négatifs jusqu'à 3 000 px.
- Les brouillons d'enregistrement restent séparés des espaces de travail .cam enregistrés, conservent les choix de sauvegarde/suppression en temps de fermeture, apparaissent dans Récent et sont enregistrés dans les dossiers sélectionnés sans autorisation répétée ni erreurs de support manquant.
- Les enregistrements d'écran H.264 démarrent de manière fiable sur les systèmes qui rejettent les indications d'encodeur de fréquence d'images non prises en charge.
- L'annulation de l'éditeur et le rendu du curseur d'aperçu sont plus fiables lors des annulations répétées et des mises à jour transitoires de la mise en page.
- Les superpositions de caméra ne deviennent plus noires après avoir coupé un clip d'enregistrement à sa longueur minimale et annulé.
- Les aperçus de création de piste de zoom créent le clip de zoom lorsque vous cliquez dessus.
- Les effets de clic du curseur restent alignés sur les maquettes iPhone en rotation.
- Les bords de la maquette cachent de minces espaces sans recouvrir l'enregistrement.
- Les effets de clic du curseur sont désactivés par défaut et les curseurs cliqués se rétrécissent plus clairement.
- Les formes de curseur enregistrées préservent davantage d'états du système, les styles de curseur personnalisés revenant au pointeur par défaut pour les formes non prises en charge.
- La barre d'outils d'enregistrement s'ouvre de manière fiable à partir du Dock, de la barre de menus et des raccourcis après avoir changé d'espace de bureau, tout en conservant son verre et sa position pendant la capture et l'enregistrement audio.
- La sélection d'enregistrement dans la fenêtre conserve une invite de barre d'outils compacte avec des commandes de sortie Esc cliquables.
- La lecture de l'aperçu du son par clic reste réactive sur les enregistrements avec des historiques d'événements de curseur denses.

# 1.0.5

- Les exportations peuvent se poursuivre en arrière-plan avec des estimations du temps restant, une surface de progression personnalisable, des actions d'exportation terminées et une restauration de fenêtre de style génie.
- Le fractionnement de la chronologie dispose d'un mode dédié avec maintien Option, d'un curseur en ciseaux et d'un focus enregistrement-audio lié.
- Les paramètres du curseur peuvent masquer un curseur inactif et utiliser des sons de clic téléchargeables qui sont lus en aperçu et en exportation, avec des sons téléchargés disponibles hors ligne.
- Les ressources de la maquette peuvent être téléchargées et mises à jour à partir du catalogue, avec des choix de séries, de modèles, de couleurs et de boîtiers et de bracelets Apple Watch reflétés dans l'aperçu.
- L'exportation GIF ajoute des préréglages de résolution 1080p et inférieure et une taille de fichier estimée avant l'exportation.
- Les espaces de travail existants conservent leur maquette sélectionnée pendant que les ressources migrées terminent le téléchargement.
- Les exportations GIF préservent plus précisément les couleurs claires de l’interface utilisateur et la géométrie des calques d’effets.
- Le basculement entre l'exportation GIF et Live Photo maintient l'aperçu du découpage stable et le sélecteur de format GIF répond sur l'ensemble de son segment.
- Les clips de timeline très courts sont plus faciles à sélectionner sans les couper accidentellement.
- Les téléchargements de catalogues de maquettes utilisent moins de mémoire et les longues exportations GIF allouent moins de mémoire tampon d'image.

# 1.0.4

- Les superpositions d'aperçu partagent des poignées de redimensionnement carrées, le redimensionnement des bords, le redimensionnement des touches de modification et le déplacement direct du rayon du coin.
- Les effets de mise au point peuvent couvrir l’intégralité de l’image lors de l’édition d’enregistrements de maquette.
- Les clips d’effet affichent des icônes de type, peuvent être renommés et utilisent le contenu textuel comme étiquettes lorsqu’ils ne sont pas nommés.
- ScreenCam peut sélectionner et enregistrer ses propres fenêtres d'application.
- L'écran d'achat propose un achat unique à vie ScreenCam Pro en plus des abonnements.
- Le glissement et le redimensionnement de la superposition d'aperçu restent précis pendant le zoom et la mise à l'échelle automatique de la caméra.
- Les effets de texte conservent leur taille de police configurée lorsque les zones de texte sont redimensionnées plus petites.
- Les masques d’effet de mise au point correspondent mieux aux coins de l’écran de la maquette et aux contours de sélection.
- Les packages d'espace de travail renommés conservent la sauvegarde automatique sans alertes de média manquant.
- Les menus des appareils d'enregistrement s'actualisent lorsque des microphones ou des caméras sont connectés ou supprimés.
- Les enregistrements principaux découpés peuvent être ramenés à leur longueur d'origine et des chronologies denses défilent verticalement dans de courtes fenêtres d'éditeur.
- La barre d'outils Open Workspace démarre dans le dossier de l'espace de travail des enregistrements par défaut.

# 1.0.3

- Les calques d'effets peuvent ajouter des clips de mosaïque, de focus, de texte et d'image à partir d'une grille de prévisualisation compacte, avec un placement sur une chronologie sur plusieurs voies et un rendu d'exportation.
- L'édition des effets est plus précise avec une édition de texte ciblée, une disposition de texte zoomée stable, un placement hors écran, un redimensionnement de l'aperçu, une édition avec zoom et des aperçus en direct des coins de l'image.
- La zone de piste de la timeline peut être redimensionnée tout en gardant l'aperçu visible et en évitant l'espace de piste vide.
- Les commandes de l'espace de travail CLI peuvent créer et mettre à jour des clips d'effets.
- À propos des paramètres, vous pouvez ouvrir le journal des modifications du site Web.
- Les paramètres d’événement de clavier incluent un commutateur Activer tout pour les touches sélectionnées.
- Les pistes audio et microphone du système enregistrées peuvent être amplifiées au-dessus de 100 %.
- Les clips audio et microphone du système enregistrés restent alignés sur les fractionnements, les découpages et les changements de vitesse de l'enregistrement, avec un aperçu et un volume d'exportation stables.
- Les indicateurs de microphone s'animent correctement lors de l'enregistrement à partir de périphériques d'entrée 24 bits.
- Les paramètres par défaut de l'animation de la caméra commencent à partir d'un profil de ressort plus doux.
- La beauté de l’appareil photo commence par un aspect par défaut plus fort et plus naturel.
- La musique de fond peut être parcourue, prévisualisée, importée du catalogue ou des fichiers, ajustée par clip et exportée avec l'enregistrement audio.
- Les enregistrements récemment terminés récupèrent l'aperçu de l'éditeur de manière plus fiable, y compris les modifications de chargement du fond d'écran et de sélection du fond d'écran vidéo.
- L'aperçu de l'éditeur et les exportations de maquette correspondent mieux à la sortie finale, y compris les bords, la disposition du texte et le timing de l'animation de zoom.
- Les pistes de chronologie zoomées maintiennent les règles, les têtes de lecture, les aperçus de survol et les curseurs de clip alignés lors du défilement horizontal, et restaurent le bord gauche à 00:00 lors d'un zoom arrière.
- L'aperçu de l'éditeur coupe complètement le son du système lorsque son clip ou sa piste est désactivé ou supprimé.
- L’aperçu des effets, la lecture avec zoom, l’exportation et l’édition d’un grand espace de travail sont plus rapides sur des lignes temporelles denses.

# 1.0.2

- Les liens Support et Docs sont disponibles dans Paramètres, À propos et dans le menu Aide.
- Les paramètres d'animation affichent Motion en premier et prennent en charge les groupes pliables.
- Les entrées de numéro d'éditeur utilisent des poignées de déplacement d'icônes et valident les valeurs saisies lorsque vous cliquez en dehors du champ.
- Screen Size avertit de l'exportation de barres noires lorsque l'arrière-plan est Aucun et peut les supprimer.
- Les dimensions de l'écran fixe rétrécissent correctement avec des ratios verrouillés, avec un glissement en hauteur naturelle.
- Les clips de zoom prennent en charge des niveaux d'échelle jusqu'à 5x, avec des transitions de zoom manuelles plus stables.
- Les aperçus des caméras d'enregistrement expliquent qu'ils sont uniquement des aperçus et peuvent être masqués des enregistrements futurs.
- Le zoom manuel, la sélection de fond d'écran personnalisé, l'alignement des événements du clavier et l'édition du recadrage source sont plus fiables.
- Camera Beauty utilise moins de processeur pour l'enregistrement des aperçus et la lecture des aperçus de l'éditeur.
- La lecture de l'aperçu ne bloque plus la fermeture de l'éditeur ou les panneaux de fichiers natifs lors d'un rendu composite important.
- Les ajustements esthétiques de l’appareil photo évitent une utilisation incontrôlée du processeur en aperçu.
- La beauté de l'appareil photo ajoute une teinte naturelle localisée aux lèvres, un éclairage plus doux et une meilleure gestion des imperfections.
- Les espaces de travail .cam enregistrés automatiquement conservent l'accès aux dossiers afin que les enregistrements et les fermetures de l'éditeur soient plus fiables dans des emplacements protégés.
- Les exportations de beauté de caméra se terminent plus rapidement, en particulier avec des superpositions de caméra plus petites et une sortie de résolution inférieure.
- Les menus de rapport hauteur/largeur affichent des aperçus de forme pour chaque préréglage.
- Les préréglages de l'éditeur sont enregistrés sans planter le menu des préréglages.
- Les maquettes d'appareils réduisent l'ouverture de leur écran si nécessaire afin que les enregistrements couvrent l'écran sans boîte aux lettres.
- Les achats Paywall évitent de lier la boîte de dialogue de confirmation d'Apple à une fenêtre d'application spécifique.
- La confirmation de l'abonnement Apple est plus fiable sur les configurations multi-écrans, avec des diagnostics ciblés pour les échecs de confirmation suspects.

# 1.0.1

- Les nouveaux enregistrements sont automatiquement enregistrés en tant qu'espaces de travail .cam dans un emplacement par défaut configurable avant l'ouverture de l'éditeur.
- Les paramètres d'enregistrement affichent l'espace de travail enregistré automatiquement et la taille brute du cache d'enregistrement, avec nettoyage des anciens ou de tous les éléments du cache.
- Les paramètres ajoutent des contrôles d’apparence pour la couleur du thème, le matériau de la barre d’outils et le matériau des info-bulles.
- Les paramètres ajoutent Ouvrir à la connexion, des touches de raccourci plus grandes pendant l'enregistrement, des liaisons de raccourci amovibles et l'exportation récente du journal des erreurs.
- Le menu Fichier ajoute des sous-menus paresseux Récent et Répertoire par défaut pour ouvrir les espaces de travail enregistrés.
- L'en-tête de l'éditeur ajoute des actions prédéfinies d'enregistrement, de renommage, de réorganisation, de suppression, d'application, de partage et d'importation.
- L'en-tête de l'éditeur ajoute davantage de préréglages d'aspect de canevas d'exportation, de contrôles de recadrage source et d'exportations source limitées à 5K.
- Le titre de l'éditeur peut révéler l'espace de travail dans Finder.
- L'ordre des pistes de la chronologie persiste en tant que préférence de l'éditeur tandis que les pistes masquées sont réinitialisées par session.
- La chronologie et le recadrage source prennent en charge le zoom par pincement du trackpad, avec un panoramique dans la feuille de recadrage après le zoom.
- La sélection de zone prend en charge les dimensions saisies, les guides centraux, les préréglages de rapport hauteur/largeur et les raccourcis de redimensionnement Shift/Option.
- Les commandes d'aperçu de la chronologie ajoutent des vitesses de lecture de 0,25x à 2x.
- Les filtres de beauté de l'appareil photo peuvent être prévisualisés et activés pendant l'enregistrement, enregistrés par défaut, ajustés ultérieurement et affinés avec des commandes de forme tenant compte du visage.
- Les paramètres d'animation de caméra par défaut utilisent un profil de ressort plus doux et un flou de mouvement plus fort pour des zooms plus fluides.
- Le mouvement de la caméra de prévisualisation maintient les trajectoires de zoom avant et arrière serrées sur les bords et utilise le flou de mouvement directionnel à partir du centre de zoom correct.
- La lecture du curseur suit le mouvement enregistré avec moins de décalage.
- La position du curseur et la mise au point de la caméra restent alignées après le recadrage de la source.
- Les superpositions de caméra restent synchronisées avec leur image pendant la lecture de l'aperçu.
- L'arrêt de l'enregistrement passe immédiatement à Processing et maintient la finalisation en vie plus longtemps.
- La barre d'outils d'enregistrement flottante reste visible lors du changement de bureau pendant l'enregistrement.
- Les compteurs audio de la barre d'outils d'enregistrement affichent un mouvement de niveau plus clair.
- La sélection de capture de zone apparaît de manière fiable au premier plan depuis la barre d'outils d'enregistrement flottante.
- La sélection de capture de fenêtre et de zone fonctionne sur les écrans secondaires.
- Le refus de l’autorisation d’enregistrement d’écran annule l’enregistrement sans afficher d’erreur.
- Les contrôles de sélection de capture évitent les plantages d'Intel TestFlight, y compris le survol de la cible, les mises à jour du menu d'état de la barre de menus et la réouverture à partir du Dock.
- Le bouton d'annulation de la sélection de capture répond sur l'ensemble du contrôle circulaire complet.
- Le survol du bouton de démarrage de la sélection de capture ne fait plus planter l'application.
- Les enregistrements avec l'audio système activé se terminent sans interruption dans Processing.
- La fermeture ou la fermeture avec un éditeur non enregistré affiche le flux de fermeture de ScreenCam au lieu du panneau de sauvegarde du document système.
- La sauvegarde automatique de Workspace attend pendant que les panneaux de fichiers natifs sont ouverts et écrit les packages .cam de manière plus sûre.
- Le défilement de la chronologie et les interactions interrompues ne laissent plus la lecture de l'aperçu figée ou sautée à la fin.
- Le redimensionnement ou le déplacement de clips de la chronologie ne fait plus sauter la tête de lecture lors de la saisie d'un clip.
- L'aperçu audio et les commandes de volume restent synchronisés, s'animent de manière fluide et n'ajoutent plus d'étapes d'annulation.
- Les sélecteurs de couleurs acceptent les valeurs hexadécimales saisies et maintiennent les poignées de déplacement ancrées lors du réglage de la couleur.
- Les étiquettes de l’inspecteur utilisent la terminologie Écran et Appareil, et le sélecteur de taille prédéfinie correspond aux autres commandes de menu.
- Des info-bulles apparaissent sur les contrôles d’enregistrement, les onglets de l’inspecteur et les raccourcis annuler/rétablir.
- Le matériau transparent des info-bulles maintient les bulles de survol visibles sur les fonds blancs.
- Les vidéos MP4 exportées utilisent l'ordre d'images H.264 compatible avec l'aperçu, évitent les métadonnées de quarantaine et conservent une synchronisation audio à vitesse normale.
- Le dimensionnement de l'exportation en résolution source utilise la composition finale de l'aperçu, y compris le remplissage du cadre, la taille de canevas fixe et la taille de la maquette.
- Les toiles exportées évitent les barres noires de bord causées par l’arrondi des pixels.
- Les exportations de maquette d’affichage restituent correctement les fonds d’écran animés et les arrière-plans de cadre à l’intérieur du cadre de l’écran.
- La maquette d'ordinateur portable exporte le contenu de l'enregistrement de clips vers les coins arrondis de l'écran.
- Les zooms de la maquette peuvent suivre le mouvement du curseur au-delà du bord source sans aligner le périphérique agrandi sur le bord du canevas.
- Les clips d'enregistrement répétés sont exportés à partir des images sources correctes au lieu des images finales obsolètes.
- Les exportations 4K démarrent de manière fiable sur les enregistrements haute résolution au lieu de stagner autour de 3 %.
- Les exportations longues avec des fonds d'écran animés ou des superpositions de caméras ne stagnent plus à près de 79 %.
- Les exportations audio en volume complet préservent le débit vidéo rendu H.264 au lieu de gonfler la taille du fichier pendant le multiplexage audio.
- L'enregistrement, la lecture d'aperçu, l'exportation haute résolution et les grandes chronologies du clavier utilisent moins de CPU et de mémoire.
- Les boutons de feux de signalisation de l'éditeur conservent le positionnement natif pendant les transitions en plein écran.
