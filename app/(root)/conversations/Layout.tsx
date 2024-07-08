import React from "react";
type Props = React.PropsWithChildren<{}>

const CoversationsLayout = ({children}: Props) => {
    return (
        <div>{children}</div>
    )
}
export default CoversationsLayout	