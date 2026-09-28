import React, { useState, useMemo } from 'react';
import { usePortfolioImages, getPaintingLabel } from './usePortfolioImages';
import { useSettings } from '../../utils/contentContext';
import './InquireForm.scss';

const INITIAL_VALUES = {
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
  const [values, setValues] = useState({
    ...INITIAL_VALUES,
    painting: initialImageId || '',
  });
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState(null);
  const [mailtoHref, setMailtoHref] = useState(null);

  const selectedImage = useMemo(
    () => images.find((img) => String(img.id) === String(values.painting)),
    [images, values.painting]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const paintingIndex = images.findIndex(
      (img) => String(img.id) === String(values.painting)
    );
    const paintingLabel =
      values.painting && selectedImage && paintingIndex >= 0
        ? getPaintingLabel(selectedImage, paintingIndex)
        : 'General inquiry';

    // This used to POST to "/" for Netlify Forms. On Render that returns the
    // page with a 200, so the form reported success while nothing was sent.
    // Handing off to the visitor's mail client actually delivers the inquiry.
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone && `Phone: ${values.phone}`,
      `Painting: ${paintingLabel}`,
      values.budget && `Budget: ${values.budget}`,
      '',
      values.message,
    ]
      .filter((line) => line !== false && line !== '' && line !== undefined)
      .join('\r\n');

    const href =
      `mailto:${contactEmail}` +
      `?subject=${encodeURIComponent(`Painting inquiry - ${paintingLabel}`)}` +
      `&body=${encodeURIComponent(body)}`;

    setMailtoHref(href);
    window.location.href = href;
    setStatus('success');
  };

  const handleReset = () => {
    setValues({ ...INITIAL_VALUES, painting: initialImageId || '' });
    setStatus('idle');
    setSubmitError(null);
    setMailtoHref(null);
  };

  if (status === 'success') {
    return (
      <div className="inquire-form portfolio-modal-content">
        <div className="inquire-form__success">
          <p className="inquire-form__success-title">Almost there</p>
          <p className="inquire-form__success-text">
            Your email app should have opened with this inquiry ready to send.
            If it did not,{' '}
            <a href={mailtoHref || `mailto:${contactEmail}`}>
              open it here
            </a>{' '}
            or email {contactEmail} directly.
          </p>
          <button
            type="button"
            className="inquire-form__submit"
            onClick={handleReset}
          >
            Send another inquiry
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
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
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
        {status === 'submitting' ? 'Sending...' : 'Send inquiry'}
      </button>
    </form>
  );
}

export default InquireForm;
