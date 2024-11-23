import { useState } from 'react';
import { DescriptorEntry, DescriptorFields } from './types';
import { groupBy } from 'lodash';

type SearchProps = {
  descriptors: DescriptorEntry[];
  selectedDescriptors: string[];
  setSelectedDescriptors: (selectedDescriptors: string[]) => void;
  setSearch: (search: string) => void;
  setPage: (page: string) => void;
  search: string;
};

export const Search = ({
  descriptors,
  selectedDescriptors,
  setSelectedDescriptors,
  setSearch,
  setPage,
  search,
}: SearchProps) => {
  const categories: { [category: string]: DescriptorEntry[] } = groupBy(
    descriptors,
    'fields.category',
  );
  const [localSearch, setLocalSearch] = useState<string>(search);
  const [showDescriptors, setShowDescriptors] = useState<boolean>(false);

  return (
    <>
      <form
        action="#"
        id="search-input"
        onSubmit={(event) => {
          event.preventDefault();
          setSearch(localSearch);
          setPage('1');
        }}
      >
        <input
          type="text"
          placeholder="Search for a country / state"
          onChange={(event) => {
            setLocalSearch(event.target.value);
          }}
          value={localSearch}
        />

        <input type="submit" value="Search" />

        <input
          type="button"
          value={showDescriptors ? 'Hide filters' : 'Show filters'}
          onClick={() => setShowDescriptors(!showDescriptors)}
        />

        <input
          type="button"
          value="Clear filters"
          onClick={() => {
            setPage('1');
            setSelectedDescriptors([]);
            setLocalSearch('');
            setSearch('');
          }}
        />
      </form>

      <section className="pills">
        {showDescriptors &&
          Object.entries(categories).map(([category, categoryDescriptors]) => {
            return (
              <div>
                <span>{category}</span>

                <div>
                  {categoryDescriptors
                    .sort((a, b) => {
                      return (a.fields as DescriptorFields).isPositive ===
                        'positive'
                        ? -1
                        : 1;
                    })
                    .map((descriptor) => {
                      const fields = descriptor.fields as DescriptorFields;

                      return (
                        <button
                          key={fields.name}
                          className={
                            fields.isPositive +
                            (selectedDescriptors.includes(descriptor.sys.id)
                              ? ' selected'
                              : '')
                          }
                          onClick={() => {
                            setPage('1');

                            if (
                              selectedDescriptors.includes(descriptor.sys.id)
                            ) {
                              setSelectedDescriptors(
                                selectedDescriptors.filter(
                                  (id) => id !== descriptor.sys.id,
                                ),
                              );
                              return;
                            }

                            setSelectedDescriptors([
                              ...selectedDescriptors,
                              descriptor.sys.id,
                            ]);
                          }}
                        >
                          {fields.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            );
          })}
      </section>
    </>
  );
};
