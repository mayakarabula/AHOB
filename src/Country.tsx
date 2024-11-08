import { useState } from "react";
import { CountryEntry, CountryFields, DescriptorFields } from "./types";

export const CountryArticle = ({ country }: { country: CountryEntry }) => {
    const [showNotes, setShowNotes] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const [showAllPills, setShowAllPills] = useState(false);

    const fields = country.fields as CountryFields;

    if (!country)
        return null;

    return (
        <article className='country' key={fields.name}>
            <h3>
                <span>{fields.name}</span> {fields.region && <span>({fields.region.join(', ')})</span>}
            </h3>

            <section className="pills">
                {fields.descriptors.sort((a, b) => {
                        return (a.fields as DescriptorFields).category === 'positive' ? 1 : -1;
                    }).map((descriptor, index) => {
                    const descriptorFields = descriptor.fields as DescriptorFields;

                    return (showAllPills || index < 7) && <button key={descriptorFields.name} className={descriptorFields.isPositive + ' selected'}>{descriptorFields.name}</button>
                })}

                {fields.descriptors.length > 7 && <input type="button" value={showAllPills ? 'show less' : 'show more'} onClick={() => setShowAllPills(!showAllPills)} />}
            </section>
            <p>
                {fields.notes && (
                    <>
                        <input type="button" value={showNotes ? 'hide notes' : 'show notes'} onClick={() => setShowNotes(!showNotes)} />
                        {
                            showNotes && (
                                <ul>
                                    {fields.notes?.map(note => <li>{note}</li>)}
                                </ul>
                            )
                        }
                    </>
                )}
                {fields.links && (
                    <>
                        <input type="button" value={showLinks ? 'hide links' : 'show links'} onClick={() => setShowLinks(!showLinks)} />
                        {showLinks && (
                            <ul>
                                {fields.links?.map(link => <li><a href={link} target='_blank' rel="noreferrer">{link}</a></li>)}
                            </ul>
                        )}
                    </>
                )}
            </p>
        </article>
    )
}
