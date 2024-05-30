class DataStorage {
    constructor(localStorageId) {
        this.storage = this._getDefaultData();
        this._localStorageId = localStorageId;
        this.ready = false;
    }

    set(newData) {
        localStorage.setItem(this._localStorageId, JSON.stringify(newData));
        this.ready = false;
    }

    get() {
        if (!this.ready) {
            this._fetchFromLocalStorage();
        }
        return this.storage;
    }

    _fetchFromLocalStorage() {
        const settings = JSON.parse(localStorage.getItem(this._localStorageId));
        if (settings) {
            this.storage = settings;
        }
        this.ready = true;
    }

    _getDefaultData() {
        return {}
    }
}


export class SettingsStorage extends DataStorage {
    constructor() {
        super("settings");
    }

    _getDefaultData() {
        return {
            cardsNumber: 11,
            audioSound: true,
        }
    }
}

export class ScoreStorage extends DataStorage {
    constructor(cardsNumber) {
        super("scores");
        this._cardsNumber = cardsNumber;
    }

    set(score) {
        const currentScores = this.get();
        currentScores.push({
            score,
            date: new Date().toISOString(),
            cardsNumber: this._cardsNumber
        });
        super.set(currentScores);
    }

    _getDefaultData() {
        return []
    }
}