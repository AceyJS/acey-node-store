import fs from 'fs'
import path from 'path'

class LocalStorage {

    private _dbFolderPath: string

    constructor(dbFolderPath: string){
        this._dbFolderPath = dbFolderPath
    }
    
    private _getFullDocumentPath = (key: string) => {
        if (!fs.existsSync(this._dbFolderPath))
            fs.mkdirSync(this._dbFolderPath, { recursive: true })
        return path.resolve(this._dbFolderPath, key) + `.json`
    }

    public setItem = async (key: string, data: any): Promise<void> => {
        try {
            return new Promise((resolve, reject) => {
                fs.writeFile(this._getFullDocumentPath(key), typeof data !== 'string' ? JSON.stringify(data) : data, {encoding: 'utf8'}, (err) => {
                    if (err)
                        reject(err as any)
                    else
                        resolve()
                })
            })
        } catch (e){
            throw new Error(e as any)
        } 
    }

    public getItem = (key: string) => {
        try {
            const res = fs.readFileSync(this._getFullDocumentPath(key), 'utf8')
            return res
        } catch (e){
            if ((e as any).code == 'ENOENT')
                return ''
            else 
                throw new Error(e as any)
        }
    }

    public removeItem = (key: string) => fs.unlink(this._getFullDocumentPath(key), (err) => {
        if (err)
            throw new Error(err as any)
    })
}

export default LocalStorage

