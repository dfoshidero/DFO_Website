import { useEffect, useState } from 'react';

const MANIFEST_URL = '/portfolio/images.json';

const cache = {
  images: null,
  error: null,
  promise: null,
};

async function fetchPortfolioImages() {
  const response = await fetch(MANIFEST_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to load portfolio images (${response.status}).`
    );
  }

  const imagesData = await response.json();

  if (!Array.isArray(imagesData)) {
    throw new Error('Portfolio data format is invalid.');
  }

  return imagesData;
}

function loadImages() {
  if (cache.images) {
    return Promise.resolve(cache.images);
  }

  if (!cache.promise) {
    cache.promise = fetchPortfolioImages()
      .then((images) => {
        cache.images = images;
        cache.error = null;
        return images;
      })
      .catch((error) => {
        cache.error =
          error?.message || 'Failed to load portfolio images.';
        cache.promise = null;
        throw error;
      });
  }

  return cache.promise;
}

export function usePortfolioImages() {
  const [images, setImages] = useState(cache.images || []);
  const [loading, setLoading] = useState(!cache.images && !cache.error);
  const [error, setError] = useState(cache.error);

  useEffect(() => {
    if (cache.images) {
      setImages(cache.images);
      setLoading(false);
      setError(null);
      return;
    }

    if (cache.error) {
      setError(cache.error);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadImages()
      .then((data) => {
        if (!cancelled) {
          setImages(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.message || 'Failed to load portfolio images.'
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { images, loading, error };
}

export function getPaintingLabel(image, index) {
  const caption =
    image.media_type === 'CAROUSEL_ALBUM' && image.children?.[0]?.caption
      ? image.children[0].caption
      : image.caption || '';

  if (caption) {
    const trimmed = caption.trim();
    return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
  }

  return `Painting #${index + 1}`;
}
