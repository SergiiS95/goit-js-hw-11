import axios from "axios";

const URL = 'https://pixabay.com/api/';
const API_KEY = '36598213-1c05ffc9aa6b3be50b197b0cb';

export default class GalleryImage{
    constructor() {
        this.page = 1;
        this.searchQuery = "";
        this.perPage = 40;
    }

    async getImage () {
    const { data } = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
    );
    this.incrementPage();
        return data;
}

resetPage(){
    this.page = 1;
}

incrementPage(){
    this.page += 1;
}


}

