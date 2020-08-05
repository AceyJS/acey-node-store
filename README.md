## Local Storage for NodeJS apps with Acey

Asynchronous, unencrypted, persistent, key-value storage system for nodeJS. (conceived for acey)


### Installation
```sh
yarn add acey-node-store
```

### Quickstart

```js
import { config } from 'acey'
import LocalStorage from 'acey-node-store'

const initAcey = async () => {
  /* 
    parameter: `dbFolderPath` (string)
    The path to the folder where your JSON DB files will be saved.
  */
  const localStorageEngine = new LocalStorage('./db')
  config.setStoreEngine(localStorageEngine)
  await config.done()
}
```
