import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryImage from './js/GalleryImage.js';
import LoadMoreBtn from './js/LoadMoreBtn.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

const newGallery = new GalleryImage();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });
const data = {};
form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchData);

async function onSubmit(evt) {
  evt.preventDefault();
  const form = evt.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (!value) Notiflix.Report.warning('No value!');
  else {
    
    newGallery.searchQuery = value;
    newGallery.resetPage();
    gallery.innerHTML = '';
    fetchData().finally(() => form.reset());
    loadMoreBtn.show();
  }
}

async function fetchData() {
  loadMoreBtn.disable();
  try {
    const data = await newGallery.getImage();
    const totalHits = Number(data.totalHits);
    const page = newGallery.page - 1;
    const hits = data.hits;
    const totalPage = Math.ceil(500 / newGallery.perPage);
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
      return;
    }
    if (page === 1) {
      Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
    }
    if (page >= totalPage) {
      loadMoreBtn.hide();
    }

    if (hits.length < 40) {
      Notiflix.Notify.failure(
        "   'We're sorry, but you've reached the end of search results.'"
      );
      loadMoreBtn.hide();
    }

    gallery.insertAdjacentHTML('beforeend', createMarcups(hits));

    const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      animationSpeed: 250,
    });

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    onError(err);
  }
  loadMoreBtn.enable();
}

function createMarcups(hits) {
  return hits.reduce((markup, hit) => markup + createMarcup(hit), '');
}

function createMarcup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<li class="gallery__item">
   <a class="gallery__link" href="${largeImageURL}">
    
    <img src=${webformatURL} alt=${tags} loading="lazy" />
  
     </a>
     <div class="info">
      <p class="info-item">
        <b>Likes</b><br> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b><br> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b><br> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> <br>${downloads}
      </p>
    </div>

  
</li>`;
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
}

