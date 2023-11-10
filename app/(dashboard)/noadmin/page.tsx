import { UserButton } from "@clerk/nextjs";

const NoAdmin = () => {
    return ( 
        <div>
            <h1>no admin</h1>
            <UserButton afterSignOutUrl="/" />
        </div>
     );
}
 
export default NoAdmin;