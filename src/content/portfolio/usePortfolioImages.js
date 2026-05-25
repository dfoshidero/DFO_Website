import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL =
  'https://z3mlw599i2.execute-api.eu-west-2.amazonaws.com/test/fetchInstagramData';

const cache = {
  images: null,
  error: null,
  promise: null,
};

async function fetchPortfolioImages() {
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(API_URL);
      const imagesData = JSON.parse(response.data.body);

      if (!Array.isArray(imagesData)) {
        throw new Error(
          'API connected; token expired or response format invalid.'
        );
      }

      return imagesData;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
    }
  }

  throw (
    lastError ||
    new Error('Failed to fetch Instagram images: Connection or API error.')
  );
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
          error?.message ||
          'Failed to fetch Instagram images: Connection or API error.';
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
            err?.message ||
              'Failed to fetch Instagram images: Connection or API error.'
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
