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
import { Link, useSearchParams } from 'react-router-dom';
import './index.css';

const client = createClient(config);

const cacheKey = (
  search: string,
  selectedDescriptors: string[],
  page: string,
) => search + selectedDescriptors.join(',') + page;

const cache = new Map<string, { countries: CountryEntry[]; total: number }>();

const searchStep = 20;

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
  const [searchTotal, setSearchTotal] = React.useState<number>(0);
  const pageParam = searchParams.get('page') ?? '1';
  const [page, setPage] = React.useState<string>(pageParam);

  useEffect(() => {
    const params: { search?: string; descriptors?: string; page: string } = {
      page,
    };

    if (search.length > 0) {
      params.search = search;
    }
    if (selectedDescriptors.length > 0) {
      params.descriptors = selectedDescriptors.join(',');
    }

    setSearchParams(params);
  }, [search, selectedDescriptors, setSearchParams, page]);

  useEffect(() => {
    if (selectedDescriptors.length === 0 && search === '') {
      if (cache.has(cacheKey(search, selectedDescriptors, page))) {
        setCountries(
          cache.get(cacheKey(search, selectedDescriptors, page))!.countries,
        );
        setSearchTotal(
          cache.get(cacheKey(search, selectedDescriptors, page))!.total,
        );
        return;
      }

      client
        .getEntries<CountryType>({
          content_type: 'countryState',
          order: 'fields.name' as any,
          limit: searchStep,
          skip: (+page - 1) * searchStep,
        })
        .then((response) => {
          setCountries([...countries, ...response.items]);
          setSearchTotal(response.total);
          cache.set(cacheKey(search, selectedDescriptors, page), {
            countries: response.items,
            total: response.total,
          });
        })
        .catch(console.error);
    } else {
      if (cache.has(cacheKey(search, selectedDescriptors, page))) {
        setCountries(
          cache.get(cacheKey(search, selectedDescriptors, page))!.countries,
        );
        setSearchTotal(
          cache.get(cacheKey(search, selectedDescriptors, page))!.total,
        );
        return;
      }

      const params = {
        content_type: 'countryState',
        order: 'fields.name',
        limit: searchStep,
        skip: (+page - 1) * searchStep,
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
          cache.set(cacheKey(search, selectedDescriptors, page), {
            countries: response.items,
            total: response.total,
          });
        })
        .catch(console.error);
    }
  }, [selectedDescriptors, search, page, countries]);

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

        <span className="note">
          Not sure what LGR, MTF, FTM, HRT, etc means? Check our{' '}
          <Link to="/resources">resources page</Link>
        </span>

        <Search
          descriptors={descriptors}
          selectedDescriptors={selectedDescriptors}
          setSelectedDescriptors={setSelectedDescriptors}
          setSearch={setSearch}
          setPage={setPage}
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

      <section id="pagination">
        {new Array(Math.ceil(searchTotal / searchStep))
          .fill(0)
          .map((_, index) => (
            <input
              type="button"
              className={index + 1 === +page ? 'selected' : ''}
              onClick={() => {
                setPage((index + 1).toString());
                document.getElementsByTagName('html')[0].scrollTo(0, 0);
              }}
              value={index + 1}
            />
          ))}
      </section>
    </div>
  );
}

export default App;
