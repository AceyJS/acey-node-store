import fs from 'fs'
import path from 'path'

import Queue from './queue'

class LocalStorage {

    private _dbFolderPath: string
    private _queue = new Queue()

    constructor(dbFolderPath: string){
        this._dbFolderPath = dbFolderPath
    }


    private _getFullDocumentPath = (key: string) => {
        if (!fs.existsSync(this._dbFolderPath))
            fs.mkdirSync(this._dbFolderPath, { recursive: true })
        return path.resolve(this._dbFolderPath, key) + `.json`
    }

    public setItem = (key: string, data: any) => {
        let formatedData = data
        if (typeof data !== 'string')
            formatedData = JSON.stringify(data)

        this._queue.stack(() => {
            fs.writeFileSync(this._getFullDocumentPath(key), formatedData)
        })
    }

    public getItem = (key: string) => {
        try {
            const res = fs.readFileSync(this._getFullDocumentPath(key), 'utf8')
            return res
        } catch (e){
            if (e.code == 'ENOENT')
                return ''
            else 
                throw new Error(e)
        }
    }

    public removeItem = (key: string) => {
        this._queue.stack(() => fs.unlinkSync(this._getFullDocumentPath(key)) )
    }
}

export default LocalStorage

