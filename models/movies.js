class Movies {

    constructor(){
        this._db = []
    }

    // The C in Crud. Ter illustratie een optionele callback
    create(movie, cb = null) {
        this._db.push(movie);
        if( cb !== null ) {
            cb(null, 'ok');
        }
    }

    // The R in cRud - find all
    readAll(cb) {
        cb(null, this._db);
    }

    // The R in cRud - find on movie.id 
    read(id, cb) {
        this._db.find( (movie) => {
            if( movie.id === id) {
                cb(null, movie);
            }
        });
    }
}

module.exports = Movies