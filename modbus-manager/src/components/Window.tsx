import { FunctionComponent, PropsWithChildren } from 'react';

export const Window: FunctionComponent<PropsWithChildren<{title: string}>> = ({children, title}) =>
    (
        <div className="window">
            <div className="title-bar">
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div className="window-body">
                {children}
            </div>
        </div>
    )
