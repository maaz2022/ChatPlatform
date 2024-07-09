import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";
type Props = React.PropsWithChildren<{}>

const CoversationsLayout = ({children}: Props) => {
    return (
        <>
        <ItemList title="Conversation">Conversation Page</ItemList>
        {children}     
        </>         
    )
}
export default CoversationsLayout	