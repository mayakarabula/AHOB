import { groupBy } from 'lodash';
import { getIcon } from './Country';
import {
  CountryEntry,
  CountryFields,
  DescriptorEntry,
  DescriptorFields,
} from './types';

type CountryCardProps = {
  country: CountryEntry | null;
  descriptors: DescriptorEntry[];
  setSelectedCountry: (country: CountryEntry | null) => void;
};

export const CountryCard = (props: CountryCardProps) => {
  const { country, descriptors } = props;

  const countryFields = country?.fields as CountryFields;

  if (!country) {
    return null;
  }

  const countryDescriptors = country.metadata.tags
    .map((tag) =>
      descriptors.find((descriptor) => descriptor.sys.id === tag.sys.id),
    )
    .filter((descriptor) => descriptor)
    .sort((a, b) => {
      return (a?.fields as DescriptorFields).isPositive === 'positive' ? -1 : 1;
    });

  const descriptorCategories = groupBy(countryDescriptors, 'fields.category');

  return (
    <article className="country">
      <h3>
        <span>{countryFields.name}</span>

        {countryFields.region && (
          <span>({countryFields.region?.join(', ')})</span>
        )}

        <input
          type="button"
          value="close"
          onClick={() => props.setSelectedCountry(null)}
        />
      </h3>

      <p>
        <section className="pills">
          {Object.entries(descriptorCategories).map(
            ([category, categoryDescriptors]) => {
              return (
                <div key={category}>
                  <h4>{category}</h4>
                  {categoryDescriptors.map((descriptor) => {
                    const descriptorFields =
                      descriptor?.fields as DescriptorFields;
                    return (
                      <button
                        key={descriptor?.sys.id}
                        className={descriptorFields.isPositive + ' selected'}
                      >
                        {getIcon(descriptorFields.category)}{' '}
                        {descriptorFields.name}
                      </button>
                    );
                  })}
                </div>
              );
            },
          )}
        </section>
      </p>

      <p>
        <h3>Notes</h3>
        <ul>
          {countryFields.notes?.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </p>

      <p>
        <h3>Links</h3>
        <ul>
          {countryFields.links?.map((link) => (
            <li key={link}>
              <a href={link} target={'_blank'} rel={'noreferrer'}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      </p>
    </article>
  );
};
