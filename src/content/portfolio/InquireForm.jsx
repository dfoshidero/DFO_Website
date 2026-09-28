import React, { useState, useMemo } from 'react';
import { usePortfolioImages, getPaintingLabel } from './usePortfolioImages';
import { useSettings, useUiText } from '../../utils/contentContext';
import './InquireForm.scss';

// Formspree endpoint, e.g. https://formspree.io/f/xxxxxxxx — Render has no
// native form handling, and Formspree is its documented addon for static sites.
// Unset means the form is not wired up yet; it then points people at the email
// address rather than pretending to submit.
const FORMSPREE_ENDPOINT = process.env.REACT_APP_FORMSPREE_ENDPOINT;

const INITIAL_VALUES = {
  botField: '',
  name: '',
  email: '',
  phone: '',
  painting: '',
  budget: '',
  message: '',
};

function InquireForm({ initialImageId = '' }) {
  const { images, loading, error } = usePortfolioImages();
  const { contactEmail } = useSettings();
  const copy = useUiText().inquiryForm;
  const [values, setValues] = useState({
    ...INITIAL_VALUES,
    painting: initialImageId || '',
  });
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState(null);

  const selectedImage = useMemo(
    () => images.find((img) => String(img.id) === String(values.painting)),
    [images, values.painting]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!FORMSPREE_ENDPOINT) {
      setStatus('error');
      setSubmitError(
        `The form is not connected yet. Please email ${contactEmail} directly.`
      );
      return;
    }

    setStatus('submitting');
    setSubmitError(null);

    const paintingIndex = images.findIndex(
      (img) => String(img.id) === String(values.painting)
    );
    const paintingLabel =
      values.painting && selectedImage && paintingIndex >= 0
        ? getPaintingLabel(selectedImage, paintingIndex)
        : 'General inquiry';

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Without this Formspree redirects instead of returning JSON.
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          painting: paintingLabel,
          budget: values.budget,
          message: values.message,
          // Formspree's own honeypot field name.
          _gotcha: values.botField,
          _subject: `Painting inquiry - ${paintingLabel}`,
        }),
      });

      if (!response.ok) {
        // Surface Formspree's own validation message when it sends one, rather
        // than a generic failure.
        const detail = await response.json().catch(() => null);
        const message =
          detail?.errors?.map((e) => e.message).join(' ') ||
          copy.submitFailedText;
        throw new Error(message);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setSubmitError(
        err?.message === 'Failed to fetch'
          ? `Could not reach the server. Please email ${contactEmail} directly.`
          : err?.message || copy.genericErrorText
      );
    }
  };

  const handleReset = () => {
    setValues({ ...INITIAL_VALUES, painting: initialImageId || '' });
    setStatus('idle');
    setSubmitError(null);
  };

  if (status === 'success') {
    return (
      <div className="inquire-form portfolio-modal-content">
        <div className="inquire-form__success">
          <p className="inquire-form__success-title">{copy.successTitle}</p>
          <p className="inquire-form__success-text">{copy.successText}</p>
          <button
            type="button"
            className="inquire-form__submit"
            onClick={handleReset}
          >
            {copy.successButtonLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="inquire-form portfolio-modal-content"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="inquire-form__honeypot" aria-hidden="true">
        <label>
          Don&apos;t fill this out:
          <input
            name="botField"
            value={values.botField}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </p>

      <div className="inquire-form__field">
        <label htmlFor="inquire-name">
          Name <span className="inquire-form__required" aria-hidden="true">*</span>
          <span className="visually-hidden"> (required)</span>
        </label>
        <input
          id="inquire-name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
      </div>

      <div className="inquire-form__field">
        <label htmlFor="inquire-email">
          Email <span className="inquire-form__required" aria-hidden="true">*</span>
          <span className="visually-hidden"> (required)</span>
        </label>
        <input
          id="inquire-email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>

      <div className="inquire-form__field">
        <label htmlFor="inquire-phone">
          Phone <span className="inquire-form__optional">(optional)</span>
        </label>
        <input
          id="inquire-phone"
          type="tel"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>

      <div className="inquire-form__field">
        <label htmlFor="inquire-painting">
          Painting <span className="inquire-form__optional">(optional)</span>
        </label>
        {loading && (
          <p className="inquire-form__hint">Loading paintings...</p>
        )}
        {error && (
          <p className="inquire-form__hint inquire-form__hint--error">
            Could not load paintings. You can still send a general inquiry.
          </p>
        )}
        <div className="inquire-form__painting-row">
          {selectedImage && (
            <img
              className="inquire-form__painting-thumb"
              src={selectedImage.media_url}
              alt=""
            />
          )}
          <select
            id="inquire-painting"
            name="painting"
            value={values.painting}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">General inquiry (no specific painting)</option>
            {images.map((image, index) => (
              <option key={image.id} value={image.id}>
                {getPaintingLabel(image, index)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inquire-form__field">
        <label htmlFor="inquire-budget">
          Budget / price range <span className="inquire-form__optional">(optional)</span>
        </label>
        <input
          id="inquire-budget"
          type="text"
          name="budget"
          value={values.budget}
          onChange={handleChange}
          placeholder="e.g. £200–£500"
        />
      </div>

      <div className="inquire-form__field">
        <label htmlFor="inquire-message">
          Message <span className="inquire-form__required" aria-hidden="true">*</span>
          <span className="visually-hidden"> (required)</span>
        </label>
        <textarea
          id="inquire-message"
          name="message"
          value={values.message}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      {submitError && (
        <p className="inquire-form__error" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        className="inquire-form__submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? copy.submittingLabel : copy.submitLabel}
      </button>
    </form>
  );
}

export default InquireForm;
