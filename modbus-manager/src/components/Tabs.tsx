import { FunctionComponent, ReactNode, useState } from 'react';

type Props = {
    tabs: {
        title: string;
        id: string;
        component: ReactNode;
    }[]
}

export const Tabs: FunctionComponent<Props> = ({tabs}) => {
    const [active, setActive] = useState<string>(tabs[0].id);
    return (
        <section className="tabs">
            <menu role="tablist" aria-label="Sample Tabs">
                {tabs.map(({title, id}) => (
                    <button
                        key={id}
                        role="tab"
                        aria-selected={id === active}
                        aria-controls={id}
                        onClick={() => setActive(id)}
                    >
                        {title}
                    </button>
                ))}
            </menu>
            {tabs.map(({id, component}) => (
                <article role="tabpanel" hidden={id !== active} id={id} key={id}>
                    {component}
                </article>
            ))}
        </section>
    )
}
