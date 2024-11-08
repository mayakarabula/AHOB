import { DescriptorEntry, DescriptorFields } from './types';
import { groupBy } from 'lodash'

type SearchProps = {
    descriptors: DescriptorEntry[];
    selectedDescriptors: string[];
    setSelectedDescriptors: (selectedDescriptors: string[]) => void;
}

export const Search = ({ descriptors, selectedDescriptors, setSelectedDescriptors }: SearchProps) => {
    const categories: { [category: string]: DescriptorEntry[] } = groupBy(descriptors, 'fields.category');

    return (
       <>
         <form id="search-input">
            <input type="text" placeholder="Search for a country / state / region" />
            <input type="button" value="Search" />
        </form>

        <section className="pills">
          {Object.entries(categories).map(([category, categoryDescriptors]) => {
            return (
                <div>
                    <span>{category}</span>

                    <div>
                    {categoryDescriptors.sort((a, b) => {
                        return (a.fields as DescriptorFields).category === 'positive' ? 1 : -1;
                    }).map((descriptor) => {
                        const fields = descriptor.fields as DescriptorFields;

                        return (
                            <button
                                key={fields.name}
                                className={fields.isPositive + (selectedDescriptors.includes(descriptor.sys.id) ? ' selected' : '')}
                                onClick={() => {
                                    if (selectedDescriptors.includes(descriptor.sys.id)) {
                                        setSelectedDescriptors(selectedDescriptors.filter((id) => id !== descriptor.sys.id))
                                        return;
                                    }

                                    setSelectedDescriptors([...selectedDescriptors, descriptor.sys.id])
                                }}
                            >
                                {fields.name}
                            </button>
                        )
                    })}
                    </div>
               </div>
            )
        })}
        </section>
       </>
    )
}