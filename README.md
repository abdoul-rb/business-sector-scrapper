# Web Scraper pour les Secteurs d'Activités en France

Ce projet consiste en un scraper web simple qui récupère les secteurs d'activités des entreprises en France à partir d'une page web spécifiée.

## Fonctionnalités

- **Scraping d'une page web** : Récupère les données à partir d'une URL donnée.
- **Extraction ciblée** : Sélectionne des éléments basés sur une classe CSS spécifiée.
- **Affichage des résultats** : Affiche les résultats dans l'url `/activities`.

## Installation

1. Clonez ce repository :
```bash
git clone <repository-url>
cd <repository-folder>
```

2. Installez les dépendances :
```bash
npm install
```

## Utilisation

1. Modifiez le fichier `server.js` pour définir l'URL que vous souhaitez scraper et la classe CSS cible. Par exemple :
```javascript
const config = {
    url: "https://example.com",
    targetClass: ".FamilyList__ListUl-sc-1oilj10-1"
};
```

2. Lancez le serveur :
Pour lancer le server en mode developpement : 
```
npm run dev
```

3. Les résultats du scraping seront affichés dans l'url `/activities`.

## Exemple de Scraper

Le scraper utilise la bibliothèque `jsdom` pour parser le HTML et extraire les liens d'intérêt. Voici un aperçu de la fonction de scraping :

```javascript
exports.scrapper = function ({ url, body, ...options }, targetClass, callback) {
    // ... logique de scraping ...
    const result = Array.from(data.querySelectorAll(targetClass)).map((item) => {
        const link = item.querySelector("a");
        return {
            url: link.href,
            text: link.textContent.trim(),
        };
    });
    callback(result);
};
```

## Auteurs

- [Votre nom]

## License

Ce projet est sous licence MIT.
