import { expect } from 'chai';
import 'mocha';

import Store from '../index';

const store = new Store('./store.json')

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

describe('Testing toPlain (Model/Collection)', () => {

    it('generate randomly 10K users', async () => {
        const users: any[] = []
        for (let i = 0; i < 1000; i++){
            users.push({id: makeid(300)})
        }
        const toStore: any[] = []
        for (let i = 0; i < 1000; i++){
            toStore.push(users[i])
            setTimeout(() => store.setItem('users', toStore))
        }

        while (true){
            await new Promise(resolve => setTimeout(resolve, 200))
            const stored = store.getItem('users')
            const users = JSON.parse(stored)
            if (users.length == 1000)
                break
        }
    })
});