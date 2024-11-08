import { Entry, EntrySkeletonType, Link } from "contentful";

export type DescriptorFields = {
    name: string;
    isPositive: 'positive' | 'neutral' | 'negative';
    category: string;
}

export type DescriptorType = EntrySkeletonType<DescriptorFields, 'descriptor'>

export type DescriptorEntry = Entry<DescriptorType>

export type CountryFields = {
    name: string;
    region?: string[];
    notes?: string[];
    links?: string[];
    descriptors: DescriptorEntry[];
}

export type CountryType = EntrySkeletonType<CountryFields, 'countryState'>

export type CountryEntry = Entry<CountryType>
