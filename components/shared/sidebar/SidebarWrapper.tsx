import React from "react";
type Props =React.PropsWithChildren <{}>

const SidebarWrapper= ({children}: Props) => {
    return (
        <div className="h-full w-full p-4 flex flex-col lg:flex-row gap-4">
            <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">{children}</main>
        </div>
    )
}
export default SidebarWrapper	