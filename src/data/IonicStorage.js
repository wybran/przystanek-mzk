import { Drivers, Storage } from '@ionic/storage';

var storage = false;

export const createStore = (name = "__mydb") => {

    storage = new Storage({
        
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
}

export const getAllKeys = async () => {
    return await storage.keys()
}

export const set = (key, val) => {
    storage.set(key, val);
}

export const get = async key => {
    return await storage.get(key);
}

export const remove = async key => {
    await storage.remove(key);
}

export const clear = async () => {
    await storage.clear();
}