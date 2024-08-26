import { FunctionComponent, PropsWithChildren } from 'react';

export const FieldSection: FunctionComponent<PropsWithChildren<{label: string}>> = ({label, children}) => {
    return (
        <section className="field-row">
            <label style={{minWidth: 156}}>{label}</label>
            {children}
        </section>
    )
}
