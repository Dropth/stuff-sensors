# Internet of stuff

Web development Lab @ university of Le Havre

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Forked from Pigne/stuff-sensors.

Modifé par Florian Alline dans le cadre du cours d'IDOD -> [Lab Services Web](http://pigne.org/teaching/fullstackjs/lab/WebServiceLab)

## Prerequisite

Pour que tout fonctionne, il vous faut remplir les prérequis de [Sensors to DB](https://github.com/pigne/sensors-to-db).

## Fonctionalité n°1

Le client de l'API se trouve dans le fichier /src/api/SensorMeasures.js
Le serveur est fourni à la racine du projet dans le dossier /serveur

Pour éviter le Cross-origin ressource sharin, la ligne suivante a été ajouté dans le fichier package.json
```bash
"proxy": "http://localhost:8070"
```
Le code concernant cette fonctionnalité se trouve dans le fichier /src/components/SensorsHisto.js

Pour ce qui est de l'appl :
- Cliquer sur l'onglet Historique
- Choisir un senseur
- Spécifier deux dates
- Valider
- Observer un tableau avec tous les senseurs et la possibilité de spécifier un intervalle.

## Fonctionalité n°2

