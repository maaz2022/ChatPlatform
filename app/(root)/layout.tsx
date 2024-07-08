import React from "react";
type Props =React.PropsWithChildren<{}>;

const Layout = ({children}: Props) => {
    return (
        <>{children}</>
    )
}
export default Layout