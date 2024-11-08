import React, { useEffect } from 'react';
import './App.css';
import { Search } from './Search';
import { CountryArticle } from './Country';
import { createClient } from 'contentful';
import { CountryEntry, CountryType, DescriptorEntry, DescriptorType } from './types';
import { uniqBy } from 'lodash'

const client = createClient({
  space: 'qqfq12nkytwb',
  accessToken: ''
})

function App() {
  const [descriptors, setDescriptors] = React.useState<DescriptorEntry[]>([])
  const [countries, setCountries] = React.useState<CountryEntry[]>([])
  const [selectedDescriptors, setSelectedDescriptors] = React.useState<string[]>([])

  useEffect(() => {
    if (selectedDescriptors.length === 0) {
      client.getEntries<CountryType>({
        content_type: 'countryState'
      })
        .then((response) => setCountries(response.items))
        .catch(console.error)
    } else {
      Promise.all(selectedDescriptors.map((descriptor) => {
        return client.getEntries<CountryType>({
          content_type: 'countryState',
          links_to_entry: descriptor
        })
      })).then((responses) => {
        const countries = uniqBy(responses.flatMap((response) => response.items), 'sys.id')
        
        setCountries(countries)
      })
    }
   
  }, [selectedDescriptors])

  useEffect(() => {
    client.getEntries<DescriptorType>({
      content_type: 'descriptor'
    })
    .then((response) => setDescriptors(response.items))
    .catch(console.error)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏳️‍⚧️ All hands on board 🏳️‍⚧️</h1>
        
        <span className='note'>This project is made by community effort while we strive to make the information accurate, some can be outdated or incorrect, <a href="">read more about the project</a></span>

        <Search descriptors={descriptors} selectedDescriptors={selectedDescriptors} setSelectedDescriptors={setSelectedDescriptors} />
      </header>
      
      <section id="countries">
        <h2>Countries / States</h2>

        {
          countries.map((country) => (
            <CountryArticle country={country} />
          ))
        } 
      </section>
    </div>
  );
}

export default App;
