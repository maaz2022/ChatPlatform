import { icons, MessagesSquare, User, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";

export const useNavigation = () =>{
    const pathname = usePathname();
    const paths = useMemo(
    () => [
        {
            name: "Conversations",
            href:"/conversations",
            icon: <MessagesSquare/>,
            active: pathname.startsWith("/conversations"),
        },
        {
            name: "Friends",
            href:"/friends",
            icon: <Users/>,
            active: pathname === "/friends",
        },
    ],  
    [pathname]
    );
    return paths;
};