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

const cacheKey = (
  search: string,
  selectedDescriptors: string[],
  searchSkip: number,
) => search + selectedDescriptors.join(',') + searchSkip;

const cache = new Map<string, CountryEntry[]>();

const searchStep = 30;

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
  const [searchSkip, setSearchSkip] = React.useState<number>(0);
  const [searchTotal, setSearchTotal] = React.useState<number>(0);

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
    setSearchSkip(0);
  }, [search, selectedDescriptors]);

  useEffect(() => {
    if (selectedDescriptors.length === 0 && search === '') {
      if (cache.has(cacheKey(search, selectedDescriptors, searchSkip))) {
        setCountries(
          cache.get(cacheKey(search, selectedDescriptors, searchSkip))!,
        );
        return;
      }

      client
        .getEntries<CountryType>({
          content_type: 'countryState',
          order: 'fields.name' as any,
          // limit: searchStep,
          // skip: searchSkip,
        })
        .then((response) => {
          setCountries([...countries, ...response.items]);
          setSearchTotal(response.total);
          cache.set(
            cacheKey(search, selectedDescriptors, searchSkip),
            response.items,
          );
        })
        .catch(console.error);
    } else {
      if (cache.has(cacheKey(search, selectedDescriptors, searchSkip))) {
        setCountries(
          cache.get(cacheKey(search, selectedDescriptors, searchSkip))!,
        );
        return;
      }

      const params = {
        content_type: 'countryState',
        order: 'fields.name',
        // limit: searchStep,
        // skip: searchSkip,
      } as any;

      if (selectedDescriptors.length > 0) {
        params['metadata.tags.sys.id[all]'] = selectedDescriptors;
      }

      if (search !== '') {
        params['fields.name[match]'] = search;
      }

      client
        .getEntries<CountryType>(params)
        .then((response) => {
          setCountries([...countries, ...response.items]);
          setSearchTotal(response.total);
          cache.set(
            cacheKey(search, selectedDescriptors, searchSkip),
            response.items,
          );
        })
        .catch(console.error);
    }
  }, [selectedDescriptors, search, searchSkip, countries]);

  useEffect(() => {
    client
      .getEntries<DescriptorType>({
        content_type: 'descriptor',
      })
      .then((response) => setDescriptors(response.items))
      .catch(console.error);
  }, []);

  const handleScroll = () => {
    const element = document.getElementsByTagName('html')[0];
    const bottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;

    if (bottom && searchSkip + searchStep < searchTotal) {
      setSearchSkip(searchSkip + searchStep);
    }
  };

  document.getElementsByTagName('body')[0].onscroll = handleScroll;

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
