# Structure de l'API imaginaire
Dans cette API on a une collection d'utilisateurs.
Chaque ressource est un utilisateur avec la structure suivante :
```api
{
  "utilisateur": "patate",
  "timeline": [
    {tweet1},
    {tweet2},
    ... 
  ]
}
```
# Requètes imaginaire de l'API imaginaire
## Récupérer les "x" premiers tweets de la timeline d'un utilisateur
- GET request :
```api
GET /utilisateurs/patate/timeline/tweets?x=5

```
- response :
```api
{
  "utilisateur": "patate",
  "tweets": [
    {
      "id": 123,
      "texte": "Premier tweet",
      "date": "2024-04-10T12:00:00Z"
    },
    {
      "id": 124,
      "texte": "Deuxième tweet",
      "date": "2024-04-09T09:00:00Z"
    },
    ...
  ]
}
```
## Follow un autre utilisateur
- POST resquest :
```api
POST /utilisateurs/patate/follow
```
- probable response :
```api
Statut : 200 OK
or 
Statut : 404 Not-Found
```

## Un-follow un autre utilisateur
```api
POST /utilisateurs/patate/unfollow
```
- probable response :
```api
Statut : 200 OK
or 
Statut : 404 Not-Found
```