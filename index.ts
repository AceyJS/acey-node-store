import fs from 'fs'
import path from 'path'

class LocalStorage {

    private _dbFolderPath: string
    private _writePending: {key: string, data: any}[] = []
    private _isWriting = false

    constructor(dbFolderPath: string){
        this._dbFolderPath = dbFolderPath
    }

    
    private _addToPending = (key: string, data: any) => {
        this._writePending.push({key, data})
        if (!this._isWriting)
            this._internalSetItem()
    }

    private _internalSetItem = () => {
        this._isWriting = true
        if (this._writePending.length == 0){
            this._isWriting = false
            return
        }
        const {key, data} = this._writePending.shift()!

        let formatedData = data
        if (typeof data !== 'string')
            formatedData = JSON.stringify(data)
        try {
            fs.writeFileSync(this._getFullDocumentPath(key), formatedData)
        } catch (e){
            throw new Error(e)
        } finally {
           this._isWriting = false
        }
        this._internalSetItem()
    }

    private _getFullDocumentPath = (key: string) => {
        if (!fs.existsSync(this._dbFolderPath))
            fs.mkdirSync(this._dbFolderPath, { recursive: true })
        return path.resolve(this._dbFolderPath, key) + `.json`
    }

    public setItem = (key: string, data: any) => this._addToPending(key, data)

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

    public removeItem = (key: string) => fs.unlinkSync(this._getFullDocumentPath(key))
}

export default LocalStorage

