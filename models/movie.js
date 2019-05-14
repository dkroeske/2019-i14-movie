class Movie {

    constructor(titel, jaar, rating){
        this.titel = this.validate(titel),
        this.jaar = this.validate(jaar),
        this.rating = this.validate(rating)
    }

    // Uitbreiden!
    validate(item) {
        return item;
  }

}

module.exports = Movie