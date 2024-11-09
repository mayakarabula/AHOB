import { Entry, EntrySkeletonType } from 'contentful';

export type DescriptorFields = {
  name: string;
  id: string;
  isPositive: 'positive' | 'neutral' | 'negative';
  category: string;
};

export type DescriptorType = EntrySkeletonType<DescriptorFields, 'descriptor'>;

export type DescriptorEntry = Entry<DescriptorType>;

export type CountryFields = {
  name: string;
  notes?: string[];
  links?: string[];
  descriptors: DescriptorEntry[];
  descriptorsList: string[];
};

export type CountryType = EntrySkeletonType<CountryFields, 'countryState'>;

export type CountryEntry = Entry<CountryType>;
