import { useEffect, useMemo } from 'react';
import { Button } from '../../ui/Button';
import { FormField } from '../../ui/FormField';

export function JobImagePicker({
  files = [],
  primaryImageIndex = 0,
  error,
  onAddImages,
  onRemoveImage,
  onSelectPrimary,
  showPrimarySelection = false,
}) {
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  function handleFileChange(event) {
    const nextFiles = Array.from(event.target.files || []);
    if (nextFiles.length) {
      onAddImages(nextFiles);
    }
    event.target.value = '';
  }

  return (
    <div className="job-image-picker">
      <FormField
        label="Project photos"
        error={error}
        hint="Upload clear JPG, PNG, or HEIC images so contractors can quickly understand the job."
      >
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      </FormField>

      {files.length ? (
        <div className="job-image-picker__header">
          <p>
            <strong>{files.length}</strong> image{files.length === 1 ? '' : 's'} ready to publish.
          </p>
          {showPrimarySelection ? <p className="inline-note">Choose the primary photo contractors see first.</p> : null}
        </div>
      ) : null}

      {previews.length ? (
        <div className="job-image-picker__grid">
          {previews.map((preview, index) => {
            const isPrimary = index === primaryImageIndex;

            return (
              <article key={`${preview.file.name}-${preview.file.lastModified}-${index}`} className={`job-image-card ${isPrimary ? 'is-primary' : ''}`}>
                <div className="job-image-card__preview-wrap">
                  <img className="job-image-card__preview" src={preview.url} alt={preview.file.name} />
                  {isPrimary ? <span className="job-image-card__badge">Primary photo</span> : null}
                </div>
                <div className="job-image-card__meta">
                  <div>
                    <strong>{preview.file.name}</strong>
                    <p>{Math.max(1, Math.round(preview.file.size / 1024))} KB</p>
                  </div>
                  <div className="job-image-card__actions">
                    {showPrimarySelection && !isPrimary ? (
                      <Button type="button" variant="secondary" onClick={() => onSelectPrimary(index)}>
                        Make primary
                      </Button>
                    ) : null}
                    <Button type="button" variant="ghost" onClick={() => onRemoveImage(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="info-callout info-callout--subtle">
          <p>No photos added yet.</p>
        </div>
      )}
    </div>
  );
}
