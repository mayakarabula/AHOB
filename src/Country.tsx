import { useState } from 'react';
import {
  CountryEntry,
  CountryFields,
  DescriptorEntry,
  DescriptorFields,
} from './types';

export const getIcon = (category: string) => {
  if (category === 'Health care') {
    return '🏥';
  }
  if (category === 'Laws') {
    return '📔';
  }
  if (category === 'Region') {
    return '🌍';
  }
};

const maxDescriptors = 5;

export const getDescriptors = (
  country: CountryEntry,
  descriptors: DescriptorEntry[],
  showAllDescriptors: boolean,
) => {
  const countryDescriptors = country.metadata.tags
    .map((tag) =>
      descriptors.find((descriptor) => descriptor.sys.id === tag.sys.id),
    )
    .filter((descriptor) => descriptor)
    .sort((a, b) => {
      return (a?.fields as DescriptorFields).isPositive === 'positive' ? -1 : 1;
    });

  return countryDescriptors.map((descriptor, index) => {
    const descriptorFields = descriptor?.fields as DescriptorFields;

    if (index > maxDescriptors && !showAllDescriptors) {
      return null;
    }

    return (
      <button
        key={descriptorFields.name}
        className={descriptorFields.isPositive + ' selected'}
      >
        {getIcon(descriptorFields.category)} {descriptorFields.name}
      </button>
    );
  });
};

export const CountryArticle = ({
  country,
  descriptors,
  setSelectedCountry,
}: {
  country: CountryEntry;
  descriptors: DescriptorEntry[];
  setSelectedCountry: (country: CountryEntry) => void;
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showAllDescriptors, setShowAllDescriptors] = useState(false);

  const fields = country.fields as CountryFields;

  if (!country) return null;

  return (
    <article className="country" key={fields.name}>
      <h3>
        <span>{fields.name}</span>{' '}
        <input
          onClick={() => setSelectedCountry(country)}
          type="button"
          value="open"
        />
      </h3>

      <section className="pills">
        {getDescriptors(country, descriptors, showAllDescriptors)}

        {country.metadata.tags.length > maxDescriptors && (
          <input
            type="button"
            value={showAllDescriptors ? 'hide' : 'show more'}
            onClick={() => setShowAllDescriptors(!showAllDescriptors)}
          />
        )}
      </section>

      <p>
        {fields.notes && (
          <>
            <input
              type="button"
              value={showNotes ? 'hide notes' : 'show notes'}
              onClick={() => setShowNotes(!showNotes)}
            />
            {showNotes && (
              <ul>{fields.notes?.map((note) => <li>{note}</li>)}</ul>
            )}
          </>
        )}
        {fields.links && (
          <>
            <input
              type="button"
              value={showLinks ? 'hide links' : 'show links'}
              onClick={() => setShowLinks(!showLinks)}
            />
            {showLinks && (
              <ul>
                {fields.links?.map((link) => (
                  <li>
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </p>
    </article>
  );
};
