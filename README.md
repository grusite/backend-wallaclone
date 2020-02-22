# Backend-Wallaclone

Backend of Wallaclone's final project of Bootcamp Web VII. The app is accesible via [this URL](https://frontend-wallaclone.grusite.now.sh)

It is a NodeJS/Express application used in the [frontend React app](https://github.com/grusite/frontend-wallaclone.git) developed in React

You can access to the API [using this url](https://ancient-depths-90365.herokuapp.com)

## Instructions

- MondoDB: To start a local server execute `mongod --dbpath='/home/grusite/data/db'`
- To init the DB with some preset ads execute `npm run installDB`
- To start the server in dev mode execute `npm run dev`
- To execute linter in all files `npm run linter`
- To start the server with the DB formated and the linter `npm run initDB-dev`

* models -> where I store the DB model
* controllers -> where I store the route controllers
* locales -> where I store languages dictionary
* public -> all necesary to interact with frontal made by EJS
* services -> services that other part of the app will use
* .env -> file with user information. The person who runs the code will need to refill the data

## Deploy

The backend is deployed in Heroku in [next link](https://ancient-depths-90365.herokuapp.com)

To rebuild just change code, commit and push into github (`git push origin master`), and commit also into heroky repository (`git push heroku master`)

### API Methods

#### advertisement list

http://localhost:3000/apiv1/anuncios

#### Parameters:

With no parameters, it will return all advertisement
aditionally, you can add any filter in the URL:

start: numeric. Skip the number given in the result returned
limit: numeric. Limits the number of results returned
fields: string. Selects the fields especified in the query
sort: string. Sorts the query by the criteria given in the query
name: string. Returns the ads that starts with the name given
tag: string. Returns the ads with the tags given
type: string. Returns the ads if it for sell or to buy
price: string. Returns the ads with the filter given in price

#### advertisement by id

http://localhost:3000/apiv1/anuncios/:id

#### create an ad

http://localhost:3000/apiv1/anuncios/

data {
name: "name",
type: sell|buy,
price: number,
picture: path,
tags: tags
}

#### update an ad

http://localhost:3000/apiv1/anuncios/:id

dataToUpdate {
name: "name",
type: sell|buy,
price: number,
picture: path,
tags: tags
}

#### delete an advertisement by id

http://localhost:3000/apiv1/anuncios/:id

#### tags available

http://localhost:3000/apiv1/anuncios/tags
