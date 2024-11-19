import React, { useEffect } from 'react';
import './App.css';
import { Search } from './Search';
import { CountryArticle } from './Country';
import { createClient } from 'contentful';
import {
  CountryEntry,
  CountryType,
  DescriptorEntry,
  DescriptorType,
} from './types';
import { CountryCard } from './CountryCard';
import config from './config.json';
import { useSearchParams } from 'react-router-dom';

const client = createClient(config);

const cacheKey = (search: string, selectedDescriptors: string[]) =>
  search + selectedDescriptors.join(',');

const cache = new Map<string, CountryEntry[]>();

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [descriptors, setDescriptors] = React.useState<DescriptorEntry[]>([]);
  const [countries, setCountries] = React.useState<CountryEntry[]>([]);
  const [selectedDescriptors, setSelectedDescriptors] = React.useState<
    string[]
  >(searchParams.get('descriptors')?.split(',') || []);
  const [selectedCountry, setSelectedCountry] =
    React.useState<CountryEntry | null>(null);
  const [search, setSearch] = React.useState<string>(
    searchParams.get('search') || '',
  );

  useEffect(() => {
    const params: { search?: string; descriptors?: string } = {};

    if (search.length > 0) {
      params.search = search;
    }
    if (selectedDescriptors.length > 0) {
      params.descriptors = selectedDescriptors.join(',');
    }

    setSearchParams(params);
  }, [search, selectedDescriptors, setSearchParams]);

  useEffect(() => {
    if (selectedDescriptors.length === 0 && search === '') {
      if (cache.has(cacheKey(search, selectedDescriptors))) {
        setCountries(cache.get(cacheKey(search, selectedDescriptors))!);
        return;
      }

      client
        .getEntries<CountryType>({
          content_type: 'countryState',
        })
        .then((response) => {
          setCountries(response.items);
          cache.set(cacheKey(search, selectedDescriptors), response.items);

          console.log(cache);
        })
        .catch(console.error);
    } else {
      if (cache.has(cacheKey(search, selectedDescriptors))) {
        setCountries(cache.get(cacheKey(search, selectedDescriptors))!);
        return;
      }

      const params = { content_type: 'countryState' } as any;

      if (selectedDescriptors.length > 0) {
        params['metadata.tags.sys.id[all]'] = selectedDescriptors;
      }

      if (search !== '') {
        params['fields.name[match]'] = search;
      }

      client
        .getEntries<CountryType>(params)
        .then((response) => {
          setCountries(response.items);
          cache.set(cacheKey(search, selectedDescriptors), response.items);
        })
        .catch(console.error);
    }
  }, [selectedDescriptors, search]);

  useEffect(() => {
    client
      .getEntries<DescriptorType>({
        content_type: 'descriptor',
      })
      .then((response) => setDescriptors(response.items))
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏳️‍⚧️ All hands on board 🏳️‍⚧️</h1>

        <span className="note">
          This project is made by community effort while we strive to make the
          information accurate, some can be outdated or incorrect.
        </span>

        <Search
          descriptors={descriptors}
          selectedDescriptors={selectedDescriptors}
          setSelectedDescriptors={setSelectedDescriptors}
          setSearch={setSearch}
          search={search}
        />
      </header>

      <section id="countries">
        <h2>Countries / States</h2>

        {countries.map((country) =>
          selectedCountry?.sys.id === country.sys.id ? (
            <CountryCard
              key={country.sys.id}
              descriptors={descriptors}
              country={country}
              setSelectedCountry={setSelectedCountry}
            />
          ) : (
            <CountryArticle
              country={country}
              descriptors={descriptors}
              setSelectedCountry={setSelectedCountry}
            />
          ),
        )}
      </section>
    </div>
  );
}

export default App;
